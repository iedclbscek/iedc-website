import mongoose from "mongoose";

const customFieldSchema = new mongoose.Schema({
  fieldId: {
    type: String,
    required: true,
  },
  fieldType: {
    type: String,
    required: true,
    enum: [
      "text",
      "email",
      "phone",
      "number",
      "textarea",
      "select",
      "radio",
      "checkbox",
      "file",
      "date",
    ],
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: String,
  required: {
    type: Boolean,
    default: false,
  },
  options: [String], // For select, radio, checkbox fields
  validation: {
    minLength: Number,
    maxLength: Number,
    pattern: String,
    fileTypes: [String], // For file uploads
    maxFileSize: Number,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  customFields: [
    {
      fieldId: String,
      value: mongoose.Schema.Types.Mixed,
    },
  ],
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["registered", "confirmed", "cancelled", "attended"],
    default: "registered",
  },
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
    maxLength: 200,
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
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  venue: String,
  maxParticipants: {
    type: Number,
    default: 0, // 0 means unlimited
  },
  registrationDeadline: {
    type: Date,
    required: true,
  },
  registrationFee: {
    type: Number,
    default: 0,
  },
  coordinators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  speakers: [String],
  tags: [String],
  images: [String], // Event banner/promotional images
  eventPhotos: [String], // Photos from the event (added after event)
  customRegistrationFields: [customFieldSchema],
  registrations: [registrationSchema],
  status: {
    type: String,
    enum: ["draft", "published", "cancelled", "completed"],
    default: "draft",
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual to check if event is past
eventSchema.virtual("isPast").get(function () {
  return new Date() > this.endDate;
});

// Virtual to check if registration is open
eventSchema.virtual("isRegistrationOpen").get(function () {
  const now = new Date();
  return (
    now < this.registrationDeadline &&
    !this.isPast &&
    this.status === "published"
  );
});

// Virtual to get registration count
eventSchema.virtual("registrationCount").get(function () {
  return this.registrations.length;
});

// Virtual to check if event is full
eventSchema.virtual("isFull").get(function () {
  return (
    this.maxParticipants > 0 && this.registrationCount >= this.maxParticipants
  );
});

// Include virtuals when converting to JSON
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

// Update the updatedAt field before saving
eventSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ coordinators: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
