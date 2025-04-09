export function renderConfirmationEmail(
  username: string,
  email: string,
  token: string
) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Registro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4285f4;
            padding: 20px;
            text-align: center;
        }
        .header img {
            max-height: 60px;
        }
        .content {
            padding: 20px;
            background-color: #ffffff;
        }
        .button {
            display: inline-block;
            background-color: #4285f4;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 4px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            font-size: 12px;
            color: #777777;
            text-align: center;
            padding: 20px;
            background-color: #f7f7f7;
        }
        .social {
            margin: 20px 0;
        }
        .social a {
            display: inline-block;
            margin: 0 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="/api/placeholder/120/60" alt="Logo de la empresa">
        </div>
        
        <div class="content">
            <h1>¡Gracias por registrarte!</h1>
            
            <p>Hola ${username},</p>
            
            <p>Gracias por crear una cuenta en Intellecta. Estamos encantados de tenerte como parte de nuestra comunidad.</p>
            
            <p>Para completar el proceso de registro y activar tu cuenta, haz clic en el botón de abajo:</p>
            
            <div style="text-align: center;">
                <a href="http://localhost:3000/api/auth/verify?token=${token}" class="button">Confirmar mi cuenta</a>
            </div>
            
            <p>O copia y pega el siguiente enlace en tu navegador:</p>
            <p style="word-break: break-all; font-size: 12px;">http://localhost:3000/api/auth/verify?token=${token}</p>
            
            <p>Este enlace expirará en 24 horas por motivos de seguridad.</p>
            
            <p>Si no has solicitado esta cuenta, puedes ignorar este correo electrónico.</p>
            
            <p>Saludos cordiales,<br>
            El equipo de Intellecta</p>
        </div>
        
        <div class="footer">
            <p>© 2025 Intellecta. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>   
    `;
}
