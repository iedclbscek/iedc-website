import express from "express";
import Event from "../models/Event.js";
import EventProposal from "../models/EventProposal.js";
import User from "../models/User.js";
import { authenticateToken as auth, authorizeRoles } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/events");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "event-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// GET /api/events - Get all events (public)
router.get("/", async (req, res) => {
  try {
    const {
      category,
      status = "published",
      featured,
      upcoming,
      past,
      limit = 50,
      page = 1,
    } = req.query;

    let query = {};

    // Filter by status (default to published for public)
    if (status) {
      query.status = status;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by featured
    if (featured === "true") {
      query.featured = true;
    }

    // Filter by time
    const now = new Date();
    if (upcoming === "true") {
      query.startDate = { $gte: now };
    } else if (past === "true") {
      query.endDate = { $lt: now };
    }

    const events = await Event.find(query)
      .populate("coordinators", "name email profilePicture")
      .populate("createdBy", "name email")
      .sort({ startDate: upcoming === "true" ? 1 : -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalEvents = await Event.countDocuments(query);

    res.json({
      success: true,
      events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalEvents / parseInt(limit)),
        totalEvents,
        hasNext: page * limit < totalEvents,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
});

// GET /api/events/dashboard - Get all events for dashboard (requires auth)
router.get("/dashboard", auth, async (req, res) => {
  try {
    const { category, status, coordinated, limit = 50, page = 1 } = req.query;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by coordinated events
    if (coordinated === "true") {
      query.coordinators = req.user.id;
    }

    const events = await Event.find(query)
      .populate("coordinators", "name email profilePicture role")
      .populate("createdBy", "name email")
      .populate("registrations.userId", "name email profilePicture")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalEvents = await Event.countDocuments(query);

    res.json({
      success: true,
      events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalEvents / parseInt(limit)),
        totalEvents,
        hasNext: page * limit < totalEvents,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
});

// GET /api/events/:id - Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("coordinators", "name email profilePicture role yearlyRoles")
      .populate("createdBy", "name email")
      .populate("registrations.userId", "name email profilePicture");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching event",
      error: error.message,
    });
  }
});

// POST /api/events - Create new event (requires auth)
router.post("/", auth, upload.array("images", 5), async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      category,
      startDate,
      endDate,
      location,
      venue,
      maxParticipants,
      registrationDeadline,
      registrationFee,
      coordinators,
      speakers,
      tags,
      customRegistrationFields,
      status,
      featured,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !shortDescription ||
      !category ||
      !startDate ||
      !endDate ||
      !location ||
      !registrationDeadline
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const regDeadline = new Date(registrationDeadline);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    if (regDeadline > start) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline must be before event start date",
      });
    }

    // Process uploaded images
    const imageUrls = req.files
      ? req.files.map((file) => `/uploads/events/${file.filename}`)
      : [];

    // Parse coordinators array if it's a string
    let coordinatorIds = [];
    if (coordinators) {
      coordinatorIds =
        typeof coordinators === "string"
          ? JSON.parse(coordinators)
          : coordinators;
    }

    // Parse other arrays
    let speakersList = [];
    if (speakers) {
      speakersList =
        typeof speakers === "string" ? JSON.parse(speakers) : speakers;
    }

    let tagsList = [];
    if (tags) {
      tagsList = typeof tags === "string" ? JSON.parse(tags) : tags;
    }

    let customFields = [];
    if (customRegistrationFields) {
      customFields =
        typeof customRegistrationFields === "string"
          ? JSON.parse(customRegistrationFields)
          : customRegistrationFields;
    }

    const event = new Event({
      title,
      description,
      shortDescription,
      category,
      startDate: start,
      endDate: end,
      location,
      venue,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : 0,
      registrationDeadline: regDeadline,
      registrationFee: registrationFee ? parseFloat(registrationFee) : 0,
      coordinators: coordinatorIds,
      speakers: speakersList,
      tags: tagsList,
      images: imageUrls,
      customRegistrationFields: customFields,
      status: status || "draft",
      featured: featured === "true",
      createdBy: req.user.id,
    });

    await event.save();

    // Populate the response
    await event.populate("coordinators", "name email profilePicture role");
    await event.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating event",
      error: error.message,
    });
  }
});

// PUT /api/events/:id - Update event (requires auth + coordinator/creator)
router.put("/:id", auth, upload.array("newImages", 5), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is creator or coordinator
    const isCreator = event.createdBy.toString() === req.user.id;
    const isCoordinator = event.coordinators.some(
      (coord) => coord.toString() === req.user.id
    );

    if (!isCreator && !isCoordinator) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event",
      });
    }

    // Update fields
    const updateFields = {};
    const allowedFields = [
      "title",
      "description",
      "shortDescription",
      "category",
      "startDate",
      "endDate",
      "location",
      "venue",
      "maxParticipants",
      "registrationDeadline",
      "registrationFee",
      "coordinators",
      "speakers",
      "tags",
      "customRegistrationFields",
      "status",
      "featured",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (
          field === "coordinators" ||
          field === "speakers" ||
          field === "tags" ||
          field === "customRegistrationFields"
        ) {
          updateFields[field] =
            typeof req.body[field] === "string"
              ? JSON.parse(req.body[field])
              : req.body[field];
        } else if (field === "maxParticipants" || field === "registrationFee") {
          updateFields[field] = parseFloat(req.body[field]) || 0;
        } else if (field === "featured") {
          updateFields[field] = req.body[field] === "true";
        } else {
          updateFields[field] = req.body[field];
        }
      }
    });

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(
        (file) => `/uploads/events/${file.filename}`
      );
      updateFields.images = [...event.images, ...newImageUrls];
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate("coordinators", "name email profilePicture role")
      .populate("createdBy", "name email");

    res.json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: error.message,
    });
  }
});

// POST /api/events/:id/photos - Add event photos (requires auth + coordinator/creator)
router.post(
  "/:id/photos",
  auth,
  upload.array("photos", 20),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      // Check if user is creator or coordinator
      const isCreator = event.createdBy.toString() === req.user.id;
      const isCoordinator = event.coordinators.some(
        (coord) => coord.toString() === req.user.id
      );

      if (!isCreator && !isCoordinator) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to add photos to this event",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No photos uploaded",
        });
      }

      const photoUrls = req.files.map(
        (file) => `/uploads/events/${file.filename}`
      );

      event.eventPhotos.push(...photoUrls);
      await event.save();

      res.json({
        success: true,
        message: "Photos added successfully",
        photos: photoUrls,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error adding photos",
        error: error.message,
      });
    }
  }
);

// POST /api/events/:id/register - Register for event
router.post("/:id/register", upload.any(), async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    console.log("Files received:", req.files);
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        message: "Registration is closed for this event",
      });
    }

    if (event.isFull) {
      return res.status(400).json({
        success: false,
        message: "Event is full",
      });
    }

    // Get data from request body
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone || "";

    // Handle customFields (could be string or already parsed)
    let customFields = req.body.customFields || [];
    if (typeof customFields === "string") {
      try {
        customFields = JSON.parse(customFields);
      } catch (e) {
        console.error("Error parsing customFields:", e);
        customFields = [];
      }
    }

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Check if already registered
    const existingRegistration = event.registrations.find(
      (reg) => reg.email === email
    );
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this event",
      });
    }

    // Process any uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fieldName = file.fieldname;
        if (fieldName.startsWith("customField_")) {
          const fieldId = fieldName.replace("customField_", "");
          const fieldIndex = customFields.findIndex(
            (f) => f.fieldId === fieldId
          );

          if (fieldIndex !== -1) {
            customFields[fieldIndex].value = `/uploads/events/${file.filename}`;
          }
        }
      }
    }

    const registration = {
      name,
      email,
      phone,
      customFields: customFields || [],
      registeredAt: new Date(),
    };

    event.registrations.push(registration);
    await event.save();

    res.json({
      success: true,
      message: "Registration successful",
      registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering for event",
      error: error.message,
    });
  }
});

// DELETE /api/events/:id - Delete event (requires auth + creator)
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only creator can delete
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event",
      });
    }

    // Delete associated images
    const allImages = [...event.images, ...event.eventPhotos];
    allImages.forEach((imagePath) => {
      const fullPath = path.join(__dirname, "../", imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
});

// EVENT PROPOSAL ROUTES

// POST /api/events/propose - Submit new event proposal
router.post("/propose", auth, async (req, res) => {
  try {
    const proposalData = {
      ...req.body,
      proposedBy: req.user._id,
      proposerName: req.user.name,
      proposerEmail: req.user.email,
    };

    const proposal = new EventProposal(proposalData);
    await proposal.save();

    res.status(201).json({
      success: true,
      message: "Event proposal submitted successfully",
      proposal: proposal,
    });
  } catch (error) {
    console.error("Error creating proposal:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Error submitting proposal",
      error: error.message,
    });
  }
});

// GET /api/events/proposals - Get event proposals
router.get("/proposals", auth, async (req, res) => {
  try {
    const { status, category, proposedBy, page = 1, limit = 10 } = req.query;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'nodal_officer';
    
    // Build query
    const query = {};
    
    // Non-admin users can only see their own proposals unless they're viewing all
    if (!isAdmin) {
      query.proposedBy = req.user._id;
    } else if (proposedBy === 'me') {
      query.proposedBy = req.user._id;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const proposals = await EventProposal.find(query)
      .populate('proposedBy', 'name email role')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await EventProposal.countDocuments(query);

    res.json({
      success: true,
      proposals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching proposals",
      error: error.message,
    });
  }
});

// GET /api/events/proposals/:id - Get specific proposal
router.get("/proposals/:id", auth, async (req, res) => {
  try {
    const proposal = await EventProposal.findById(req.params.id)
      .populate('proposedBy', 'name email role')
      .populate('reviewedBy', 'name email');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    // Check if user has permission to view this proposal
    const isAdmin = req.user.role === 'admin' || req.user.role === 'nodal_officer';
    const isOwner = proposal.proposedBy._id.toString() === req.user._id.toString();
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      proposal,
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching proposal",
      error: error.message,
    });
  }
});

// PATCH /api/events/proposals/:id/status - Update proposal status (admin only)
router.patch("/proposals/:id/status", auth, authorizeRoles("admin", "nodal_officer"), async (req, res) => {
  try {
    const { status, reviewNotes, priority } = req.body;
    
    const proposal = await EventProposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    proposal.status = status;
    proposal.reviewedBy = req.user._id;
    proposal.reviewedAt = new Date();
    
    if (reviewNotes) {
      proposal.reviewNotes = reviewNotes;
    }
    
    if (priority) {
      proposal.priority = priority;
    }

    await proposal.save();

    res.json({
      success: true,
      message: `Proposal ${status} successfully`,
      proposal,
    });
  } catch (error) {
    console.error("Error updating proposal status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating proposal status",
      error: error.message,
    });
  }
});

// PUT /api/events/proposals/:id - Update proposal (owner only)
router.put("/proposals/:id", auth, async (req, res) => {
  try {
    const proposal = await EventProposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    // Check if user is the owner
    if (proposal.proposedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only edit your own proposals.",
      });
    }

    // Only allow editing if proposal is pending or rejected
    if (!['pending', 'rejected'].includes(proposal.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot edit proposal in current status",
      });
    }

    // Update proposal
    Object.assign(proposal, req.body);
    
    // If it was rejected and now being updated, reset status to pending
    if (proposal.status === 'rejected') {
      proposal.status = 'pending';
      proposal.reviewNotes = '';
      proposal.reviewedBy = undefined;
      proposal.reviewedAt = undefined;
    }

    await proposal.save();

    res.json({
      success: true,
      message: "Proposal updated successfully",
      proposal,
    });
  } catch (error) {
    console.error("Error updating proposal:", error);
    res.status(400).json({
      success: false,
      message: "Error updating proposal",
      error: error.message,
    });
  }
});

// DELETE /api/events/proposals/:id - Delete proposal
router.delete("/proposals/:id", auth, async (req, res) => {
  try {
    const proposal = await EventProposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin' || req.user.role === 'nodal_officer';
    const isOwner = proposal.proposedBy.toString() === req.user._id.toString();
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Only allow deletion if proposal is pending or rejected
    if (!['pending', 'rejected'].includes(proposal.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete proposal in current status",
      });
    }

    await EventProposal.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Proposal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting proposal",
      error: error.message,
    });
  }
});

// POST /api/events/proposals/:id/implement - Convert proposal to actual event (admin only)
router.post("/proposals/:id/implement", auth, authorizeRoles("admin", "nodal_officer"), async (req, res) => {
  try {
    const proposal = await EventProposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    if (proposal.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: "Only approved proposals can be implemented",
      });
    }

    // Create event from proposal
    const eventData = {
      title: proposal.title,
      description: proposal.description,
      shortDescription: proposal.shortDescription,
      category: proposal.category,
      targetAudience: proposal.targetAudience,
      date: proposal.proposedDate,
      venue: proposal.venue,
      duration: proposal.estimatedDuration,
      maxParticipants: proposal.estimatedParticipants,
      organizer: proposal.proposedBy,
      isPublic: true,
      status: 'draft',
      tags: proposal.tags || [],
      ...req.body // Allow additional event-specific data from request
    };

    const event = new Event(eventData);
    await event.save();

    // Update proposal status
    proposal.status = 'implemented';
    proposal.implementedEventId = event._id;
    await proposal.save();

    res.json({
      success: true,
      message: "Proposal implemented as event successfully",
      event,
      proposal,
    });
  } catch (error) {
    console.error("Error implementing proposal:", error);
    res.status(500).json({
      success: false,
      message: "Error implementing proposal",
      error: error.message,
    });
  }
});

export default router;
