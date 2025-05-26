// app/legal/page.tsx

export default function LegalPage() {
  return (
    <main className="min-h-screen px-6 py-12 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <h1 className="text-4xl font-bold text-center mb-6">
            Términos y Condiciones
          </h1>
          <p className="mb-4">
            Al acceder y utilizar nuestra plataforma de cursos INTELLECTA,
            aceptas estar sujeto a los siguientes términos y condiciones. Si no
            estás de acuerdo con alguna parte, no deberías usar nuestros
            servicios.
          </p>
          <ul className="list-disc list-inside space-y-3">
            <li>
              Los cursos son de uso personal e intransferible. No puedes
              compartir el acceso con terceros.
            </li>
            <li>
              INTELLECTA se reserva el derecho de suspender o eliminar cuentas
              que violen nuestras políticas o condiciones de uso.
            </li>
            <li>
              Los certificados emitidos tienen validez dentro del marco de los
              términos establecidos por INTELLECTA y sus aliados académicos.
            </li>
            <li>
              No garantizamos resultados específicos, ya que el progreso depende
              del compromiso de cada estudiante.
            </li>
            <li>
              Podemos actualizar estos términos en cualquier momento.
              Notificaremos los cambios relevantes a los usuarios registrados.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-4xl font-bold text-center mb-6">
            Política de Privacidad
          </h2>
          <p className="mb-4">
            Tu privacidad es muy importante para nosotros. Esta política explica
            cómo recopilamos, usamos y protegemos tu información personal.
          </p>
          <ul className="list-disc list-inside space-y-3">
            <li>
              Recopilamos datos como nombre y correo electrónico para ofrecerte
              una experiencia personalizada.
            </li>
            <li>
              Nunca compartiremos tu información con terceros sin tu
              consentimiento, salvo cuando sea requerido por ley.
            </li>
            <li>
              Utilizamos cookies para mejorar la navegación y guardar tus
              preferencias. Puedes desactivarlas desde la configuración de tu
              navegador.
            </li>
            <li>
              Puedes solicitar la eliminación de tus datos escribiéndonos a
              soporte.
            </li>
            <li>
              Al usar nuestra plataforma, aceptas los términos descritos en esta
              política.
            </li>
          </ul>
        </section>

        <div className="text-center pt-8">
          <p className="text-sm text-gray-500">
            Última actualización: Mayo 2025 · INTELLECTA
          </p>
        </div>
      </div>
    </main>
  );
}
