import mongoose from 'mongoose';

const CredentialSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  securityQuestion: { type: String, required: true, default: 'What is your favorite pet?' },
  securityAnswer: { type: String, required: true, default: 'Cat' }
}, { timestamps: true });

export default mongoose.models.Credential || mongoose.model('Credential', CredentialSchema);
