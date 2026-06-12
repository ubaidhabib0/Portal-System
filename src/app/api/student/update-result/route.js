export const dynamic = 'force-dynamic';
import dbConnect from '../../../lib/mongodb';
import Student from '../../../models/Student';

export async function POST(req) {
  try {
    await dbConnect();
    const { 
      regNo, 
      subjectCode, 
      subjectName, 
      marksObtained, 
      totalMarks, 
      grade, 
      gpa 
    } = await req.json();

    if (!regNo || !subjectCode || !subjectName || marksObtained === undefined || totalMarks === undefined) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanRegNo = regNo.toUpperCase();
    const student = await Student.findOne({ regNo: cleanRegNo });

    if (!student) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    const calcGrade = (pct) => {
      if (pct >= 85) return 'A';
      if (pct >= 80) return 'A-';
      if (pct >= 75) return 'B+';
      if (pct >= 70) return 'B';
      if (pct >= 65) return 'B-';
      if (pct >= 60) return 'C+';
      if (pct >= 55) return 'C';
      if (pct >= 50) return 'D';
      return 'F';
    };

    const calcGpa = (pct) => {
      if (pct >= 85) return 4.0;
      if (pct >= 80) return 3.7;
      if (pct >= 75) return 3.3;
      if (pct >= 70) return 3.0;
      if (pct >= 65) return 2.7;
      if (pct >= 60) return 2.3;
      if (pct >= 55) return 2.0;
      if (pct >= 50) return 1.0;
      return 0.0;
    };

    const percentage = (marksObtained / totalMarks) * 100;
    const finalGrade = grade || calcGrade(percentage);
    const finalGpa = gpa !== undefined ? gpa : calcGpa(percentage);

    const resIndex = student.results.findIndex(res => res.subjectCode === subjectCode);

    if (resIndex > -1) {
      student.results[resIndex].marksObtained = marksObtained;
      student.results[resIndex].totalMarks = totalMarks;
      student.results[resIndex].grade = finalGrade;
      student.results[resIndex].gpa = finalGpa;
    } else {
      student.results.push({
        subjectCode,
        subjectName,
        marksObtained,
        totalMarks,
        grade: finalGrade,
        gpa: finalGpa
      });
    }

    // Update cumulative GPA
    if (student.results.length > 0) {
      const sumGpa = student.results.reduce((sum, item) => sum + item.gpa, 0);
      student.gpa = parseFloat((sumGpa / student.results.length).toFixed(2));
    }

    await student.save();

    return Response.json({ message: 'Result updated successfully', student }, { status: 200 });
  } catch (err) {
    console.error('Update result error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
