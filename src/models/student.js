import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    zprn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      validate: {
        validator: (v) => /^(\+?\d{1,4}[-.\s]?)?(\d{10})$/.test(v),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    class: {
      type: String,
      required: true,
      enum: ["First Year", "Second Year", "Third Year", "Final Year"],
    },
    department: {
      type: String,
      required: true,
      enum: ["IT", "CSE", "MECH", "CIVIL", "ENTC"], 
    },
    rollNo: {
      type: String,
      required: true,
      min: 4,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);


const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
