// models/Contact.ts
import mongoose, { Schema, models } from 'mongoose';

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    countryCode: { type: String, required: true },
    number: { type: String, required: true },
  },
  avatarUrl: {
    type: String,
  },
}, { timestamps: true }); // createdAt aur updatedAt automatically banenge

const Contact = models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;