const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Resend } = require("resend");

// Initialisation de Google Gemini et Resend
// (Les clés seront sur Netlify)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  // Sécurité : On accepte seulement les envois de formulaire (POST)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  try {
    // 1. Récupération des données
    const data = JSON.parse(event.body);
    const { nom, email, objectif, douleur, description, sommeil } = data;

    console.log(`Traitement Gemini pour ${nom}`);

    // 2. Le Prompt "Copywriting & Design" pour Gemini
    const promptSysteme = `
      Agis comme un expert mondial en biomécanique et coaching sportif de haut niveau.
      Ton but est de convaincre ce prospect qu'il a besoin d'un accompagnement payant immédiat.
      
      Données du prospect :
      - Nom : ${nom}
      - Objectif : ${objectif}
      - Douleur : ${douleur} (${description})
      - Sommeil : ${sommeil}

      Rédige un email au format HTML riche (utilise des balises <h3>, <ul>, <li>, <strong>, <br>).
      Ne mets PAS de balises <html> ou <body>, juste le contenu du corps du mail.

      STRUCTURE OBLIGATOIRE :
      
      1. ACCROCHE (H3) : "⚠️ Analyse du profil de ${nom} : Résultat Critique"
      
      2. DIAGNOSTIC (Paragraphe) : Analyse le lien direct et dangereux entre sa douleur (${douleur}) et son sommeil (${sommeil}). Sois alarmiste mais professionnel. Explique le mécanisme biologique (cortisol/inflammation).
      
      3. LE PLAN GÉNÉRÉ (Liste structurée) : 
         Dis : "J'ai modélisé votre protocole de guérison sur 12 semaines :"
         <ul>
           <li><strong>Phase 1 (Jours 1-21) :</strong> Décompression articulaire & Sommeil profond.</li>
           <li><strong>Phase 2 (Semaines 4-8) :</strong> Renforcement structurel ciblé sur la zone ${douleur}.</li>
           <li><strong>Phase 3 (Semaines 9-12) :</strong> Métabolisme & Performance pure.</li>
         </ul>

      4. LE BLOCAGE DE SÉCURITÉ (Box jaune simulée) :
         Explique fermement : "Je ne PEUX PAS vous envoyer ce fichier PDF maintenant. Votre profil biomécanique présente un risque. Si vous faites le mauvais mouvement, vous aggravez la douleur."

      5. APPEL À L'ACTION :
         "Je dois valider votre posture en visio (15 min) avant de débloquer le programme."
         (Ne mets pas le lien ici, il sera ajouté par le code après).

      Ton ton doit être : Autoritaire, Bienveillant, Scientifique.
      Signe : "L'IA OptiForm (Supervisée par Cyril Mangeolle)".
    `;


    // 3. Appel à Google Gemini (Modèle Flash, très rapide)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(promptSysteme);
    const emailContent = result.response.text();

    // 4. Ajout du bouton Calendly
    const bookingLink = "https://zeeg.me/cyril41mangeolle/bilanstrategiques"; // CHANGE CE LIEN !
    
    const htmlFinal = `
      <div style="font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #eee;">
        
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">
          <h2 style="color: #2b5f7f; margin: 0;">Rapport d'Analyse IA 🤖</h2>
          <p style="color: #666; font-size: 12px;">Dossier Réf: #OPT-${Date.now().toString().slice(-4)}</p>
        </div>

        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            ${emailContent}
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="font-weight: bold; color: #e67e22;">👇 Débloquez votre programme maintenant :</p>
          <a href="${bookingLink}" style="background-color: #e67e22; color: white; padding: 18px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 18px; display: inline-block; box-shadow: 0 4px 6px rgba(230, 126, 34, 0.3);">
            RÉSERVER MON BILAN DE VALIDATION
          </a>
          <p style="font-size: 12px; color: #999; margin-top: 15px;">*Créneau de 15 min offert - Engagement de présence requis.</p>
        </div>
        </a>
       
        <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align:
        center; "> 
        <p style="margin-bottom: 10px; font-size: 14px;">En attendant notre appel, retrouvez mes conseils santé & performance :</p>
        <a href="${instagramlink}" style="text-decoration: none; 
        color: #C13584; font-weight: bold; font-size: 16px: display: flex: align-items: center:
        justify-content: center: gap: 8px;"> <span>📸</span> suivre mon
        Instagram Pro (@cyril_fitlife)
          </a>
        </div>

      </div>
    `;


    // 5. Envoi de l'email via Resend
    await resend.emails.send({
      from: "Coach IA <onboarding@resend.dev>",
      to: email,
      subject: `⚠️ Analyse Gemini terminée : Plan d'action pour ${nom}`,
      html: htmlFinal,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Succès ! Email envoyé." }),
    };

  } catch (error) {
    console.error("Erreur Gemini/Resend:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur interne serveur." }),
    };
  }
};

