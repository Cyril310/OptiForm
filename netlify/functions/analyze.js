const { OpenAI } = require("openai");
const { Resend } = require("resend");

// Initialisation des outils avec les clés secrètes (qu'on configurera sur Netlify)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  // Sécurité : On accepte seulement les envois de formulaire (POST)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  try {
    // 1. Récupération des données du formulaire
    const data = JSON.parse(event.body);
    const { nom, email, objectif, douleur, sommeil, description } = data;

    console.log(`Traitement pour ${nom} - ${email}`);

    // 2. Le Prompt "Vendeur Implacable" pour l'IA
    // C'est ici que tu modifies la psychologie de vente
    const promptSysteme = `
      Tu es le Dr. IA, un expert mondial en biomécanique et coaching de haute performance.
      Tu analyses le profil d'un prospect pour lui vendre un accompagnement premium.
      
      Données du prospect :
      - Nom : ${nom}
      - Objectif : ${objectif}
      - Douleur principale : ${douleur}
      - Détails douleur : ${description}
      - Sommeil : ${sommeil}

      Rédige un email au format HTML (sans balises <html> ou <body>, juste le contenu).
      
      STRUCTURE OBLIGATOIRE DE L'EMAIL :
      1. SALUTATION : "Bonjour ${nom},"
      2. LE DIAGNOSTIC CHOC : Analyse sa douleur et son sommeil. Utilise des termes médicaux simples. Explique pourquoi il ne progressera pas s'il ne règle pas ça. Sois alarmiste mais bienveillant.
      3. LE CADEAU : Donne UN conseil très précis et actionnable immédiatement (ex: un exercice de respiration ou posture).
      4. LE GAP (VENTE) : Dis : "J'ai généré votre programme complet sur 12 semaines pour éradiquer cette douleur au ${douleur}. Il est prêt."
      5. LE BLOCAGE : "Cependant, par sécurité médicale, je ne peux pas vous envoyer le fichier PDF sans avoir validé votre posture de vive voix."
      6. L'APPEL À L'ACTION : Incite fortement à réserver le bilan visio offert via le lien ci-dessous.
      
      Ton ton doit être autoritaire, expert et empathique.
      Signe : "L'Intelligence Artificielle du Programme [Nom du Site]".
    `;

    // 3. Appel à l'IA (GPT-4 Turbo pour la qualité)
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "system", content: promptSysteme }],
    });

    const emailContent = completion.choices[0].message.content;

    // 4. Ajout du bouton Calendly dans le HTML
    // Remplace le lien ci-dessous par ton VRAI lien Calendly
    const calendlyLink = "https://calendly.com/TON-LIEN-ICI";
    
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
      from: "Coach IA <onboarding@resend.dev>", // Tu pourras configurer ton propre domaine plus tard
      to: email,
      subject: `⚠️ Analyse terminée : Votre plan d'action contre la douleur (${douleur})`,
      html: htmlFinal,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Succès ! Email envoyé." }),
    };

  } catch (error) {
    console.error("Erreur:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur interne serveur." }),
    };
  }
};
