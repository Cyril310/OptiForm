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
    const bookingLink = "https://zeeg.me/cyril41mangeolle/bilanstrategiques"; // Ton lien agenda
    
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
    <html>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica', sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        
        <div style="background-color: #2b5f7f; padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">Rapport Stratégique IA</h1>
          <p style="color: #aecbe0; margin: 5px 0 0; font-size: 14px;">Biomécanique & Performance</p>
        </div>

        <div style="background-color: #f8f9fa; border-bottom: 1px solid #eee;">
           <table width="100%" cellpadding="15" cellspacing="0" style="font-size: 13px; color: #555;">
             <tr>
               <td width="33%" align="center" style="border-right: 1px solid #eee;"><strong>👤 Profil</strong><br>${sexe}, ${age} ans</td>
               <td width="33%" align="center" style="border-right: 1px solid #eee;"><strong>⚖️ Métriques</strong><br>${taille}cm / ${poids}kg</td>
               <td width="33%" align="center"><strong>🎯 Objectif</strong><br>${objectif}</td>
             </tr>
           </table>
        </div>

        <div style="padding: 30px; color: #333; line-height: 1.6;">
          <p style="font-size: 16px; margin-bottom: 20px;">Bonjour <strong>${nom}</strong>,</p>
          ${emailContent}
        </div>

        <div style="padding: 30px; color: #333; line-height: 1.6;">
            <p style="font-size: 16px; margin-bottom: 20px;">Bonjour <strong>${nom}</strong>,</p>
            ${emailContent}
          </div>
  
          ${referralBlock}
          <div style="text-align: center; padding: 0 30px 20px;">
            <a href="${bookingLink}" style="background-color: #e67e22; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(230, 126, 34, 0.4);">
              📅 RÉSERVER MON BILAN OFFERT
            </a>
            <p style="font-size: 12px; color: #999; margin-top: 10px;">*Audit visio nécessaire pour valider la faisabilité.</p>
        </div>

        <div style="margin: 20px; padding: 25px; background-color: #fff0f5; border-radius: 12px; border: 1px solid #ffdee9; text-align: center;">
            
            <h3 style="color: #C13584; margin: 0 0 10px 0; font-size: 18px;">🚀 Boostez vos résultats au quotidien</h3>
            
            <p style="font-size: 14px; color: #444; margin-bottom: 15px; line-height: 1.5;">
                En story, je partage des astuces "Flash" (moins d'une minute) pour agir sur vos 4 piliers :<br>
                <strong>🧠 Mental &bull; 💪 Physique &bull; 🥗 Nutrition &bull; 💤 Sommeil</strong>
            </p>
            
            <p style="font-size: 13px; color: #666; margin-bottom: 20px; font-style: italic; background: rgba(255,255,255,0.5); padding: 10px; border-radius: 5px;">
                "Puisque votre sommeil est <strong>${sommeil}</strong>, mes conseils du soir vous aideront directement à atteindre votre objectif : <strong>${objectif}</strong>."
            </p>

            <a href="${instagramLink}" style="
                display: block;
                background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); 
                color: white; 
                text-decoration: none; 
                padding: 14px 20px; 
                border-radius: 8px; 
                font-weight: bold; 
                font-size: 14px;
                box-shadow: 0 3px 6px rgba(0,0,0,0.1);">
                📸 VOIR LES CONSEILS GRATUITS (@cyril_fitlife)
            </a>
        </div>

        <div style="background-color: #2b5f7f; color: #ffffff; text-align: center; padding: 15px; font-size: 11px;">
          <p>&copy; 2025 OptiForm Coaching. Supervisé par Cyril Mangeolle.</p>
        </div>
      </div>
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
