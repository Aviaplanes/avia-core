// src/app/api/videos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const folder = req.nextUrl.searchParams.get('folder') || '/footage';
  const fullPath = path.join(process.cwd(), 'public', folder);

  try {
    const files = fs.readdirSync(fullPath);
    const videos = files
      .filter(file => /\.(mp4|webm|mov)$/i.test(file))
      .map(file => `${folder}/${file}`);

    return NextResponse.json({ videos });
  } catch {
    return NextResponse.json({ videos: [] });
  }
}