import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, to, subject, html } = await req.json();

    if (!to || !html) {
      return NextResponse.json({ error: 'Missing required parameters (to, html)' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      // Graceful simulated mode when live key not provided in development
      return NextResponse.json({
        success: true,
        mode: 'simulated',
        message: 'Email logged in simulated environment. Configure RESEND_API_KEY to send real emails.'
      });
    }

    // Call Resend API endpoint
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: process.env.SENDER_EMAIL || 'SH Clothing Store <onboarding@resend.dev>',
        to: [to],
        subject: subject || `Order Confirmed: ${orderNumber} - SH Clothing Store`,
        html: html
      })
    });

    const data = await res.json();
    return NextResponse.json({ success: true, mode: 'resend_live', data });
  } catch (error: any) {
    console.error('Error in send-email API route:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
