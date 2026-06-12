import dbConnect from '../../../lib/mongodb';
import Student from '../../../models/Student';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { regNo } = params;
    
    if (!regNo) {
      return Response.json({ error: 'Registration number is required' }, { status: 400 });
    }

    const cleanRegNo = regNo.toUpperCase();
    const student = await Student.findOne({ regNo: cleanRegNo });
    
    if (!student) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    return Response.json({ student }, { status: 200 });
  } catch (err) {
    console.error('Fetch student error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
