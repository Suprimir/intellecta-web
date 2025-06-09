import { CertificateData } from "@/types/api";

export function renderCertificateHTML(data: CertificateData): string {
  return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificado - ${data.studentName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            width: 297mm;
            height: 210mm;
            background: white;
            position: relative;
            overflow: hidden;
          }
          
          .certificate-container {
            width: 100%;
            height: 100%;
            position: relative;
            padding: 60px;
            display: flex;
            flex-direction: column;
          }
          
          /* Decoraciones de fondo */
          .decoration-top-right {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-left: 200px solid transparent;
            border-bottom: 200px solid #14b8a6;
            z-index: 1;
          }
          
          .decoration-top-right-inner {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-left: 150px solid transparent;
            border-bottom: 150px solid #5eead4;
            z-index: 2;
          }
          
          .decoration-bottom-left {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 0;
            border-right: 200px solid transparent;
            border-top: 200px solid #fb923c;
            z-index: 1;
          }
          
          .decoration-bottom-left-inner {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 0;
            border-right: 150px solid transparent;
            border-top: 150px solid #fbbf24;
            z-index: 2;
          }
          
          .content {
            position: relative;
            z-index: 10;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          
          /* Header */
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          
          .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }
          
          .logo-icon {
            width: 32px;
            height: 48px;
            background: #eab308;
            border-radius: 4px;
            margin-right: 12px;
          }
          
          .logo-text {
            font-size: 36px;
            font-weight: bold;
            color: #1f2937;
            letter-spacing: 1px;
          }
          
          .subtitle {
            font-size: 24px;
            color: #6b7280;
            font-style: italic;
            margin-top: 10px;
          }
          
          /* Student Name */
          .student-name {
            text-align: center;
            margin: 40px 0;
          }
          
          .student-name h2 {
            font-size: 48px;
            font-weight: bold;
            color: #1f2937;
            border-bottom: 3px solid #d1d5db;
            padding-bottom: 10px;
            display: inline-block;
            min-width: 400px;
          }
          
          /* Course Details */
          .course-details {
            text-align: center;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 0;
          }
          
          .course-text {
            font-size: 28px;
            line-height: 1.6;
            color: #374151;
            max-width: 800px;
          }
          
          .course-text .highlight {
            font-weight: bold;
            color: #1f2937;
          }
          
          /* Certificate Info */
          .certificate-info {
            display: flex;
            justify-content: center;
            margin: 40px 0;
          }
          
          .info-box {
            border: 3px solid #6b7280;
            background: #f9fafb;
            padding: 20px 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            min-width: 400px;
          }
          
          .info-item {
            font-size: 16px;
          }
          
          .info-label {
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
          }
          
          .info-value {
            color: #374151;
          }
          
          /* Seal */
          .seal-container {
            margin: 0 40px;
            display: flex;
            justify-content: center;
          }
          
          .seal {
            width: 80px;
            height: 80px;
            background: #14b8a6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border: 4px solid #0f766e;
          }
          
          .seal-inner {
            width: 64px;
            height: 64px;
            background: #5eead4;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .seal-center {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            border-radius: 50%;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <!-- Decoraciones -->
          <div class="decoration-top-right"></div>
          <div class="decoration-top-right-inner"></div>
          <div class="decoration-bottom-left"></div>
          <div class="decoration-bottom-left-inner"></div>
          
          <div class="content">
            <!-- Header -->
            <div class="header">
              <div class="logo">
                <div class="logo-icon"></div>
                <div class="logo-text">INTELLECTA</div>
              </div>
              <div class="subtitle">Este documento certifica que</div>
            </div>
            
            <!-- Student Name -->
            <div class="student-name">
              <h2>${data.studentName}</h2>
            </div>
            
            <!-- Course Details -->
            <div class="course-details">
              <div class="course-text">
                Culminó el curso <span class="highlight">${
                  data.courseName
                }</span> del área de 
                <span class="highlight">${
                  data.categoryName
                }</span> exitosamente<br>
                con un total de <span class="highlight">${(
                  data.duration /
                  60 /
                  60
                ).toFixed(2)}</span> horas de estudio
              </div>
            </div>
            
            <!-- Certificate Info -->
            <div class="certificate-info">
              <div class="info-box">
                <div class="info-item">
                  <div class="info-label">ID:</div>
                  <div class="info-value">${data.id}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">FECHA DE EMISIÓN:</div>
                  <div class="info-value">${new Date().toLocaleTimeString(
                    "es-MX",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}</div>
                </div>
              </div>
            </div>
              <div class="seal-container">
                <div class="seal">
                  <div class="seal-inner">
                    <div class="seal-center"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
}
