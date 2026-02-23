const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const headers = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non autorisée" }) };
  }

  try {
    const data = JSON.parse(event.body);
    const { email } = data;

    // LIEN DE PAIEMENT ZEEG OU STRIPE
    const titanLink = "https://zeeg.me/cyril41mangeolle/acces-titan-privilege"; 

    // --- TEMPLATE EMAIL "TITAN V2" (LUXE & HACKER) ---
    const htmlEmail = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accès Titan Déverrouillé</title>
        <style>
            /* Reset et Mode Sombre Forcé */
            body, table, td, div, p, a { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
            body { margin: 0; padding: 0; background-color: #050505 !important; color: #ffffff; }
            
            /* Animations (Fonctionnent sur Apple Mail et certains clients) */
            @keyframes pulseGlow {
                0% { box-shadow: 0 0 10px rgba(179, 135, 40, 0.4); }
                50% { box-shadow: 0 0 25px rgba(252, 246, 186, 0.8); }
                100% { box-shadow: 0 0 10px rgba(179, 135, 40, 0.4); }
            }
            .glow-button {
                transition: all 0.3s ease;
            }
            .glow-button:hover {
                transform: scale(1.05);
                background: linear-gradient(135deg, #fcf6ba 0%, #b38728 100%) !important;
                color: #000000 !important;
            }
        </style>
    </head>
    <body style="background-color: #050505; margin: 0; padding: 20px 0;">

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050505;">
            <tr>
                <td align="center">
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0a0a0a; border: 1px solid #222; border-radius: 16px; overflow: hidden; box-shadow: 0 0 40px rgba(179, 135, 40, 0.15);">
                        
                        <tr>
                            <td style="background: linear-gradient(90deg, #b38728 0%, #fcf6ba 50%, #aa771c 100%); height: 4px; font-size: 0; line-height: 0;">&nbsp;</td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 40px 20px 20px;">
                                <div style="font-size: 50px; margin-bottom: 15px; text-shadow: 0 0 20px rgba(252, 246, 186, 0.6);">💎</div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 3px; font-weight: 800;">
                                    STATUT <span style="color: #b38728;">AMBASSADEUR</span>
                                </h1>
                                <p style="color: #666666; font-size: 11px; text-transform: uppercase; letter-spacing: 4px; margin-top: 10px; font-family: 'Courier New', monospace;">
                                    Protocole TITAN // Accès Autorisé
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 0 40px;">
                                <div style="border-bottom: 1px solid rgba(179, 135, 40, 0.3); width: 100%;"></div>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 30px 40px 10px; color: #cccccc; font-size: 15px; line-height: 1.6; text-align: left;">
                                <p style="margin: 0 0 15px; color: #ffffff; font-weight: bold; font-size: 18px;">Félicitations.</p>
                                <p style="margin: 0 0 15px;">
                                    Votre code d'accréditation a été validé par nos systèmes. Vous venez de débloquer l'accès à notre programme le plus élitiste : <strong style="color: #fcf6ba;">Le Pack Transformation</strong>.
                                </p>
                                <p style="margin: 0;">
                                    En tant qu'Ambassadeur, le tarif public ne s'applique plus. Vous bénéficiez d'une prise en charge de 50% sur votre parcours.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 30px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(145deg, #111111, #080808); border: 1px solid #b38728; border-radius: 12px;">
                                    <tr>
                                        <td align="center" style="padding: 25px;">
                                            <div style="background-color: rgba(179, 135, 40, 0.1); border: 1px solid #b38728; color: #fcf6ba; font-size: 10px; font-weight: bold; padding: 4px 12px; border-radius: 20px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">
                                                Subvention Titan Activée
                                            </div>
                                            <br>
                                            <span style="text-decoration: line-through; color: #555555; font-size: 20px; font-weight: bold;">450€</span>
                                            <br>
                                            <span style="color: #ffffff; font-size: 55px; font-weight: 900; line-height: 1; text-shadow: 0 0 20px rgba(179, 135, 40, 0.4);">
                                                225€
                                            </span>
                                            <br>
                                            <span style="color: #888888; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Règlement unique</span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 40px 30px;">
                                <h3 style="color: #b38728; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 20px;">L'Arsenal Inclus :</h3>
                                
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="color: #dddddd; font-size: 14px; line-height: 1.5;">
                                    <tr>
                                        <td valign="top" style="padding-bottom: 12px; width: 25px; color: #b38728; font-size: 16px;">✓</td>
                                        <td valign="top" style="padding-bottom: 12px;"><strong>12 Semaines</strong> de programme évolutif IA & Humain</td>
                                    </tr>
                                    <tr>
                                        <td valign="top" style="padding-bottom: 12px; width: 25px; color: #b38728; font-size: 16px;">✓</td>
                                        <td valign="top" style="padding-bottom: 12px;"><strong>Plan Nutritionnel</strong> complet et sur-mesure</td>
                                    </tr>
                                    <tr>
                                        <td valign="top" style="padding-bottom: 12px; width: 25px; color: #b38728; font-size: 16px;">✓</td>
                                        <td valign="top" style="padding-bottom: 12px;"><strong>6 Entretiens Visio</strong> individuels (Mental & Technique)</td>
                                    </tr>
                                    <tr>
                                        <td valign="top" style="padding-bottom: 12px; width: 25px; color: #b38728; font-size: 16px;">✓</td>
                                        <td valign="top" style="padding-bottom: 12px;">Module d'ancrage exclusif <strong>"Atomic Habits"</strong></td>
                                    </tr>
                                    <tr>
                                        <td valign="top" style="padding-bottom: 12px; width: 25px; color: #b38728; font-size: 16px;">✓</td>
                                        <td valign="top" style="padding-bottom: 12px;">Accès direct WhatsApp <strong>7j/7</strong></td>
                                    </tr>
                                    <tr>
                                        <td valign="top" style="padding-bottom: 12px; width: 25px; color: #fcf6ba; font-size: 16px;">🎁</td>
                                        <td valign="top" style="padding-bottom: 12px; color: #fcf6ba;"><strong>Bonus VIP :</strong> Accès illimité à la bibliothèque E-books (Valeur 90€)</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 10px 40px 40px;">
                                <a href="${titanLink}" target="_blank" class="glow-button" style="
                                    background: linear-gradient(135deg, #b38728 0%, #aa771c 100%);
                                    color: #000000;
                                    font-size: 15px;
                                    font-weight: 900;
                                    text-decoration: none;
                                    text-transform: uppercase;
                                    letter-spacing: 2px;
                                    padding: 20px 40px;
                                    border-radius: 4px;
                                    display: inline-block;
                                    border: 1px solid #fcf6ba;
                                    box-shadow: 0 0 20px rgba(179, 135, 40, 0.4);
                                ">
                                    DÉBLOQUER MA PLACE MAINTENANT
                                </a>
                                <p style="color: #555555; font-size: 11px; margin-top: 15px;">
                                    ⚠️ Ce lien d'activation est unique et expirera sous 48h.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #030303; border-top: 1px solid #1a1a1a; padding: 25px; text-align: center; color: #333333; font-size: 10px; font-family: 'Courier New', monospace;">
                                <p style="margin: 0 0 5px;">
                                    SECURE LINK ID: ${Date.now().toString(36).toUpperCase()}-XF
                                </p>
                                <p style="margin: 0 0 5px;">
                                    CRYPTAGE AES-256 // NE PAS TRANSFÉRER CE MESSAGE
                                </p>
                                <p style="margin: 0; color: #444444;">
                                    &copy; 2025 OPTIFORM - PROTOCOLE TITAN
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

    // --- ENVOI VIA RESEND ---
    const { data: resendData, error } = await resend.emails.send({
        from: "OPTIFORM Titan Protocol <onboarding@resend.dev>", // Ton domaine quand tu seras prêt
        to: email,
        subject: `👑 Protocole Optiform TITAN : Accès Ambassadeur Validé`,
        html: htmlEmail,
    });

    if (error) {
        console.error("Erreur de l'API Resend:", error);
        return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
    }

    console.log(`✅ Mail Titan envoyé à ${email}.`);
    return { statusCode: 200, headers, body: JSON.stringify({ message: "Transmission réussie" }) };

  } catch (error) {
    console.error("Erreur critique:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
