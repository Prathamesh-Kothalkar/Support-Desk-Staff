const { default: mongoose } = require("mongoose");

const staffSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },
    staffId: {
        type: Number,
        required: true,
        unique: true,
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
    department: {
        type: String,
        required: true,
        enum: ["IT", "CSE", "MECH", "CIVIL", "ENTC"],
    },
    password: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
    }
);

const Staff=mongoose.models.Staff || mongoose.model("Staff", staffSchema);

export default Staff;