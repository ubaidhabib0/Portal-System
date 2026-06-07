import dbConnect from '../../../lib/mongodb';
import Student from '../../../models/Student';

export async function POST(req) {
  try {
    await dbConnect();
    const { regNo, subjectCode } = await req.json();

    if (!regNo || !subjectCode) {
      return Response.json({ error: 'Missing regNo or subjectCode' }, { status: 400 });
    }

    const cleanRegNo = regNo.toUpperCase();
    const student = await Student.findOne({ regNo: cleanRegNo });

    if (!student) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    // Filter out from subjects, attendance and results
    student.subjects = student.subjects.filter(sub => sub.code !== subjectCode);
    student.attendance = student.attendance.filter(att => att.subjectCode !== subjectCode);
    student.results = student.results.filter(res => res.subjectCode !== subjectCode);

    // Recalculate GPA
    if (student.results.length > 0) {
      const sumGpa = student.results.reduce((sum, item) => sum + item.gpa, 0);
      student.gpa = parseFloat((sumGpa / student.results.length).toFixed(2));
    } else {
      student.gpa = 0.0;
    }

    await student.save();

    return Response.json({ message: 'Subject dropped successfully', student }, { status: 200 });
  } catch (err) {
    console.error('Drop subject error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
