import dbConnect from '../../lib/mongodb';
import Student from '../../models/Student';
import Credential from '../../models/Credential';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-12345!';

export async function POST(req) {
  try {
    await dbConnect();
    const { regNo, password } = await req.json();

    if (!regNo || !password) {
      return Response.json({ error: 'Registration number and password are required.' }, { status: 400 });
    }

    const cleanRegNo = regNo.trim().toUpperCase();

    // Check credentials
    const credential = await Credential.findOne({ regNo: cleanRegNo });
    if (!credential) {
      return Response.json({ error: 'Invalid registration number or password.' }, { status: 400 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, credential.password);
    if (!isMatch) {
      return Response.json({ error: 'Invalid registration number or password.' }, { status: 400 });
    }

    // Get Student details
    const student = await Student.findOne({ regNo: cleanRegNo });
    if (!student) {
      return Response.json({ error: 'Student details not found.' }, { status: 404 });
    }

    // Sign JWT
    const token = jwt.sign({ regNo: cleanRegNo }, JWT_SECRET, { expiresIn: '1d' });

    return Response.json({
      message: 'Login successful',
      token,
      student
    }, { status: 200 });
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
