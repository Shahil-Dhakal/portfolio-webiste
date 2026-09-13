import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  description: String,
  // matches the .project-image--{variant} gradient classes in style.css —
  // used as the fallback whenever no imageUrl has been uploaded
  imageVariant: {
    type: String,
    enum: ['dark', 'warm', 'slate', 'green'],
    default: 'dark'
  },
  // optional uploaded image (e.g. "/uploads/169...-screenshot.png");
  // when present it's shown instead of the gradient placeholder
  imageUrl: { type: String, default: '' },
  order: { type: Number, default: 0 }
});

export default mongoose.model('Project', projectSchema);
