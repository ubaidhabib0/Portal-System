import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  credits: { type: Number, required: true, default: 3 },
  instructors: [{ type: String }],
  sections: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
