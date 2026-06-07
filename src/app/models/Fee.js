import mongoose from 'mongoose';

const FeeSchema = new mongoose.Schema({
  regNo: { type: String, required: true },
  challanNo: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  semester: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Fee || mongoose.model('Fee', FeeSchema);
