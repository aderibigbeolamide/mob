import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import { requireAuth } from '@/lib/middleware/auth';
import mongoose from 'mongoose';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const { id } = await params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: 'Invalid notification ID' },
          { status: 400 }
        );
      }

      const notification = await Notification.findById(id);

      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }

      if (notification.recipient.toString() !== session.user.id) {
        return NextResponse.json(
          { error: 'Forbidden. You can only mark your own notifications as read.' },
          { status: 403 }
        );
      }

      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();

      const populatedNotification = await Notification.findById(notification._id)
        .populate('sender', 'firstName lastName email role')
        .populate('recipient', 'firstName lastName email role');

      return NextResponse.json({
        message: 'Notification marked as read',
        notification: populatedNotification
      });

    } catch (error: any) {
      console.error('Mark notification as read error:', error);
      return NextResponse.json(
        { error: 'Failed to mark notification as read', message: error.message },
        { status: 500 }
      );
    }
  });
}
