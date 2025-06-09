export function renderTicketInProcessEmail(username: string, ticketId: number) {
  return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket en proceso - INTELLECTA</title>
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
                    background: linear-gradient(135deg, #0d9488, #14b8a6);
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
                .content {
                    padding: 30px 20px;
                    background-color: #ffffff;
                    border-radius: 0 0 8px 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .status-badge {
                    display: inline-block;
                    background-color: #f59e0b;
                    color: #ffffff;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                .ticket-info {
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    padding: 20px;
                    margin: 20px 0;
                }
                .ticket-info h3 {
                    color: #1e293b;
                    margin-top: 0;
                    margin-bottom: 15px;
                    font-size: 18px;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    padding: 8px 0;
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
                .next-steps {
                    background-color: #f0f9ff;
                    border-left: 4px solid #0ea5e9;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 0 6px 6px 0;
                }
                .next-steps h3 {
                    color: #0c4a6e;
                    margin-top: 0;
                    margin-bottom: 15px;
                }
                .next-steps ul {
                    margin: 0;
                    padding-left: 20px;
                }
                .next-steps li {
                    margin-bottom: 8px;
                    color: #0c4a6e;
                }
                .contact-info {
                    background-color: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: center;
                }
                .contact-info p {
                    margin: 0;
                    color: #92400e;
                    font-size: 14px;
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
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://i.imgur.com/NQC96NS.png" alt="Logo INTELLECTA">
                    <h1>Ticket en Proceso</h1>
                </div>
                
                <div class="content">
                    <h2>Hola ${username},</h2>
                    
                    <p>Te escribimos para informarte que tu ticket de soporte ha sido revisado por nuestro equipo y ahora está:</p>
                    
                    <div style="text-align: center;">
                        <span class="status-badge">🔄 EN PROCESO</span>
                    </div>
                    
                    <div class="ticket-info">
                        <h3>📋 Información del Ticket</h3>
                        <div class="info-row">
                            <span class="info-label">ID del Ticket:</span>
                            <span class="info-value">#${ticketId}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Estado:</span>
                            <span class="info-value">En proceso de resolución</span>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h3>🔍 ¿Qué sigue ahora?</h3>
                        <ul>
                            <li>Nuestro equipo técnico está trabajando activamente en tu solicitud</li>
                            <li>Analizaremos el problema y desarrollaremos una solución apropiada</li>
                            <li>Te mantendremos informado sobre cualquier actualización importante</li>
                            <li>Recibirás una notificación cuando el ticket sea resuelto</li>
                        </ul>
                    </div>
                    
                    <p><strong>Tiempo estimado de resolución:</strong> Dependiendo de la complejidad del problema, la resolución puede tomar entre 24-72 horas hábiles.</p>
                    
                    <div class="contact-info">
                        <p><strong>💬 ¿Necesitas agregar información adicional?</strong><br>
                        Responde a este correo con cualquier detalle que pueda ayudarnos a resolver tu solicitud más rápidamente.</p>
                    </div>
                    
                    <p>Agradecemos tu paciencia mientras trabajamos en resolver tu consulta. Nuestro objetivo es brindarte la mejor experiencia posible.</p>
                    
                    <p>Saludos cordiales,<br>
                    <strong>El equipo de soporte de INTELLECTA</strong></p>
                </div>
                
                <div class="footer">
                    <p>© 2025 INTELLECTA. Todos los derechos reservados.</p>
                    <p>Este es un mensaje automático, por favor no respondas a esta dirección.</p>
                    <p>Para soporte adicional, visita nuestro centro de ayuda o contacta a soporte@intellecta.com</p>
                </div>
            </div>
        </body>
        </html>   
          `;
}
