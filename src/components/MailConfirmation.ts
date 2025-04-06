export function generateMailConfirmationHTML(token: string): string {
  return `
<html>
  <head>
    <style>
      * {
        font-family: Arial, Helvetica, sans-serif;
      }

      a {
        color: #293642;
        background-color: #f6f8fa;
        padding: 10px;
        border: 2px solid #d9dddf;
        border-radius: 1cap;
        text-decoration: none;
        display: inline-block;
        font-weight: bold;
      }

      a:hover {
        background-color: #e6e9ee;
      }

      .title {
        background-color: #f7f8fa;
        width: 100%;
        justify-items: center;
        padding: 5px;
        margin-top: -10px;
      }

      .link {
        background-color: #e6e9ee;
        padding: 10px;
        border-radius: 1cap;
      }
    </style>
  </head>
  <body>
    <div style="justify-items: center">
      <div class="title">
        <h1>¡Bienvenido a Intellecta!</h1>
      </div>
      <p>
        Para verificar tu cuenta puedes presionar el boton de la parte inferior
        o copiar y pegar el siguiente enlace en tu navegador.
      </p>
      <p class="link">http://localhost:3000/api/auth/verify?token=${token}</p>
      <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="http://localhost:3000/api/auth/verify?token=${token}">
        Verificar cuenta
      </a>
    </div>
  </body>
</html>

    `;
}
