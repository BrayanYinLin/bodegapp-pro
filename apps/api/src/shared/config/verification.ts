export const verifyEmailHtml = (code: string, expires: string) => `
  <!-- email-template.html -->
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Verifica tu correo</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f7fb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 18px rgba(20,30,60,0.08);">
            <!-- Header -->
            <tr>
              <td style="padding:24px 28px;border-bottom:1px solid #eef2f7;">
                <h1 style="margin:0;font-size:18px;color:#111827;">Verifica tu correo</h1>
                <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">Gracias por registrarte. Usa el código para completar tu verificación.</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 18px;color:#374151;font-size:15px;line-height:1.5;">
                  Tu código de verificación es:
                </p>

                <!-- Código destacado -->
                <div style="text-align:center;margin:12px 0 22px;">
                  <span style="display:inline-block;padding:18px 26px;font-size:28px;letter-spacing:3px;background:#f3f6fb;border-radius:8px;border:1px dashed #e1e7f5;color:#0f172a;font-family: ui-monospace,SFMono-Regular,Menlo,monospace;">
                    ${code}
                  </span>
                </div>

                <hr style="margin:20px 0;border:none;border-top:1px solid #eef2f7;" />

                <p style="margin:0;color:#9ca3af;font-size:12px;">
                  Este código expira en ${expires}. Si no solicitaste esto, ignora el correo.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 28px;background:#fafafa;border-top:1px solid #eef2f7;text-align:center;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">&copy; ${new Date().getFullYear()} Bodegapp. Todos los derechos reservados.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
