import { NextResponse } from 'next/server';
import { submitLead } from '@/lib/actions';

export async function GET() {
  console.log("Test webhook route called");
  
  const result = await submitLead({
    meta: {
      source: 'test-api',
      ownerPhone: 'test-phone',
      ownerEmail: 'test-email',
      smsSenderName: 'TestSender',
      notificationType: 'Email',
    },
    lead: {
      type: 'feedback',
      name: 'Test User',
      phone: '123456789',
      email: 'test@example.com',
      message: 'This is a test message from /api/test-webhook',
    }
  });

  return NextResponse.json({
    message: 'Test execution completed',
    result,
    env_check: {
      has_webhook_url: !!process.env.N8N_WEBHOOK_URL,
      webhook_url_segment: process.env.N8N_WEBHOOK_URL ? process.env.N8N_WEBHOOK_URL.substring(0, 20) + '...' : 'missing'
    }
  });
}


