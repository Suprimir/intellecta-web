export function renderTicketResolvedEmail(
  username: string,
  ticketId: number,
  resolution: string
) {
  return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ticket resuelto - INTELLECTA</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  background: linear-gradient(135deg, #059669, #10b981);
                  padding: 30px 20px;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
              }
              .header img {
                  max-height: 60px;
                  margin-bottom: 10px;
              }
              .header h1 {
                  color: #ffffff;
                  margin: 0;
                  font-size: 24px;
                  font-weight: bold;
              }
              .header .success-icon {
                  font-size: 48px;
                  margin: 10px 0;
              }
              .content {
                  padding: 30px 20px;
                  background-color: #ffffff;
                  border-radius: 0 0 8px 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .status-badge {
                  display: inline-block;
                  background: linear-gradient(135deg, #059669, #10b981);
                  color: #ffffff;
                  padding: 10px 20px;
                  border-radius: 25px;
                  font-size: 16px;
                  font-weight: bold;
                  margin: 15px 0;
                  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
              }
              .ticket-summary {
                  background-color: #f8fafc;
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 20px 0;
              }
              .ticket-summary h3 {
                  color: #1e293b;
                  margin-top: 0;
                  margin-bottom: 15px;
                  font-size: 18px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
              }
              .info-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 12px;
                  padding: 10px 0;
                  border-bottom: 1px solid #e2e8f0;
              }
              .info-row:last-child {
                  border-bottom: none;
                  margin-bottom: 0;
              }
              .info-label {
                  font-weight: bold;
                  color: #475569;
                  flex-shrink: 0;
                  margin-right: 15px;
              }
              .info-value {
                  color: #1e293b;
                  text-align: right;
                  word-break: break-word;
              }
              .category-badge {
                  display: inline-block;
                  padding: 4px 12px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: bold;
                  text-transform: uppercase;
              }
              .category-technical {
                  background-color: #dbeafe;
                  color: #1e40af;
              }
              .category-functional {
                  background-color: #dcfce7;
                  color: #166534;
              }
              .category-bug {
                  background-color: #fee2e2;
                  color: #dc2626;
              }
              .category-other {
                  background-color: #f3e8ff;
                  color: #7c3aed;
              }
              .resolution-section {
                  background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
                  border: 2px solid #10b981;
                  border-radius: 8px;
                  padding: 25px;
                  margin: 25px 0;
                  position: relative;
              }
              .resolution-section::before {
                  content: "✅";
                  position: absolute;
                  top: -15px;
                  left: 20px;
                  background: #10b981;
                  color: white;
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 16px;
              }
              .resolution-section h3 {
                  color: #065f46;
                  margin-top: 0;
                  margin-bottom: 15px;
                  font-size: 20px;
                  display: flex;
                  align-items: center;
                  gap: 10px;
              }
              .resolution-text {
                  background-color: #ffffff;
                  border: 1px solid #a7f3d0;
                  border-radius: 6px;
                  padding: 20px;
                  color: #064e3b;
                  font-size: 15px;
                  line-height: 1.6;
                  white-space: pre-wrap;
                  word-wrap: break-word;
              }
              .feedback-section {
                  background-color: #fef3c7;
                  border: 1px solid #f59e0b;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 25px 0;
                  text-align: center;
              }
              .feedback-section h3 {
                  color: #92400e;
                  margin-top: 0;
                  margin-bottom: 15px;
              }
              .feedback-buttons {
                  display: flex;
                  justify-content: center;
                  gap: 15px;
                  margin-top: 15px;
              }
              .feedback-button {
                  display: inline-block;
                  padding: 10px 20px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-weight: bold;
                  font-size: 14px;
                  transition: all 0.3s ease;
              }
              .feedback-positive {
                  background-color: #10b981;
                  color: #ffffff !important;
              }
              .feedback-positive:hover {
                  background-color: #059669;
              }
              .feedback-negative {
                  background-color: #ef4444;
                  color: #ffffff !important;
              }
              .feedback-negative:hover {
                  background-color: #dc2626;
              }
              .support-info {
                  background-color: #f0f9ff;
                  border-left: 4px solid #0ea5e9;
                  padding: 20px;
                  margin: 20px 0;
                  border-radius: 0 6px 6px 0;
              }
              .support-info h3 {
                  color: #0c4a6e;
                  margin-top: 0;
                  margin-bottom: 15px;
              }
              .support-info p {
                  margin: 8px 0;
                  color: #0c4a6e;
              }
              .footer {
                  font-size: 12px;
                  color: #777777;
                  text-align: center;
                  padding: 20px;
                  background-color: #f7f7f7;
                  border-radius: 6px;
                  margin-top: 20px;
              }
              .footer p {
                  margin: 5px 0;
              }
              .celebration {
                  text-align: center;
                  margin: 20px 0;
                  font-size: 18px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://i.imgur.com/NQC96NS.png" alt="Logo INTELLECTA">
                  <div class="success-icon">🎉</div>
                  <h1>¡Ticket Resuelto!</h1>
              </div>
              
              <div class="content">
                  <h2>¡Hola ${username}!</h2>
                  
                  <div class="celebration">
                      <p>¡Tenemos buenas noticias! Tu ticket de soporte ha sido resuelto exitosamente.</p>
                  </div>
                  
                  <div style="text-align: center;">
                      <span class="status-badge">✅ RESUELTO</span>
                  </div>
                  
                  <div class="ticket-summary">
                      <h3>📋 Resumen del Ticket</h3>
                      <div class="info-row">
                          <span class="info-label">ID del Ticket:</span>
                          <span class="info-value">#${ticketId}</span>
                      </div>
                  </div>
                  
                  <div class="resolution-section">
                      <h3>🔧 Solución Implementada</h3>
                      <div class="resolution-text">${resolution}</div>
                  </div>
                  
                  <div class="support-info">
                      <h3>🛠️ ¿Necesitas ayuda adicional?</h3>
                      <p><strong>Si tienes más preguntas:</strong> Puedes responder a este correo o crear un nuevo ticket</p>
                      <p><strong>Documentación:</strong> Visita nuestro centro de ayuda para guías detalladas</p>
                      <p><strong>Soporte urgente:</strong> Contacta a soporte@intellecta.com</p>
                  </div>
                  
                  <p>Agradecemos tu paciencia durante el proceso de resolución. Nuestro equipo se esfuerza continuamente para brindarte el mejor servicio posible.</p>
                  
                  <p>¡Esperamos que puedas continuar usando INTELLECTA sin inconvenientes!</p>
                  
                  <p>Saludos cordiales,<br>
                  <strong>El equipo de soporte de INTELLECTA</strong></p>
              </div>
              
              <div class="footer">
                  <p>© 2025 INTELLECTA. Todos los derechos reservados.</p>
                  <p>Ticket #${ticketId} - Estado: Resuelto</p>
                  <p>Para soporte adicional, visita nuestro centro de ayuda o contacta a soporte@intellecta.com</p>
              </div>
          </div>
      </body>
      </html>   
        `;
}
