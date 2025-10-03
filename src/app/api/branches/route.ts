import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Branch from '@/models/Branch';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/emr';
import { extractPaginationParams, buildPaginationResponse } from '@/lib/utils/queryHelpers';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const { page, limit } = extractPaginationParams(searchParams);
    const skip = (page - 1) * limit;

    const filter: any = {};
    
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { code: { $regex: searchQuery, $options: 'i' } },
        { city: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    const isActive = searchParams.get('isActive');
    if (isActive !== null) {
      filter.isActive = isActive === 'true';
    }

    const [branches, totalCount] = await Promise.all([
      Branch.find(filter)
        .populate('manager', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Branch.countDocuments(filter)
    ]);

    const pagination = buildPaginationResponse(page, totalCount, limit);

    return NextResponse.json({
      branches,
      pagination
    });
  } catch (error: any) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Only admins can create branches' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { name, code, address, city, state, country, phone, email, manager, isActive } = body;

    if (!name || !code || !address || !city || !state || !country || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingBranch = await Branch.findOne({ code: code.toUpperCase() });
    if (existingBranch) {
      return NextResponse.json(
        { error: 'Branch code already exists' },
        { status: 400 }
      );
    }

    const branch = await Branch.create({
      name,
      code: code.toUpperCase(),
      address,
      city,
      state,
      country: country || 'Nigeria',
      phone,
      email,
      manager: manager || undefined,
      isActive: isActive !== undefined ? isActive : true
    });

    const populatedBranch = await Branch.findById(branch._id)
      .populate('manager', 'firstName lastName email')
      .lean();

    return NextResponse.json(populatedBranch, { status: 201 });
  } catch (error: any) {
    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create branch' },
      { status: 500 }
    );
  }
}
