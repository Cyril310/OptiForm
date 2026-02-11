const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  // Sécurité : POST uniquement
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { email } = data;

    // LIEN DE PAIEMENT (Mets ici ton lien Stripe ou Zeeg pour l'offre à 100€)
    const titanLink = "https://zeeg.me/cyril41mangeolle/acces-titan-privilege"; 

    // --- TEMPLATE EMAIL "TITAN ELITE" (Design CSS Pur - Pas d'images lourdes) ---
    const htmlEmail = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <title>Accès Titan Déverrouillé</title>
        <style>
            /* Force le mode sombre même si le client mail est en clair */
            body, table, td { background-color: #000000 !important; color: #ffffff !important; }
            .btn-hover:hover { opacity: 0.9 !important; transform: scale(1.02) !important; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Courier New', Courier, monospace;">
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #000000;">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; border: 1px solid #333333; background-color: #080808; box-shadow: 0 0 50px rgba(179, 135, 40, 0.1);">
              
              <tr>
                <td style="background: linear-gradient(90deg, #b38728 0%, #fcf6ba 50%, #aa771c 100%); height: 4px; font-size: 0; line-height: 0;">&nbsp;</td>
              </tr>
              
              <tr>
                <td align="center" style="padding: 40px 20px 20px;">
                    <div style="font-size: 48px; line-height: 1; margin-bottom: 15px; text-shadow: 0 0 20px rgba(179, 135, 40, 0.6);">🔒</div>
                    <h1 style="color: #b38728; margin: 0; font-family: 'Helvetica', sans-serif; font-size: 28px; text-transform: uppercase; letter-spacing: 4px; font-weight: 800;">
                        ACCÈS AUTORISÉ
                    </h1>
                    <p style="color: #666666; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin-top: 10px;">
                        Protocole Titan // Niveau Ambassadeur
                    </p>
                </td>
              </tr>

              <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="80%">
                        <tr><td style="border-bottom: 1px solid #222222;"></td></tr>
                    </table>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 30px 40px; color: #cccccc; font-size: 16px; line-height: 1.6;">
                  <p style="margin: 0 0 20px;">Félicitations.</p>
                  <p style="margin: 0 0 20px;">
                    Votre adresse email a été reconnue dans notre base de données. Vous faites partie des membres ayant validé leur cycle initial.
                  </p>
                  <p style="margin: 0; color: #ffffff;">
                    Le tarif public ne s'applique plus à vous.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 0 30px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111111; border: 1px solid #b38728; border-radius: 8px;">
                        <tr>
                            <td align="center" style="padding: 25px;">
                                <span style="color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Offre Maintien & Progression</span>
                                <br><br>
                                <span style="text-decoration: line-through; color: #555555; font-size: 18px; font-family: 'Helvetica', sans-serif;">200€ / mois</span>
                                <br>
                                <span style="color: #ffffff; font-size: 42px; font-weight: bold; font-family: 'Helvetica', sans-serif; text-shadow: 0 0 10px rgba(255,255,255,0.3);">
                                    100€
                                </span>
                                <span style="color: #b38728; font-size: 14px;"> / mois</span>
                                <br><br>
                                <div style="background-color: rgba(39, 174, 96, 0.1); border: 1px solid #27ae60; color: #27ae60; font-size: 11px; padding: 5px 10px; border-radius: 4px; display: inline-block;">
                                    ✅ CODE APPLIQUÉ AUTOMATIQUEMENT
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 0 0 40px;">
                    <a href="${titanLink}" target="_blank" style="
                        background: #b38728;
                        background: linear-gradient(135deg, #b38728 0%, #aa771c 100%);
                        color: #000000;
                        font-family: 'Helvetica', sans-serif;
                        font-size: 16px;
                        font-weight: 900;
                        text-decoration: none;
                        text-transform: uppercase;
                        padding: 18px 40px;
                        border-radius: 4px;
                        display: inline-block;
                        box-shadow: 0 0 25px rgba(179, 135, 40, 0.4);
                        border: 1px solid #fcf6ba;
                    ">
                        ACTIVER MON OFFRE &rarr;
                    </a>
                </td>
              </tr>

              <tr>
                <td style="background-color: #050505; border-top: 1px solid #222222; padding: 20px; text-align: center; color: #444444; font-size: 10px;">
                    <p style="margin: 0; font-family: monospace;">
                        SECURE LINK ID: ${Date.now().toString(36).toUpperCase()}-XF<br>
                        Ce lien est strictement personnel. Ne pas transférer.<br>
                        &copy; 2025 TITAN PROGRAM.
                    </p>
                </td>
              </tr>

            </table>
            </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // --- ENVOI ---
    await resend.emails.send({
        from: "Titan Access <vip@cyrilmangeolle.com>", // Ton domaine
        to: email,
        subject: `🔒 Accès Titan : Déverrouillé`,
        html: htmlEmail,
    });

    console.log(`✅ Mail Titan envoyé à ${email}`);

    return { statusCode: 200, body: JSON.stringify({ message: "Transmission réussie" }) };

  } catch (error) {
    console.error("Erreur Titan:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

