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

        // --- TEMPLATE EMAIL "TITAN V3" (AVEC COMPTE À REBOURS & VIDÉO) ---
    const htmlEmail = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accès Titan Déverrouillé</title>
        <style>
            body, table, td, div, p, a { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
            body { margin: 0; padding: 0; background-color: #050505 !important; color: #ffffff; }
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
                            <td align="center" style="padding: 10px 40px 20px;">
                                <a href="${titanLink}" target="_blank" style="display: block; text-decoration: none; position: relative;">
                                    <div style="border: 1px solid #b38728; border-radius: 12px; overflow: hidden; position: relative; background-color: #111;">
                                        <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z0d2VndTFndnBwdTh0azczNXAwd2ExcnR5cWNxd2p1dXp1eHpqbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7WTq4r7wY6oQ4Hqo/giphy.gif" width="100%" alt="Vidéo Confidentielle" style="display: block; opacity: 0.6; mix-blend-mode: luminosity;">
                                        
                                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 100%;">
                                            <div style="font-size: 40px; margin-bottom: 5px;">▶️</div>
                                            <div style="background: rgba(0,0,0,0.8); color: #fcf6ba; display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; border: 1px solid #b38728; letter-spacing: 1px; font-weight: bold; text-transform: uppercase;">Message Vidéo de Cyril</div>
                                        </div>
                                    </div>
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 10px 40px 10px; color: #cccccc; font-size: 15px; line-height: 1.6; text-align: left;">
                                <p style="margin: 0 0 15px;">
                                    Votre code a été validé. Vous venez de débloquer l'accès à notre programme le plus élitiste : <strong style="color: #fcf6ba;">Le Pack Transformation "Legacy"</strong>.
                                </p>
                                <p style="margin: 0;">
                                    En tant qu'Ambassadeur, vous bénéficiez d'une prise en charge de 50%.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 20px 30px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(145deg, #111111, #080808); border: 1px solid #b38728; border-radius: 12px;">
                                    <tr>
                                        <td align="center" style="padding: 25px;">
                                            <span style="text-decoration: line-through; color: #555555; font-size: 20px; font-weight: bold;">450€</span>
                                            <br>
                                            <span style="color: #ffffff; font-size: 55px; font-weight: 900; line-height: 1; text-shadow: 0 0 20px rgba(179, 135, 40, 0.4);">
                                                225€
                                            </span>
                                            <br>
                                            <span style="color: #888888; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Règlement unique</span>
                                            
                                            <div style="margin-top: 25px; border-top: 1px solid #333; padding-top: 20px;">
                                                <p style="color: #e74c3c; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; margin: 0 0 10px;">⚠️ L'offre expire dans :</p>
                                                <img src="https://gen.sendtric.com/countdown/nphc9a2i7c" style="display: block; width: 100%; max-width: 250px;" alt="Compte à rebours">
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 40px 20px;">
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
                                        <td valign="top" style="padding-bottom: 12px;"><strong>6 Entretiens Visio</strong> individuels</td>
                                    </tr>
                                    <tr>
                                        <td valign="top" style="padding-bottom: 12px; width: 25px; color: #b38728; font-size: 16px;">✓</td>
                                        <td valign="top" style="padding-bottom: 12px;">Module <strong>"Atomic Habits"</strong> & Accès WhatsApp <strong>7j/7</strong></td>
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
                                    ACTIVER MON PASS TITAN
                                </a>
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
