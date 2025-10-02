import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const isRead = searchParams.get('isRead');
      const type = searchParams.get('type');

      const query: any = {
        recipient: session.user.id
      };

      if (isRead !== null && isRead !== undefined && isRead !== '') {
        query.isRead = isRead === 'true';
      }

      if (type) {
        query.type = type;
      }

      const skip = (page - 1) * limit;

      const [notifications, totalCount] = await Promise.all([
        Notification.find(query)
          .populate('sender', 'firstName lastName email role')
          .populate('recipient', 'firstName lastName email role')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Notification.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        notifications,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });

    } catch (error: any) {
      console.error('Get notifications error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notifications', message: error.message },
        { status: 500 }
      );
    }
  });
}
