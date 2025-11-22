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
    const { nom, email, objectif, douleur, description, sommeil } = data;

    console.log(`Traitement Gemini pour ${nom}`);

    // 1. PROMPT MODIFIÉ (Stratégie vs Programme)
    const promptSysteme = `
      Agis comme un expert mondial en biomécanique et coaching sportif (Ostéopathe & Coach).
      Ton but : Présenter une stratégie de haut niveau pour convaincre le prospect de réserver son bilan biomécanique (étape préalable obligatoire à la création de son programme sur-mesure).
      
      Données du prospect :
      - Nom : ${nom}
      - Objectif : ${objectif}
      - Douleur : ${douleur} (${description})
      - Sommeil : ${sommeil}

      Rédige un email au format HTML riche (utilise des balises <h3>, <ul>, <li>, <strong>, <br>).
      Ne mets PAS de balises <html> ou <body>.

      STRUCTURE OBLIGATOIRE DE L'EMAIL :
      
      1. ACCROCHE (H3) : "⚠️ Analyse de ${nom} : Potentiel détecté & Points de vigilance"
      
      2. DIAGNOSTIC EXPERT (Paragraphe) : Analyse le lien entre sa douleur (${douleur}) et son sommeil (${sommeil}). Explique pourquoi un programme générique aggraverait son cas (risque inflammatoire/blessure).
      
      3. LA FEUILLE DE ROUTE (Liste structurée) : 
         Dis : "Voici les 3 piliers stratégiques que nous devrons mettre en place :"
         <ul>
           <li><strong>Phase 1 (Fondations) :</strong> Protocole de décompression articulaire spécifique pour soulager ${douleur}.</li>
           <li><strong>Phase 2 (Construction) :</strong> Renforcement structurel adapté à votre biomécanique pour sécuriser le mouvement.</li>
           <li><strong>Phase 3 (Performance) :</strong> Intensification métabolique pour atteindre l'objectif : ${objectif}.</li>
         </ul>

      4. LE "GAP" (Pourquoi réserver ?) :
         Explique clairement : "Ceci est une ébauche stratégique. En tant qu'ostéopathe, je ne peux pas construire votre programme détaillé (exercices, charges, volumes) sans vous voir bouger. Une prescription à l'aveugle serait irresponsable."

      5. APPEL À L'ACTION :
         "Réservez votre Bilan Biomécanique (Visio) pour que j'analyse vos chaînes musculaires et que nous lancions la création de votre programme sur-mesure."

      Ton ton doit être : Professionnel, Rassurant, Expert.
      Signe : "L'IA OptiForm (Supervisée par Cyril Mangeolle)".
    `;

    // 2. Appel IA
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(promptSysteme);
    const emailContent = result.response.text();

    // 3. Définition des LIENS (Correction des erreurs)
    const bookingLink = "https://zeeg.me/cyril41mangeolle/bilanstrategiques";
    const instagramLink = "https://www.instagram.com/cyril_fitlife";
    
    // 4. Design de l'email
    const htmlFinal = `
      <div style="font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #eee;">
        
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">
          <h2 style="color: #2b5f7f; margin: 0;">Rapport Stratégique IA 🤖</h2>
          <p style="color: #666; font-size: 12px;">Dossier Réf: #OPT-${Date.now().toString().slice(-4)}</p>
        </div>

        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            ${emailContent}
        </div>

        <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
          <p style="font-weight: bold; color: #e67e22; margin-bottom: 10px;">👇 Étape suivante : Création de votre Plan</p>
          <a href="${bookingLink}" style="background-color: #e67e22; color: white; padding: 16px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 18px; display: inline-block; box-shadow: 0 4px 6px rgba(230, 126, 34, 0.3);">
            RÉSERVER MON BILAN EXPERT
          </a>
          <p style="font-size: 12px; color: #999; margin-top: 10px;">*Audit visio nécessaire pour valider la faisabilité du programme.</p>
        </div>
       
        <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center;"> 
            <p style="margin-bottom: 10px; font-size: 14px;">En attendant notre appel, retrouvez mes conseils santé & performance :</p>
            <a href="${instagramLink}" style="text-decoration: none; color: #C13584; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 8px;"> 
                <span>📸</span> Suivre mon Instagram Pro (@cyril_fitlife)
            </a>
        </div>

      </div>
    `;

    // 5. Envoi
    await resend.emails.send({
      from: "Coach IA <onboarding@resend.dev>",
      to: email,
      subject: `⚠️ Analyse terminée : Votre Stratégie pour ${nom}`,
      html: htmlFinal,
    });

    return { statusCode: 200, body: JSON.stringify({ message: "Succès" }) };

  } catch (error) {
    console.error("Erreur:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
