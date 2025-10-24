// models/Contact.ts
import mongoose, { Schema, models } from 'mongoose';

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name must not exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  phone: {
    countryCode: { 
      type: String, 
      required: [true, "Country code is required"],
      match: [/^\+\d{1,4}$/, "Invalid country code format"],
    },
    number: { 
      type: String, 
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
  },
  avatarUrl: {
    type: String,
  },
}, { timestamps: true });

const Contact = models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;