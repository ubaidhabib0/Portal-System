export const dynamic = 'force-dynamic';
import dbConnect from '../../../lib/mongodb';
import Student from '../../../models/Student';

export async function POST(req) {
  try {
    await dbConnect();
    const { regNo, subjectCode, instructor, section } = await req.json();

    if (!regNo || !subjectCode || !instructor || !section) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanRegNo = regNo.toUpperCase();
    const student = await Student.findOne({ regNo: cleanRegNo });

    if (!student) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    const subIndex = student.subjects.findIndex(sub => sub.code === subjectCode);

    if (subIndex === -1) {
      return Response.json({ error: 'Student is not enrolled in this subject' }, { status: 400 });
    }

    student.subjects[subIndex].instructor = instructor;
    student.subjects[subIndex].section = section;

    await student.save();

    return Response.json({ message: 'Instructor and section changed successfully', student }, { status: 200 });
  } catch (err) {
    console.error('Change instructor error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
