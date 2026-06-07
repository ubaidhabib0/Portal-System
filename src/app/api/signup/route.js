import dbConnect from '../../lib/mongodb';
import Student from '../../models/Student';
import Credential from '../../models/Credential';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await dbConnect();
    const { 
      name, 
      regNo, 
      email, 
      department, 
      session, 
      password, 
      securityQuestion, 
      securityAnswer 
    } = await req.json();

    // Validate input
    if (!name || !regNo || !email || !department || !session || !password) {
      return Response.json({ error: 'All core fields are required.' }, { status: 400 });
    }

    // Normalise regNo
    const cleanRegNo = regNo.trim().toUpperCase();

    // Check if student exists
    const existingStudent = await Student.findOne({ 
      $or: [{ regNo: cleanRegNo }, { email: email.toLowerCase() }] 
    });
    if (existingStudent) {
      return Response.json({ error: 'Student with this registration number or email already exists.' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Credential
    await Credential.create({
      regNo: cleanRegNo,
      password: hashedPassword,
      securityQuestion: securityQuestion || 'What is your favorite pet?',
      securityAnswer: securityAnswer || 'Cat'
    });

    // Create Student
    const student = await Student.create({
      name,
      regNo: cleanRegNo,
      email: email.toLowerCase(),
      department,
      session,
      avatar: '/default.png',
      subjects: [],
      attendance: [],
      results: []
    });

    return Response.json({ message: 'Student registered successfully', student }, { status: 201 });
  } catch (err) {
    console.error('Signup error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
