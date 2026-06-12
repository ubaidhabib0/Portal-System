import mongoose from 'mongoose';

const EnrolledSubjectSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  instructor: { type: String, required: true },
  section: { type: String, required: true }
});

const AttendanceSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  totalLectures: { type: Number, required: true, default: 0 },
  attendedLectures: { type: Number, required: true, default: 0 }
});

const ResultSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  marksObtained: { type: Number, required: true, default: 0 },
  totalMarks: { type: Number, required: true, default: 100 },
  grade: { type: String, required: true, default: 'F' },
  gpa: { type: Number, required: true, default: 0.0 }
});

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  session: { type: String, required: true },
  gpa: { type: Number, required: true, default: 0.0 },
  avatar: { type: String, default: '/default.png' },
  phone: { type: String, default: '+92 300 1234567' },
  university: { type: String, default: 'Apex University of Science & Technology' },
  subjects: [EnrolledSubjectSchema],
  attendance: [AttendanceSchema],
  results: [ResultSchema]
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
