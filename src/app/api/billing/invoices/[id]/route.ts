import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Invoice from '@/models/Invoice';
import Payment from '@/models/Payment';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(req, async (req: NextRequest, session: any) => {
    try {
      await dbConnect();

      const { id } = params;

      if (!id) {
        return NextResponse.json(
          { error: 'Invoice ID is required' },
          { status: 400 }
        );
      }

      const invoice = await Invoice.findById(id)
        .populate('patientId', 'patientId firstName lastName phoneNumber email dateOfBirth gender address insurance')
        .populate('branchId', 'name address city state phoneNumber email')
        .populate('generatedBy', 'firstName lastName email phoneNumber role')
        .populate('encounterId')
        .lean();

      if (!invoice) {
        return NextResponse.json(
          { error: 'Invoice not found' },
          { status: 404 }
        );
      }

      const payments = await Payment.find({ invoiceId: id })
        .populate('receivedBy', 'firstName lastName email')
        .sort({ paymentDate: -1 })
        .lean();

      return NextResponse.json({
        invoice: {
          ...invoice,
          payments
        }
      });

    } catch (error: any) {
      console.error('Get invoice error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invoice', message: error.message },
        { status: 500 }
      );
    }
  });
}
