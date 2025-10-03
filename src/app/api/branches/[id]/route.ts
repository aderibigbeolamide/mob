import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Branch from '@/models/Branch';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/emr';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const branch = await Branch.findById(params.id)
      .populate('manager', 'firstName lastName email phoneNumber')
      .lean();

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    return NextResponse.json(branch);
  } catch (error: any) {
    console.error('Error fetching branch:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch branch' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Only admins can update branches' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { name, code, address, city, state, country, phone, email, manager, isActive } = body;

    const branch = await Branch.findById(params.id);
    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    if (code && code.toUpperCase() !== branch.code) {
      const existingBranch = await Branch.findOne({ 
        code: code.toUpperCase(),
        _id: { $ne: params.id }
      });
      if (existingBranch) {
        return NextResponse.json(
          { error: 'Branch code already exists' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (manager !== undefined) updateData.manager = manager || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedBranch = await Branch.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('manager', 'firstName lastName email phoneNumber').lean();

    return NextResponse.json(updatedBranch);
  } catch (error: any) {
    console.error('Error updating branch:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update branch' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Only admins can delete branches' },
        { status: 403 }
      );
    }

    await dbConnect();

    const branch = await Branch.findByIdAndDelete(params.id);

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Branch deleted successfully',
      branch 
    });
  } catch (error: any) {
    console.error('Error deleting branch:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete branch' },
      { status: 500 }
    );
  }
}
