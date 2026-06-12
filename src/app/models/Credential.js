import mongoose from 'mongoose';

const CredentialSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  securityQuestion: { type: String, required: true },
  securityAnswer: { type: String, required: true }
}, { timestamps: true });

// IMPORTANT FIX for Vercel hot reload + build
export default mongoose.models.Credential ||
  mongoose.model('Credential', CredentialSchema);