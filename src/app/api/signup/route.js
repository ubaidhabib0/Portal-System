import dbConnect from '../../lib/mongodb';
import Student from '../../models/Student';
import Credential from '../../models/Credential';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    console.log('Signup Request:', body);

    let {
      name,
      regNo,
      email,
      department,
      session,
      password,
      securityQuestion,
      securityAnswer,
      phone,
      university,
    } = body;

    // Normalize values
    name = name?.trim();
    regNo = regNo?.trim().toUpperCase();
    email = email?.trim().toLowerCase();
    department = department?.trim();
    session = session?.trim();
    password = password?.trim();
    securityQuestion = securityQuestion?.trim();
    securityAnswer = securityAnswer?.trim();
    phone = phone?.trim();
    university = university?.trim();

    // Required fields validation
    if (
      !name ||
      !regNo ||
      !email ||
      !department ||
      !session ||
      !password
    ) {
      return Response.json(
        {
          error:
            'Name, Registration Number, Email, Department, Session and Password are required.',
        },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return Response.json(
        {
          error: 'Password must be at least 6 characters long.',
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return Response.json(
        {
          error: 'Invalid email address.',
        },
        { status: 400 }
      );
    }

    // Check duplicate registration number
    const regExists = await Student.findOne({
      regNo,
    });

    if (regExists) {
      return Response.json(
        {
          error:
            'Registration number already exists.',
        },
        { status: 400 }
      );
    }

    // Check duplicate email
    const emailExists = await Student.findOne({
      email,
    });

    if (emailExists) {
      return Response.json(
        {
          error: 'Email already registered.',
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create credentials
    await Credential.create({
      regNo,
      password: hashedPassword,
      securityQuestion:
        securityQuestion ||
        'What is your favorite pet?',
      securityAnswer:
        securityAnswer || 'Not Provided',
    });

    // Create student
    const student = await Student.create({
      name,
      regNo,
      email,
      department,
      session,
      phone:
        phone || '+92 300 1234567',
      university:
        university ||
        'Apex University of Science & Technology',
      avatar:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces',
      subjects: [],
      attendance: [],
      results: [],
    });

    console.log(
      'Student Registered:',
      student.regNo
    );

    return Response.json(
      {
        success: true,
        message:
          'Student registered successfully',
        student,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Signup Error:', err);

    return Response.json(
      {
        success: false,
        error:
          err?.message ||
          'Internal server error',
      },
      {
        status: 500,
      }
    );
  }
}