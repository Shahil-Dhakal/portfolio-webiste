import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true },
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ContactMessage', contactMessageSchema);
