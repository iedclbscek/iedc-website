import express from "express";
import Event from "../models/Event.js";
import EventProposal from "../models/EventProposal.js";
import User from "../models/User.js";
import { authenticateToken as auth } from "../middleware/auth.js";
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

// GET /api/events/proposals - Get all event proposals (admin only)
router.get("/proposals", auth, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    let query = {};

    // Filter by status if provided
    if (status && status !== "all") {
      query.status = status;
    }

    const proposals = await EventProposal.find(query)
      .populate("reviewedBy", "name email")
      .sort({ submittedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalProposals = await EventProposal.countDocuments(query);

    res.json({
      success: true,
      proposals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProposals / parseInt(limit)),
        totalProposals,
        hasMore: parseInt(page) * parseInt(limit) < totalProposals,
      },
    });
  } catch (error) {
    console.error("Error fetching event proposals:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching event proposals",
      error: error.message,
    });
  }
});

// GET /api/events/proposals/:id - Get specific proposal (admin only)
router.get("/proposals/:id", auth, async (req, res) => {
  try {
    const proposal = await EventProposal.findById(req.params.id).populate(
      "reviewedBy",
      "name email"
    );

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
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

// PUT /api/events/proposals/:id/review - Review a proposal (admin only)
router.put("/proposals/:id/review", auth, async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    if (!["approved", "rejected", "under_review"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be 'approved', 'rejected', or 'under_review'",
      });
    }

    const proposal = await EventProposal.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes,
        reviewed: true,
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
      { new: true }
    ).populate("reviewedBy", "name email");

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    res.json({
      success: true,
      message: "Proposal reviewed successfully",
      proposal,
    });
  } catch (error) {
    console.error("Error reviewing proposal:", error);
    res.status(500).json({
      success: false,
      message: "Error reviewing proposal",
      error: error.message,
    });
  }
});

// POST /api/events/proposals/:id/convert - Convert proposal to event (admin only)
router.post("/proposals/:id/convert", auth, async (req, res) => {
  try {
    const proposal = await EventProposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    if (proposal.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved proposals can be converted to events",
      });
    }

    // Create new event from proposal
    const newEvent = new Event({
      title: proposal.title,
      category: proposal.category,
      description: proposal.description,
      shortDescription: proposal.shortDescription,
      startDate: proposal.startDate,
      endDate: proposal.endDate,
      startTime: proposal.startTime,
      endTime: proposal.endTime,
      location: proposal.location,
      maxParticipants: proposal.expectedParticipants || 0,
      status: "draft", // Start as draft for further editing
      createdBy: req.user.id,
      coordinators: [req.user.id],
      registrationFields: [], // Default empty, can be configured later
      images: [],
      featured: false,
      isRegistrationOpen: false,
    });

    await newEvent.save();

    // Update proposal status
    proposal.status = "approved";
    proposal.reviewed = true;
    proposal.reviewedBy = req.user.id;
    proposal.reviewedAt = new Date();
    await proposal.save();

    res.json({
      success: true,
      message: "Proposal converted to event successfully",
      event: newEvent,
      proposal,
    });
  } catch (error) {
    console.error("Error converting proposal to event:", error);
    res.status(500).json({
      success: false,
      message: "Error converting proposal to event",
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

// POST /api/events/propose - Submit event proposal (public)
router.post("/propose", async (req, res) => {
  try {
    const {
      // Proposer Information
      proposerName,
      proposerEmail,
      proposerPhone,
      organization,

      // Event Details
      title,
      category,
      description,
      shortDescription,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      expectedParticipants,

      // Additional Information
      budget,
      requirements,
      objectives,
      targetAudience,
      additionalNotes,
    } = req.body;

    // Validate required fields
    if (
      !proposerName ||
      !proposerEmail ||
      !title ||
      !category ||
      !description ||
      !shortDescription ||
      !startDate ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create and save event proposal to database
    const proposalId = `PROP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const eventProposal = new EventProposal({
      // Proposer Information
      proposerName,
      proposerEmail,
      proposerPhone,
      organization,

      // Event Details
      title,
      category,
      description,
      shortDescription,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      expectedParticipants: expectedParticipants
        ? parseInt(expectedParticipants)
        : null,

      // Additional Information
      budget,
      requirements,
      objectives,
      targetAudience,
      additionalNotes,

      // Metadata
      proposalId,
      status: "pending",
      reviewed: false,
    });

    await eventProposal.save();

    console.log("Event Proposal Saved:", eventProposal);

    res.json({
      success: true,
      message:
        "Event proposal submitted successfully! We will review your proposal and get back to you soon.",
      proposalId: eventProposal.proposalId,
    });
  } catch (error) {
    console.error("Error submitting event proposal:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting event proposal",
      error: error.message,
    });
  }
});

export default router;
