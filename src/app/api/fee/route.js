import dbConnect from '../../lib/mongodb';
import Fee from '../../models/Fee';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const regNo = searchParams.get('regNo');

    if (!regNo) {
      return Response.json({ error: 'Registration number is required' }, { status: 400 });
    }

    const fees = await Fee.find({ regNo: regNo.toUpperCase() });
    return Response.json({ fees }, { status: 200 });
  } catch (err) {
    console.error('Fetch fees error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { challanNo, status } = await req.json();

    if (!challanNo || !status) {
      return Response.json({ error: 'Challan number and status are required' }, { status: 400 });
    }

    const fee = await Fee.findOneAndUpdate(
      { challanNo },
      { status },
      { new: true }
    );

    if (!fee) {
      return Response.json({ error: 'Fee challan not found' }, { status: 404 });
    }

    return Response.json({ message: 'Fee status updated successfully', fee }, { status: 200 });
  } catch (err) {
    console.error('Update fee error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
