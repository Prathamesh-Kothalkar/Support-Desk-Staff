import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  pcNumber: { type: Number, required: true },
  labName: { type: String, required: true },
  labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true }, 
  department: { 
    type: String, 
    required: true, 
    enum: ["IT", "CSE", "MECH", "CIVIL", "ENTC"] 
  },
  issueType: { type: String, enum: ["Software", "Hardware", "Network"], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Open", "In Progress", "Resolved"], default: "Open" },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  reportedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
});

issueSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "Resolved") {
    this.resolvedAt = new Date();
  }
  next();
});

const Issue = mongoose.models.Issue || mongoose.model("Issue", issueSchema);

export default Issue;
