import dbConnect from '../../../lib/mongodb';
import Student from '../../../models/Student';
import Subject from '../../../models/Subject';

export async function GET() {
  try {
    await dbConnect();
    const catalog = await Subject.find({});
    return Response.json({ catalog }, { status: 200 });
  } catch (err) {
    console.error('Fetch subjects catalog error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

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

    const isEnrolled = student.subjects.some(sub => sub.code === subjectCode);
    if (isEnrolled) {
      return Response.json({ error: 'Student is already enrolled in this subject' }, { status: 400 });
    }

    const globalSubject = await Subject.findOne({ code: subjectCode });
    if (!globalSubject) {
      return Response.json({ error: 'Subject not found in catalog' }, { status: 404 });
    }

    student.subjects.push({
      code: globalSubject.code,
      name: globalSubject.name,
      credits: globalSubject.credits,
      instructor,
      section
    });

    const hasAtt = student.attendance.some(att => att.subjectCode === subjectCode);
    if (!hasAtt) {
      student.attendance.push({
        subjectCode: globalSubject.code,
        subjectName: globalSubject.name,
        totalLectures: 0,
        attendedLectures: 0
      });
    }

    await student.save();

    return Response.json({ message: 'Subject added successfully', student }, { status: 200 });
  } catch (err) {
    console.error('Add subject error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
