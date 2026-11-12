import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const config = await req.json();
    const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } = config;

    if (!apiKey || !projectId) {
      return NextResponse.json({ error: 'API Key and Project ID are required' }, { status: 400 });
    }

    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    } else {
      const examplePath = path.join(process.cwd(), '.env.example');
      if (fs.existsSync(examplePath)) {
        envContent = fs.readFileSync(examplePath, 'utf8');
      }
    }

    // Replace or append Firebase environment keys
    const updateEnvVar = (key: string, value: string) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    };

    updateEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY', apiKey);
    updateEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', authDomain || `${projectId}.firebaseapp.com`);
    updateEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID', projectId);
    updateEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', storageBucket || `${projectId}.appspot.com`);
    updateEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', messagingSenderId || '123456789012');
    updateEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID', appId || '1:123456789012:web:abcdef123456');

    fs.writeFileSync(envPath, envContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Firebase configuration saved successfully to .env.local and runtime!'
    });
  } catch (error: any) {
    console.error('Error saving Firebase config to .env.local:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

