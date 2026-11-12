import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;

    const allFiles: File[] = [];
    if (singleFile) allFiles.push(singleFile);
    if (files && files.length > 0) {
      files.forEach(f => {
        if (!allFiles.includes(f)) allFiles.push(f);
      });
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ error: 'No image file was provided for upload.' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const savedUrls: string[] = [];

    for (const file of allFiles) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename
      const originalName = file.name || 'garment.jpg';
      const ext = path.extname(originalName) || '.jpg';
      const cleanBaseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFilename = `garment_${Date.now()}_${Math.random().toString(36).substring(2, 6)}_${cleanBaseName}${ext}`;

      const filePath = path.join(uploadsDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${uniqueFilename}`;
      savedUrls.push(publicUrl);
    }

    if (savedUrls.length === 0) {
      return NextResponse.json({ error: 'No valid image files could be processed.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: savedUrls[0],
      urls: savedUrls,
      message: `Successfully uploaded ${savedUrls.length} garment image(s).`
    });
  } catch (error: any) {
    console.error('Error handling garment image upload:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while uploading garment image.' },
      { status: 500 }
    );
  }
}

