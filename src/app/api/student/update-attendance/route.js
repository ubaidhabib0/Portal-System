import dbConnect from '../../../lib/mongodb';
import Student from '../../../models/Student';

export async function POST(req) {
  try {
    await dbConnect();
    const { 
      regNo, 
      subjectCode, 
      subjectName, 
      totalLectures, 
      attendedLectures 
    } = await req.json();

    if (!regNo || !subjectCode || !subjectName || totalLectures === undefined || attendedLectures === undefined) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanRegNo = regNo.toUpperCase();
    const student = await Student.findOne({ regNo: cleanRegNo });

    if (!student) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    const attIndex = student.attendance.findIndex(att => att.subjectCode === subjectCode);

    if (attIndex > -1) {
      student.attendance[attIndex].totalLectures = totalLectures;
      student.attendance[attIndex].attendedLectures = attendedLectures;
    } else {
      student.attendance.push({
        subjectCode,
        subjectName,
        totalLectures,
        attendedLectures
      });
    }

    await student.save();

    return Response.json({ message: 'Attendance updated successfully', student }, { status: 200 });
  } catch (err) {
    console.error('Update attendance error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
