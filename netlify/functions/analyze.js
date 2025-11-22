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

    // 2. Le Prompt pour Gemini
    const promptSysteme = `
      Agis comme un expert mondial en biomécanique et coaching sportif.
      Analyse ce profil pour vendre un coaching premium.
      
      Données du prospect :
      - Nom : ${nom}
      - Objectif : ${objectif}
      - Douleur : ${douleur} (${description})
      - Sommeil : ${sommeil}

      Rédige un email au format HTML pur (pas de balises <html>, juste le contenu <p>, <strong>, etc.).
      
      STRUCTURE OBLIGATOIRE :
      1. SALUTATION : "Bonjour ${nom},"
      2. ANALYSE : Analyse le lien entre sa douleur et son sommeil. Sois expert et direct.
      3. CONSEIL : Donne UN conseil technique immédiat.
      4. LE GAP : Dis que tu as créé son programme complet sur 12 semaines pour régler sa douleur.
      5. BLOQUAGE : "Je ne peux pas envoyer ce PDF sans validation de sécurité posturale."
      6. ACTION : Incite à réserver le bilan visio.
      
      Signe : "L'IA OptiForm (Powered by Gemini)".
    `;

    // 3. Appel à Google Gemini (Modèle Flash, très rapide)
    const model = genAI.getGenerativeModel({ model: "gemini-pro-lastest" });
    const result = await model.generateContent(promptSysteme);
    const emailContent = result.response.text();

    // 4. Ajout du bouton Calendly
    const calendlyLink = "https://calendly.com/ton-lien-ici"; // CHANGE CE LIEN !
    
    const htmlFinal = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        ${emailContent}
        <br><br>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${calendlyLink}" style="background-color: #e67e22; color: white; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px;">
            👉 Réserver mon Bilan de Validation (Offert)
          </a>
          <p style="font-size: 12px; color: #777; margin-top: 10px;">Attention : Créneaux limités cette semaine.</p>
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

