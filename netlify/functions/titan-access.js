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

    // --- TEMPLATE EMAIL "TITAN V3" (SÉCURISÉ POUR GMAIL/APPLE MAIL) ---
    const htmlEmail = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <title>Protocole Optiform TITAN – Accès Ambassadeur</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body, table, td, p, a { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        body { margin:0; padding:0; background-color:#050505 !important; color:#ffffff; }
      </style>
    </head>
    <body style="background-color:#050505; margin:0; padding:24px 0;">
    
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#050505;">
        <tr>
          <td align="center">
    
            <!-- CONTAINER -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background-color:#080808; border-radius:20px; border:1px solid #2b2b2b; overflow:hidden; box-shadow:0 0 40px rgba(0,0,0,0.7);">
    
              <!-- FILET OR -->
              <tr>
                <td style="height:3px; background:linear-gradient(90deg,#b38728,#fcf6ba,#aa771c); font-size:0; line-height:0;">&nbsp;</td>
              </tr>
    
              <!-- HEADER TITAN -->
              <tr>
                <td align="center" style="padding:34px 24px 16px;">
                  <div style="font-size:44px; margin-bottom:10px; text-shadow:0 0 18px rgba(252,246,186,0.7);">💎</div>
                  <p style="margin:0 0 4px; font-size:11px; letter-spacing:3px; color:#8c8c8c; text-transform:uppercase;">
                    Protocole Optiform // Niveau Élite
                  </p>
                  <h1 style="margin:4px 0 0; font-size:24px; text-transform:uppercase; letter-spacing:3px; color:#ffffff;">
                    Statut <span style="color:#fcf6ba;">Ambassadeur</span> Activé
                  </h1>
                  <p style="margin:10px 0 0; font-size:12px; color:#aaaaaa;">
                    Votre code a été validé. L’accès au <strong>Pack Transformation “Legacy”</strong> est désormais réservé pour vous.
                  </p>
                </td>
              </tr>
    
              <!-- VISUEL + BOUTON VIDÉO -->
              <tr>
                <td align="center" style="padding:10px 34px 6px;">
                  <a href="${titanLink}" target="_blank" style="display:block; text-decoration:none;">
                    <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop" width="100%" alt="Séance de coaching haut niveau" style="display:block; border-radius:16px 16px 0 0; border:1px solid #b38728; border-bottom:none;">
                    <div style="background:linear-gradient(135deg,#b38728,#fcf6ba,#aa771c); color:#000; padding:13px 12px; border-radius:0 0 16px 16px; font-weight:900; text-transform:uppercase; letter-spacing:1px; border:1px solid #b38728; border-top:none; font-size:13px;">
                      ▶️ Cliquer pour voir le message vidéo
                    </div>
                  </a>
                </td>
              </tr>
    
              <!-- BLOC PRIX + COMPTE À REBOURS -->
              <tr>
                <td align="center" style="padding:12px 30px 4px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(145deg,#111111,#050505); border-radius:18px; border:1px solid #b38728;">
                    <tr>
                      <td align="center" style="padding:22px 18px 18px;">
                        <p style="margin:0 0 4px; font-size:11px; color:#d3ac55; letter-spacing:2px; text-transform:uppercase;">
                          Contribution Ambassadeur
                        </p>
                        <span style="display:block; text-decoration:line-through; color:#777777; font-size:18px; font-weight:600; margin-bottom:4px;">
                          450€
                        </span>
                        <span style="display:block; color:#ffffff; font-size:46px; font-weight:900; line-height:1; text-shadow:0 0 22px rgba(179,135,40,0.5);">
                          225€
                        </span>
                        <span style="display:block; color:#bbbbbb; font-size:11px; letter-spacing:1px; text-transform:uppercase; margin-top:4px;">
                          Règlement unique – 50% pris en charge
                        </span>
    
                        <div style="margin-top:18px; border-top:1px solid #2c2c2c; padding-top:14px;">
                          <p style="margin:0 0 8px; color:#e74c3c; font-size:11px; text-transform:uppercase; font-weight:bold; letter-spacing:2px;">
                            ⚠️ Offre temporaire
                          </p>
                          <p style="margin:0 0 10px; color:#999999; font-size:11px;">
                            Une fois le compteur à zéro, le tarif Ambassadeur repasse automatiquement au prix standard.
                          </p>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center">
                                <img src="https://i.countdownmail.com/4usmq3.gif?id=$2y$10$@d1Z7X/${email}"
                                     alt="Compte à rebours de l'offre"
                                     width="100%"
                                     style="max-width:280px; display:block; border-radius:10px; box-shadow:0 0 16px rgba(0,0,0,0.7); border:1px solid #3a3a3a;">
                              </td>
                            </tr>
                          </table>
                        </div>
    
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
    
              <!-- CONTENU : CE QUE VOUS DÉBLOQUEZ -->
              <tr>
                <td style="padding:8px 34px 4px; color:#dddddd; font-size:14px; line-height:1.6;">
                  <p style="margin:0 0 12px;">
                    En activant ce statut, vous accédez au programme le plus structuré d’OptiForm&nbsp;:
                    <strong style="color:#fcf6ba;">12 semaines pour changer définitivement votre physique, vos habitudes et votre niveau d’énergie.</strong>
                  </p>
                  <p style="margin:0 0 4px; font-size:12px; color:#999999; text-transform:uppercase; letter-spacing:1px;">
                    Inclus dans votre accès Ambassadeur&nbsp;:
                  </p>
                </td>
              </tr>
    
              <!-- LISTE DES AVANTAGES -->
              <tr>
                <td style="padding:0 34px 12px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="color:#f0f0f0; font-size:13px; line-height:1.5;">
                    <tr>
                      <td style="padding:3px 0 3px 0; width:26px; color:#b38728; font-size:16px;" valign="top">✓</td>
                      <td style="padding:3px 0;" valign="top">
                        <strong>12 semaines</strong> de programme évolutif (IA + ajustements humains) pour coller à votre réalité.
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:3px 0; width:26px; color:#b38728; font-size:16px;" valign="top">✓</td>
                      <td style="padding:3px 0;" valign="top">
                        <strong>Plan nutritionnel</strong> complet, compatible avec vos contraintes (travail, famille, horaires).
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:3px 0; width:26px; color:#b38728; font-size:16px;" valign="top">✓</td>
                      <td style="padding:3px 0;" valign="top">
                        <strong>6 entretiens visio individuels</strong> pour recadrer, ajuster et garder le cap.
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:3px 0; width:26px; color:#b38728; font-size:16px;" valign="top">✓</td>
                      <td style="padding:3px 0;" valign="top">
                        Module <strong>“Atomic Habits”</strong> pour rendre vos nouvelles habitudes quasi automatiques + accès WhatsApp <strong>7j/7</strong>.
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:3px 0; width:26px; color:#fcf6ba; font-size:16px;" valign="top">🎁</td>
                      <td style="padding:3px 0; color:#fcf6ba;" valign="top">
                        <strong>Bonus VIP :</strong> Accès illimité à la bibliothèque d’e-books (valeur 90€) pour renforcer vos résultats.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
    
              <!-- MINI “PLAN EN 3 ÉTAPES” + CTA -->
              <tr>
                <td style="padding:4px 30px 20px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:radial-gradient(circle at top,#1c1c1c 0,#050505 70%); border-radius:18px; border:1px solid #2a2a2a;">
                    <tr>
                      <td style="padding:20px 18px 10px; text-align:center;">
                        <p style="margin:0 0 6px; font-size:11px; color:#d3ac55; text-transform:uppercase; letter-spacing:2px;">
                          Comment ça va se passer
                        </p>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size:12px; color:#e0e0e0;">
                          <tr>
                            <td style="padding:4px 4px;" valign="top">
                              <strong style="color:#fcf6ba;">1.</strong> Vous validez votre accès via le bouton ci‑dessous.
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:4px 4px;" valign="top">
                              <strong style="color:#fcf6ba;">2.</strong> Vous recevez immédiatement la confirmation + le lien pour planifier votre premier rendez‑vous.
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:4px 4px;" valign="top">
                              <strong style="color:#fcf6ba;">3.</strong> On définit ensemble la stratégie complète (entrainement, nutrition, habitudes, récupération) et on lance la phase de transformation.
                            </td>
                          </tr>
                        </table>
    
                        <div style="margin-top:16px;">
                          <a href="${titanLink}" target="_blank" style="
                            display:inline-block;
                            background:linear-gradient(135deg,#b38728,#fcf6ba,#aa771c);
                            color:#000000;
                            font-size:14px;
                            font-weight:900;
                            text-decoration:none;
                            text-transform:uppercase;
                            letter-spacing:2px;
                            padding:16px 34px;
                            border-radius:6px;
                            border:1px solid #fcf6ba;
                            box-shadow:0 0 24px rgba(179,135,40,0.6);
                          ">
                            Activer mon pass TITAN
                          </a>
                          <p style="margin:8px 0 0; font-size:10px; color:#a0a0a0;">
                            Votre lien est personnel. Une fois expiré, le tarif repasse automatiquement à 450€.
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
    
              <!-- FOOTER -->
              <tr>
                <td align="center" style="padding:14px 20px 18px; background-color:#050505;">
                  <p style="margin:0 0 4px; font-size:10px; color:#777777;">
                    &copy; 2025 OptiForm – Protocole TITAN par Cyril Mangeolle.
                  </p>
                  <p style="margin:0; font-size:10px; color:#555555;">
                    Vous recevez cet email car un accès Ambassadeur a été demandé avec cette adresse.
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

