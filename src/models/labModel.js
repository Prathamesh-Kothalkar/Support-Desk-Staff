const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
    labName: { type: String, required: true },
    department: { type: String, enum: ["IT", "CSE", "MECH", "CIVIL", "ENTC"], required: true },
    totalPCs: { type: Number, required: true },
    workingPCs: { type: Number, default: 0 },
    faultyPCs: { type: Number, default: 0 },
  });

const Lab = mongoose.models.Lab || mongoose.model("Lab", labSchema);

module.exports = Lab;
