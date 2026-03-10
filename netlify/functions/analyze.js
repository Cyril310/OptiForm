const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Resend } = require("resend");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  // Sécurité : POST uniquement
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  try {
        const data = JSON.parse(event.body);
    const { nom, email, sexe, age, taille, poids, objectif, douleur, description, sommeil, parrain } = data;
    const bookingLink = "https://zeeg.me/cyril41mangeolle/bilan-strategique-ou-bilan-offert"; // Ton lien agenda
    
    // --- BLOC PARRAINAGE DYNAMIQUE ---
      let referralBlock = "";
      if (parrain && parrain.trim() !== "") {
          referralBlock = `
          <div style="background-color: #e8f5e9; border: 1px solid #27ae60; border-radius: 8px; padding: 15px; margin: 30px 30px 50px 30px; text-align: center;">
              <strong style="color: #27ae60; font-size: 16px; display: block; margin-bottom: 5px;">✅ TARIF PRIVILÈGE ACTIVÉ</strong>
              <p style="margin: 0; color: #1e4620; font-size: 14px;">
                  Référence validée : <strong>${parrain}</strong>.<br>
                  Ce dossier sera traité en priorité avec la réduction associée.
              </p>
          </div>
          `;
      }

    // --- 1. PROMPT DESIGN (On force l'IA à structurer pour le Template) ---
    const promptSysteme = `
      Agis comme un Expert en Biomécanique et Physiologie du Sport.
      Ton client est : ${nom} (${sexe}, ${age} ans, ${taille}cm, ${poids}kg).
      Objectif : ${objectif}.
      Douleur actuelle : ${douleur} (${description}).
      
      Rédige l'analyse SANS titre principal, SANS "Bonjour", SANS signature.
      Utilise impérativement ce format HTML (balises h3, ul, li, p) :

      <h3 style="color: #2b5f7f; margin-top: 0;">1. 🩺 Diagnostic & Biomécanique</h3>
      <p>Analyse le lien mécanique entre sa douleur (${douleur}) et sa morphologie. Sois expert mais pédagogique.</p>

      <h3 style="color: #e67e22; margin-top: 25px;">2. 🚀 Stratégie en 3 Phases</h3>
      <ul style="padding-left: 20px; color: #444;">
        <li style="margin-bottom: 10px;"><strong>Phase 1 (Soulagement) :</strong> ...</li>
        <li style="margin-bottom: 10px;"><strong>Phase 2 (Renforcement) :</strong> ...</li>
        <li style="margin-bottom: 10px;"><strong>Phase 3 (Performance) :</strong> ...</li>
      </ul>

      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 5px solid #ffc107; margin-top: 25px;">
        <strong style="color: #856404;">⚠️ Point de Vigilance :</strong>
        <p style="margin: 5px 0 0 0; color: #856404; font-size: 14px;">Un avertissement court sur les risques de suivre un programme générique.</p>
      </div>
    `;

    // Génération IA
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(promptSysteme);
    const emailContent = result.response.text();

    // --- 2. TEMPLATE EMAIL PRO (DESIGN TABLEAU DE BORD + INSTA PERSONNALISÉ) ---
    const instagramLink = "https://www.instagram.com/cyril_fitlife";

    const htmlEmail = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <title>Votre Rapport Stratégique IA</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0; padding:0; background-color:#0f1820;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#0f1820; padding:20px 0;">
        <tr>
          <td align="center">
    
            <!-- CONTAINER PRINCIPAL -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 18px 45px rgba(10,27,43,0.40); font-family:Helvetica,Arial,sans-serif;">
    
              <!-- BARRE HAUTE + PROGRESSION -->
              <tr>
                <td style="padding:0;">
    
                  <!-- Barre de progression -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="height:4px; background:linear-gradient(90deg,#2b5f7f,#e67e22); font-size:0; line-height:0;">&nbsp;</td>
                    </tr>
                  </table>
    
                  <!-- Header hero -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:linear-gradient(135deg,#1a3d52,#2b5f7f);">
                    <tr>
                      <td align="center" style="padding:28px 24px 26px;">
                        <p style="margin:0 0 6px; font-size:11px; letter-spacing:2px; color:#aecbe0; text-transform:uppercase;">
                          Rapport généré par IA & validé par un ostéopathe
                        </p>
                        <h1 style="margin:0; font-size:24px; line-height:1.3; color:#ffffff; text-transform:uppercase; letter-spacing:1px;">
                          Rapport Stratégique de <span style="color:#ffc857;">${nom}</span>
                        </h1>
                        <p style="margin:10px 0 0; font-size:13px; color:#d1e3f3;">
                          Biomécanique • Performance • Prévention des blessures
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
    
              <!-- BLOC PROFIL / OBJECTIF -->
              <tr>
                <td style="background-color:#f4f7fb; border-bottom:1px solid #e1e7ee; padding:16px 20px 18px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size:13px; color:#263545;">
                    <tr>
                      <td width="33%" align="center" style="border-right:1px solid #dde4ee; padding:0 8px;">
                        <div style="font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#7f8c9f; margin-bottom:4px;">
                          Profil
                        </div>
                        <div style="font-size:13px; font-weight:600; color:#2b5f7f;">
                          ${sexe}, ${age} ans
                        </div>
                      </td>
    
                      <td width="33%" align="center" style="border-right:1px solid #dde4ee; padding:0 8px;">
                        <div style="font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#7f8c9f; margin-bottom:4px;">
                          Données
                        </div>
                        <div style="font-size:13px; font-weight:600; color:#2b5f7f;">
                          ${taille} cm • ${poids} kg
                        </div>
                      </td>
    
                      <td width="33%" align="center" style="padding:0 8px;">
                        <div style="font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#7f8c9f; margin-bottom:4px;">
                          Objectif
                        </div>
                        <div style="font-size:13px; font-weight:600; color:#e67e22;">
                          ${objectif}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
    
              <!-- MESSAGE D’INTRO + CONTENU IA -->
              <tr>
                <td style="padding:26px 28px 12px; color:#2c3e50; line-height:1.6;">
                  <p style="font-size:15px; margin:0 0 18px;">
                    Bonjour <strong>${nom}</strong>,
                  </p>
                  <p style="font-size:14px; margin:0 0 18px; color:#607d8b;">
                    Voici l’analyse personnalisée de votre situation actuelle et des leviers les plus rapides pour vous rapprocher de votre objectif&nbsp;:
                    <strong>${objectif}</strong>.
                  </p>
    
                  <!-- Contenu généré par l'IA, déjà en HTML -->
                  <div style="font-size:14px; color:#34495e; line-height:1.6;">
                    ${emailContent}
                  </div>
                </td>
              </tr>
    
              <!-- BLOC “SYNTHÈSE VISUELLE” -->
              <tr>
                <td style="padding:6px 28px 22px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-radius:14px; border:1px solid #ecf0f3; background:#fdfefe;">
                    <tr>
                      <td style="padding:16px 18px 10px;">
                        <p style="margin:0 0 10px; font-size:13px; letter-spacing:1px; text-transform:uppercase; color:#95a5a6;">
                          Vue rapide
                        </p>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size:12px; color:#2c3e50;">
                          <tr>
                            <td width="50%" style="padding:4px 6px;">
                              <strong style="color:#2b5f7f;">Douleur ciblée :</strong><br/>
                              <span style="color:#607d8b;">${douleur}</span>
                            </td>
                            <td width="50%" style="padding:4px 6px;">
                              <strong style="color:#2b5f7f;">Contexte :</strong><br/>
                              <span style="color:#607d8b;">${description}</span>
                            </td>
                          </tr>
                          <tr>
                            <td width="50%" style="padding:4px 6px;">
                              <strong style="color:#2b5f7f;">Qualité du sommeil :</strong><br/>
                              <span style="color:#607d8b;">${sommeil}</span>
                            </td>
                            <td width="50%" style="padding:4px 6px;">
                              <strong style="color:#2b5f7f;">Niveau d’urgence :</strong><br/>
                              <span style="color:#e67e22;">Personnalisé après bilan visio</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
    
              <!-- BLOC PARRAINAGE SI PRÉSENT -->
              ${referralBlock}
    
              <!-- ÉTAPES SUIVANTES + CTA BILAN -->
              <tr>
                <td style="padding:0 28px 26px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-radius:16px; background:linear-gradient(145deg,#fef6ec,#fdfaf5); border:1px solid #f8e1c4;">
                    <tr>
                      <td style="padding:20px 18px 18px; text-align:center;">
                        <p style="margin:0 0 10px; font-size:13px; letter-spacing:1px; text-transform:uppercase; color:#d35400;">
                          Étapes recommandées
                        </p>
                        <p style="margin:0 0 14px; font-size:13px; color:#7f8c8d;">
                          Pour transformer ce rapport en résultats concrets, voici le chemin le plus simple&nbsp;:
                        </p>
                        <ol style="margin:0; padding:0 0 0 18px; text-align:left; font-size:13px; color:#444;">
                          <li style="margin-bottom:6px;">
                            Validation de votre situation en visio (douleurs, contraintes, emploi du temps).
                          </li>
                          <li style="margin-bottom:6px;">
                            Création d’un protocole <strong>sur-mesure</strong> (mouvements, charges, fréquence).
                          </li>
                          <li style="margin-bottom:0;">
                            Ajustements hebdomadaires via suivi + retours pour progresser sans douleur.
                          </li>
                        </ol>
    
                        <div style="margin-top:18px;">
                          <a href="${bookingLink}" style="display:inline-block; padding:13px 30px; border-radius:45px; background:linear-gradient(135deg,#e67e22,#d35400); color:#ffffff; font-size:15px; font-weight:bold; text-decoration:none; box-shadow:0 10px 25px rgba(211,84,0,0.35);">
                            📅 Réserver mon bilan offert
                          </a>
                          <p style="font-size:11px; color:#a4793b; margin:8px 0 0;">
                            * Le bilan visio est nécessaire pour valider la faisabilité du protocole.
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
    
              <!-- BLOC INSTAGRAM -->
              <tr>
                <td style="padding:0 28px 26px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fff5fb; border-radius:16px; border:1px solid #ffd6ec;">
                    <tr>
                      <td style="padding:18px 18px 10px; text-align:center;">
                        <p style="margin:0 0 6px; font-size:13px; color:#C13584; font-weight:600;">
                          🚀 Booster vos résultats au quotidien
                        </p>
                        <p style="margin:0 0 10px; font-size:13px; color:#555; line-height:1.5;">
                          Je partage en story des astuces <strong>“flash” (moins d’une minute)</strong> sur&nbsp;:
                          <br/>
                          <span style="font-size:12px; color:#333;">
                            🧠 Mental &nbsp;•&nbsp; 💪 Physique &nbsp;•&nbsp; 🥗 Nutrition &nbsp;•&nbsp; 💤 Sommeil
                          </span>
                        </p>
                        <p style="margin:0 0 12px; font-size:12px; color:#777; font-style:italic; background:rgba(255,255,255,0.7); padding:8px 10px; border-radius:8px;">
                          "Puisque votre sommeil est <strong>${sommeil}</strong>, mes conseils du soir vous aideront directement à atteindre votre objectif&nbsp;: <strong>${objectif}</strong>."
                        </p>
                        <a href="${instagramLink}" style="display:inline-block; margin-top:2px; padding:10px 20px; border-radius:10px; background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); color:#ffffff; font-size:13px; font-weight:bold; text-decoration:none; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
                          📸 Voir les conseils gratuits (@cyril_fitlife)
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
    
              <!-- FOOTER -->
              <tr>
                <td style="background-color:#2b5f7f; text-align:center; padding:14px 10px;">
                  <p style="margin:0; font-size:11px; color:#e0eff8;">
                    &copy; 2025 OptiForm Coaching – Supervisé par Cyril Mangeolle.
                  </p>
                  <p style="margin:4px 0 0; font-size:10px; color:#aecbe0;">
                    Rapport généré par IA, contrôlé par un ostéopathe. Ne remplace pas un avis médical personnalisé.
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
    // --- 3. ENVOI UNIQUE & SAUVEGARDE ---
    
    // A. Envoi du Rapport (Priorité absolue)
    await resend.emails.send({
        from: "Coach IA <onboarding@resend.dev>", // ⚠️ À changer par ton adresse pro dès que possible
        to: email,
        subject: `📋 Votre Rapport Biomécanique : ${nom}`,
        html: htmlEmail,
    });
    console.log(`✅ Rapport envoyé à ${email}`);

    // B. Sauvegarde Contact (Si clé API OK)
    if (process.env.RESEND_AUDIENCE_ID) {
        try {
            await resend.contacts.create({
                email: email,
                first_name: nom,
                unsubscribed: false,
                audienceId: process.env.RESEND_AUDIENCE_ID
            });
            console.log("✅ Contact sauvegardé");
        } catch (err) {
            console.warn("⚠️ Contact non sauvegardé (Probable doublon ou limite):", err.message);
        }
    }

    return { statusCode: 200, body: JSON.stringify({ message: "Analyse envoyée avec succès !" }) };



  } catch (error) {
    console.error("Erreur:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
