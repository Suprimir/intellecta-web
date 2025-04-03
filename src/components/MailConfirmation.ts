export function generateMailConfirmationHTML(token: string): string {
  return `
      <html>
        <body>
          <h1>¡Bienvenido!</h1>
          <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
          <a href="http://localhost:3000/api/auth/verify?token=${token}">
            Verificar cuenta
          </a>
        </body>
      </html>
    `;
}
