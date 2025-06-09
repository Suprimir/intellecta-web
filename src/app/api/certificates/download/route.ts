import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pdfPath = searchParams.get('path');

    if (!pdfPath) {
      return NextResponse.json(
        { message: 'Ruta del PDF no proporcionada' },
        { status: 400 }
      );
    }

    const decodedPath = decodeURIComponent(pdfPath);
    
    if (!existsSync(decodedPath)) {
      return NextResponse.json(
        { message: 'Archivo PDF no encontrado' },
        { status: 404 }
      );
    }

    const pdfBuffer = await readFile(decodedPath);
    
    const fileName = path.basename(decodedPath);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error al descargar el certificado:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al descargar el certificado' },
      { status: 500 }
    );
  }
}