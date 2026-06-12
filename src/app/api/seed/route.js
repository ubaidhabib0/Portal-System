import dbConnect from '../../lib/mongodb';
import Student from '../../models/Student';
import Subject from '../../models/Subject';
import Fee from '../../models/Fee';
import Credential from '../../models/Credential';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // 1. Clear existing database collections
    await Student.deleteMany({});
    await Subject.deleteMany({});
    await Fee.deleteMany({});
    await Credential.deleteMany({});

    // 2. Hash default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 3. Create global Subjects catalog
    const subjects = await Subject.insertMany([
      {
        code: 'CS-301',
        name: 'Web Engineering',
        credits: 3,
        instructors: ['Dr. Tariq Mahmood', 'Prof. Shakeel Ahmad', 'Ms. Ayesha Khan'],
        sections: ['CS-6A', 'CS-6B', 'CS-6C']
      },
      {
        code: 'CS-302',
        name: 'Database Systems',
        credits: 4,
        instructors: ['Dr. Sajjad Hussain', 'Mr. Fahad Nazir', 'Mrs. Zainab Bibi'],
        sections: ['CS-6A', 'CS-6B', 'CS-6D']
      },
      {
        code: 'CS-303',
        name: 'Computer Networks',
        credits: 3,
        instructors: ['Dr. Haris Munir', 'Engr. Asif Ali', 'Ms. Sana Fatima'],
        sections: ['CS-6A', 'CS-6B', 'CS-6C']
      },
      {
        code: 'CS-304',
        name: 'Software Engineering',
        credits: 3,
        instructors: ['Prof. Noman Qureshi', 'Ms. Sadia Malik', 'Dr. Khalid Mahmood'],
        sections: ['CS-6B', 'CS-6C', 'CS-6A']
      },
      {
        code: 'CS-305',
        name: 'Artificial Intelligence',
        credits: 4,
        instructors: ['Dr. Waqas Anwar', 'Dr. Sumera Asif', 'Mr. Bilal Khan'],
        sections: ['CS-6A', 'CS-6B', 'CS-6C', 'CS-6D']
      },
      {
        code: 'CS-306',
        name: 'Mobile App Development',
        credits: 3,
        instructors: ['Mr. Ali Raza', 'Ms. Hira Fatima', 'Engr. Usman Ghani'],
        sections: ['CS-6A', 'CS-6B', 'CS-6C']
      }
    ]);

    // 4. Create default Credentials
    await Credential.create({
      regNo: 'CS-2021-001',
      password: hashedPassword,
      securityQuestion: 'What is your favorite pet?',
      securityAnswer: 'Cat'
    });

    // 5. Create default Student with enrolled courses, attendance, and results
    const student = await Student.create({
      name: 'Zubair Ahmad',
      regNo: 'CS-2021-001',
      email: 'zubair@uni.edu',
      phone: '+92 300 1234567',
      university: 'Apex University of Science & Technology',
      department: 'Computer Science',
      session: '2021-2025',
      gpa: 3.57,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces',
      subjects: [
        {
          code: 'CS-301',
          name: 'Web Engineering',
          credits: 3,
          instructor: 'Dr. Tariq Mahmood',
          section: 'CS-6A'
        },
        {
          code: 'CS-302',
          name: 'Database Systems',
          credits: 4,
          instructor: 'Dr. Sajjad Hussain',
          section: 'CS-6A'
        },
        {
          code: 'CS-303',
          name: 'Computer Networks',
          credits: 3,
          instructor: 'Dr. Haris Munir',
          section: 'CS-6A'
        }
      ],
      attendance: [
        {
          subjectCode: 'CS-301',
          subjectName: 'Web Engineering',
          totalLectures: 30,
          attendedLectures: 24
        },
        {
          subjectCode: 'CS-302',
          subjectName: 'Database Systems',
          totalLectures: 32,
          attendedLectures: 28
        },
        {
          subjectCode: 'CS-303',
          subjectName: 'Computer Networks',
          totalLectures: 28,
          attendedLectures: 18
        }
      ],
      results: [
        {
          subjectCode: 'CS-301',
          subjectName: 'Web Engineering',
          marksObtained: 82,
          totalMarks: 100,
          grade: 'A-',
          gpa: 3.7
        },
        {
          subjectCode: 'CS-302',
          subjectName: 'Database Systems',
          marksObtained: 91,
          totalMarks: 100,
          grade: 'A',
          gpa: 4.0
        },
        {
          subjectCode: 'CS-303',
          subjectName: 'Computer Networks',
          marksObtained: 72,
          totalMarks: 100,
          grade: 'B',
          gpa: 3.0
        }
      ]
    });

    // 6. Create default Fee challans
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 15);

    await Fee.insertMany([
      {
        regNo: 'CS-2021-001',
        challanNo: 'CH-1002',
        amount: 45000,
        dueDate: new Date('2025-12-15'),
        status: 'Paid',
        semester: '5th Semester'
      },
      {
        regNo: 'CS-2021-001',
        challanNo: 'CH-1003',
        amount: 48000,
        dueDate: futureDate,
        status: 'Unpaid',
        semester: '6th Semester'
      }
    ]);

    return Response.json({
      message: 'Database seeded successfully!',
      student,
      globalSubjectsCount: subjects.length
    }, { status: 200 });

  } catch (err) {
    console.error('Seeder error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
