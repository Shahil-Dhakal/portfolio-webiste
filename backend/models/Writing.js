import mongoose from 'mongoose';

const writingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['poems', 'blogs', 'stories-fiction'],
      required: true
    },
    excerpt: String, // short teaser shown in the collection list
    content: { type: String, required: true }, // full text, one paragraph per line
    order: { type: Number, default: 0 }
  },
  { timestamps: true } // adds createdAt/updatedAt — used as the "published" date
);

export default mongoose.model('Writing', writingSchema);