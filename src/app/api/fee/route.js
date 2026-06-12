import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Fee from '../../models/Fee';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const regNo = searchParams.get('regNo');

    if (!regNo) {
      return NextResponse.json(
        { error: 'Registration number is required' },
        { status: 400 }
      );
    }

    const fees = await Fee.find({ regNo: regNo.toUpperCase() });

    return NextResponse.json({ fees }, { status: 200 });

  } catch (err) {
    console.error('Fetch fees error:', err);

    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await dbConnect();
    const { challanNo, status, transcript, transcriptName } = await req.json();

    if (!challanNo) {
      return NextResponse.json(
        { error: 'Challan number is required' },
        { status: 400 }
      );
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (transcript !== undefined) updateFields.transcript = transcript;
    if (transcriptName !== undefined) updateFields.transcriptName = transcriptName;

    const fee = await Fee.findOneAndUpdate(
      { challanNo },
      updateFields,
      { new: true }
    );

    if (!fee) {
      return NextResponse.json({ error: 'Fee challan not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fee updated successfully', fee }, { status: 200 });
  } catch (err) {
    console.error('Update fee error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
