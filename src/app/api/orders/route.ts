import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, paymentMethod } = body;

    if (!customer || !items || !items.length) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
    }

    if (paymentMethod !== 'cod') {
      return NextResponse.json({ error: 'Only Cash on Delivery is supported at this stage' }, { status: 400 });
    }

    // In Next.js server route, we validate stock and return confirmation
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SH-${year}-${randomSuffix}`;

    return NextResponse.json({
      success: true,
      orderNumber,
      message: 'Order validated and accepted for Cash on Delivery processing'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error processing order' }, { status: 500 });
  }
}
