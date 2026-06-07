import dbConnect from '../../lib/mongodb';
import Credential from '../../models/Credential';
import bcrypt from 'bcryptjs';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const regNo = searchParams.get('regNo');

    if (!regNo) {
      return Response.json({ error: 'Registration number is required' }, { status: 400 });
    }

    const creds = await Credential.findOne({ regNo: regNo.toUpperCase() });
    if (!creds) {
      return Response.json({ error: 'Credential not found' }, { status: 404 });
    }

    return Response.json({ securityQuestion: creds.securityQuestion }, { status: 200 });
  } catch (err) {
    console.error('Fetch question error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { regNo, currentPassword, newPassword, securityAnswer } = await req.json();

    if (!regNo || !newPassword) {
      return Response.json({ error: 'Registration number and new password are required' }, { status: 400 });
    }

    const cleanRegNo = regNo.toUpperCase();
    const cred = await Credential.findOne({ regNo: cleanRegNo });

    if (!cred) {
      return Response.json({ error: 'Credentials not found' }, { status: 404 });
    }

    let verified = false;

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, cred.password);
      if (isMatch) verified = true;
    } else if (securityAnswer) {
      if (cred.securityAnswer.toLowerCase().trim() === securityAnswer.toLowerCase().trim()) {
        verified = true;
      }
    }

    if (!verified) {
      return Response.json({ error: 'Verification failed. Incorrect current password or security answer.' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    cred.password = await bcrypt.hash(newPassword, salt);
    await cred.save();

    return Response.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('Update credentials error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
