import mongoose from "mongoose";

const eventProposalSchema = new mongoose.Schema(
  {
    // Proposer Information
    proposerName: {
      type: String,
      required: true,
    },
    proposerEmail: {
      type: String,
      required: true,
    },
    proposerPhone: {
      type: String,
    },
    organization: {
      type: String,
    },

    // Event Details
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Workshop",
        "Bootcamp",
        "Hackathon",
        "Competition",
        "Seminar",
        "Conference",
        "Networking",
        "Other",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    expectedParticipants: {
      type: Number,
    },

    // Additional Information
    budget: {
      type: String,
    },
    requirements: {
      type: String,
    },
    objectives: {
      type: String,
    },
    targetAudience: {
      type: String,
    },
    additionalNotes: {
      type: String,
    },

    // Proposal Status and Metadata
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "under_review"],
      default: "pending",
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    proposalId: {
      type: String,
      unique: true,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate proposal ID before saving
eventProposalSchema.pre("save", function (next) {
  if (!this.proposalId) {
    this.proposalId = `PROP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }
  next();
});

const EventProposal = mongoose.model("EventProposal", eventProposalSchema);

export default EventProposal;
