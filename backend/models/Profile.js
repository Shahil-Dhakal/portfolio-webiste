import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: String,
  role: { type: String, required: true }, // e.g. "SOFTWARE ENGINEER"
  avatarUrl: { type: String, default: '/assets/images/profile.png' },

  // Home / hero section
  heroHeading: { type: String, default: 'Hello' },
  heroSub: String,
  heroBody: [String], // one entry per paragraph

  // Chat page
  chatTagline: String,
  chatFirstUserMessage: String,
  chatFirstBotMessage: String,
  chatSuggestions: [String],
  chatDisclaimer: String,

  socials: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' }
  },

  contact: {
    phone: String,
    email: String
  },

  footerYear: { type: Number, default: new Date().getFullYear() }
});

export default mongoose.model('Profile', profileSchema);
