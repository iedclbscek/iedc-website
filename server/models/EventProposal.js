import mongoose from "mongoose";

const eventProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Event title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Event description is required"],
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  shortDescription: {
    type: String,
    required: [true, "Short description is required"],
    maxlength: [200, "Short description cannot exceed 200 characters"],
  },
  category: {
    type: String,
    required: [true, "Event category is required"],
    enum: [
      "Workshop",
      "Bootcamp", 
      "Hackathon",
      "Competition",
      "Seminar",
      "Conference",
      "Networking",
      "Startup Pitch",
      "Innovation Challenge",
      "Ideathon",
      "Other"
    ],
  },
  proposedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  proposerName: {
    type: String,
    required: true,
  },
  proposerEmail: {
    type: String,
    required: true,
  },
  proposerContact: {
    type: String,
    trim: true,
  },
  targetAudience: {
    type: String,
    required: [true, "Target audience is required"],
    enum: [
      "All Students",
      "1st Year",
      "2nd Year", 
      "3rd Year",
      "4th Year",
      "Specific Department",
      "Entrepreneurs",
      "Developers",
      "Designers",
      "Other"
    ],
  },
  estimatedDuration: {
    type: String,
    required: [true, "Estimated duration is required"],
  },
  estimatedParticipants: {
    type: Number,
    required: [true, "Estimated number of participants is required"],
    min: [1, "At least 1 participant expected"],
  },
  proposedDate: {
    type: Date,
    required: [true, "Proposed date is required"],
  },
  alternativeDate: {
    type: Date,
  },
  venue: {
    type: String,
    required: [true, "Venue preference is required"],
  },
  budget: {
    estimated: {
      type: Number,
      default: 0,
    },
    breakdown: {
      type: String,
      maxlength: [1000, "Budget breakdown cannot exceed 1000 characters"],
    },
    sponsorshipRequired: {
      type: Boolean,
      default: false,
    },
  },
  resources: {
    techRequirements: {
      type: String,
      maxlength: [500, "Tech requirements cannot exceed 500 characters"],
    },
    materialNeeds: {
      type: String, 
      maxlength: [500, "Material needs cannot exceed 500 characters"],
    },
    speakerRequired: {
      type: Boolean,
      default: false,
    },
    speakerDetails: {
      type: String,
      maxlength: [500, "Speaker details cannot exceed 500 characters"],
    },
  },
  objectives: {
    type: String,
    required: [true, "Event objectives are required"],
    maxlength: [1000, "Objectives cannot exceed 1000 characters"],
  },
  expectedOutcomes: {
    type: String,
    maxlength: [1000, "Expected outcomes cannot exceed 1000 characters"],
  },
  additionalNotes: {
    type: String,
    maxlength: [1000, "Additional notes cannot exceed 1000 characters"],
  },
  status: {
    type: String,
    enum: ["pending", "under_review", "approved", "rejected", "implemented"],
    default: "pending",
  },
  reviewNotes: {
    type: String,
    maxlength: [1000, "Review notes cannot exceed 1000 characters"],
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewedAt: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  tags: [{
    type: String,
    trim: true,
  }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  implementedEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
}, {
  timestamps: true,
});

// Indexes for performance
eventProposalSchema.index({ proposedBy: 1 });
eventProposalSchema.index({ status: 1 });
eventProposalSchema.index({ category: 1 });
eventProposalSchema.index({ proposedDate: 1 });
eventProposalSchema.index({ createdAt: -1 });

// Virtual for proposal age in days
eventProposalSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to check if proposal is overdue for review
eventProposalSchema.methods.isOverdueForReview = function() {
  return this.status === 'pending' && this.ageInDays > 7;
};

const EventProposal = mongoose.model("EventProposal", eventProposalSchema);

export default EventProposal;
