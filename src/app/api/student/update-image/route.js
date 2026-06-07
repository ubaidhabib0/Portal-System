import dbConnect from '../../../lib/mongodb';
import Student from '../../../models/Student';

export async function POST(req) {
  try {
    await dbConnect();
    const { regNo, avatarUrl } = await req.json();

    if (!regNo || !avatarUrl) {
      return Response.json({ error: 'Registration number and avatar URL are required' }, { status: 400 });
    }

    const cleanRegNo = regNo.toUpperCase();
    const student = await Student.findOneAndUpdate(
      { regNo: cleanRegNo },
      { avatar: avatarUrl },
      { new: true }
    );

    if (!student) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    return Response.json({ message: 'Profile image updated successfully', student }, { status: 200 });
  } catch (err) {
    console.error('Update avatar error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
