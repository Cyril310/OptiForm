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
    // On ajoute 'sexe' ici pour le récupérer
    const { nom, email, sexe, age, taille,poids, objectif, douleur, description, sommeil } = data;

    console.log(`Traitement Gemini pour ${nom} (${sexe}),${poids}`);

    // 1. PROMPT MODIFIÉ (Intégration du sexe)
       // 1. PROMPT OPTIMISÉ (Expertise Biomécanique)
    const promptSysteme = `
      Tu es un expert mondial en biomécanique et ostéopathie.
      Ton objectif : Rédiger UNIQUEMENT le corps de l'analyse stratégique pour ${nom}.
      
      PROFIL DU PROSPECT :
      - ${nom} (${sexe}, ${age} ans).
      - Morphologie : ${taille}cm pour ${poids}kg.
      - Objectif : ${objectif}.
      - Problème majeur : ${douleur} (${description}).
      - Sommeil : ${sommeil}.

      CONSIGNE DE RÉDACTION :
      Ne rédige PAS l'introduction ("Bonjour..."), ni la conclusion, ni la signature. Concentre-toi sur l'expertise technique.
      Utilise un format HTML simple (balises <p>, <ul>, <li>, <strong>).

      CONTENU ATTENDU (Dans cet ordre précis) :
      
      1. <p><strong>Analyse Clinique Rapide :</strong></p>
         Explique le lien mécanique et physiologique entre sa douleur (${douleur}), son sommeil et sa morphologie (${poids}kg/${taille}cm). Utilise un vocabulaire expert mais compréhensible (ex: inflammation systémique, charge articulaire, cortisol).
      
      2. <p><strong>Votre Stratégie en 3 Phases :</strong></p>
         <ul>
           <li><strong>Phase 1 (Soulagement) :</strong> Propose une action spécifique liée à sa douleur pour décompresser la zone.</li>
           <li><strong>Phase 2 (Structure) :</strong> Explique quel type de renforcement est nécessaire pour sa morphologie.</li>
           <li><strong>Phase 3 (Performance) :</strong> Comment atteindre l'objectif "${objectif}" une fois le corps réparé.</li>
         </ul>

      3. <p><strong>Point de Vigilance :</strong></p>
         Une phrase d'avertissement sur les risques de suivre un programme générique sans validation de sa posture.
    `;

    // 2. Appel IA
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(promptSysteme);
    const emailContent = result.response.text();

        // --- 1. CALCUL DES DATES (Séquence J+1 et J+2) ---
    const demain = new Date();
    demain.setDate(demain.getDate() + 1);
    
    const apresDemain = new Date();
    apresDemain.setDate(apresDemain.getDate() + 2);

    // --- 2. LIENS ---
    const bookingLink = "https://zeeg.me/cyril41mangeolle/bilanstrategiques";
    const instagramLink = "https://www.instagram.com/cyril_fitlife";

    // --- 3. CONTENU DES 3 EMAILS ---

       // EMAIL 1 : L'Analyse IA (Immédiat)
    const htmlEmail1 = `
      <div style="font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #eee;">
        
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">
          <h2 style="color: #2b5f7f; margin: 0;">Rapport Stratégique IA 🤖</h2>
          <p style="color: #666; font-size: 12px;">Dossier Réf: #OPT-${Date.now().toString().slice(-4)}</p>
        </div>

        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            
            <p style="margin-top: 0;"><strong>Bonjour ${nom},</strong></p>
            
            ${emailContent}

            <p style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; font-style: italic; color: #555; font-size: 14px;">
                L'IA OptiForm (Supervisée par Cyril Mangeolle)
            </p>
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


        // EMAIL 2 : Le Suivi Humain + Preuve Sociale (J+1)
    const htmlEmail2 = `
      <div style="font-family: Helvetica, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <p>Bonjour ${nom},</p>
        <p>C'est Cyril.</p>
        <p>Je repensais à votre dossier ce matin. L'analyse IA a confirmé une chose importante sur votre <strong>${douleur}</strong> : ce n'est pas une fatalité, c'est un signal mécanique.</p>
        <p>Beaucoup de mes clients attendent que "ça passe". Le problème, c'est que sans correction, le corps compense... et crée d'autres douleurs ailleurs.</p>
        
        <div style="background-color: #f0f4f8; border-left: 4px solid #2b5f7f; padding: 15px; margin: 20px 0;">
            <p style="margin:0; font-style:italic;">"Le meilleur moment pour agir, c'était avant la douleur. Le deuxième meilleur moment, c'est maintenant."</p>
        </div>

        <p><strong>Je vous ai gardé un créneau prioritaire cette semaine :</strong></p>
        <p>
            <a href="${bookingLink}" style="color: #e67e22; font-weight: bold; text-decoration: underline;">👉 Accéder à mon agenda privé (Bilan Offert)</a>
        </p>
        
        <p>À très vite,</p>
        <p><strong>Cyril Mangeolle</strong><br>Ostéopathe & Coach</p>

        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 13px; color: #666;">
            <p>P.S. En attendant, je publie quotidiennement des conseils sur la biomécanique ici :<br>
            <a href="${instagramLink}" style="color: #C13584; text-decoration: none; font-weight: bold;">📸 Voir mon Instagram (@cyril_fitlife)</a></p>
        </div>
      </div>
    `;

    // EMAIL 3 : La Dernière Chance / Urgence (J+2)
    const htmlEmail3 = `
      <div style="font-family: Helvetica, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <p>${nom},</p>
        <p>Je boucle mon planning pour la semaine à venir.</p>
        <p>Je garde votre analyse biomécanique ouverte encore <strong>24 heures</strong>. Passé ce délai, je devrai archiver le dossier et libérer votre créneau de bilan offert pour une personne sur liste d'attente.</p>
        
        <p>Vous avez deux options :</p>
        <ol>
            <li>Ignorer ce message et continuer avec votre douleur/gêne actuelle.</li>
            <li>Prendre 15 minutes pour valider une stratégie qui peut changer votre quotidien.</li>
        </ol>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${bookingLink}" style="background-color: #e67e22; color: white; padding: 14px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px; display: inline-block;">
            DERNIER RAPPEL : VALIDER MON PLAN
          </a>
        </div>

        <p>C'est le moment de passer à l'action.</p>
        <p>Cyril.</p>

        <div style="margin-top: 40px; font-size: 12px; text-align: center; color: #999;">
            <p>Pas prêt maintenant ? Suivez-moi sur <a href="${instagramLink}" style="color: #666; text-decoration: underline;">Instagram</a> pour des conseils gratuits.</p>
        </div>
      </div>
    `;


    // --- 4. ENVOI GROUPÉ (Resend) ---
    await Promise.all([
      
      // Email 1 : Immédiat
      resend.emails.send({
        from: "Coach IA <onboarding@resend.dev>",
        to: email,
        subject: `⚠️ Analyse terminée : Votre Stratégie pour ${nom}`,
        html: htmlEmail1,
      }),

      // Email 2 : Demain
      resend.emails.send({
        from: "Cyril Mangeolle <onboarding@resend.dev>",
        to: email,
        subject: `Une pensée concernant votre ${douleur}...`,
        html: htmlEmail2,
        scheduled_at: demain.toISOString(),
      }),

      // Email 3 : Après-demain
      resend.emails.send({
        from: "Cyril Mangeolle <onboarding@resend.dev>",
        to: email,
        subject: `Fermeture de votre dossier ${nom}`,
        html: htmlEmail3,
        scheduled_at: apresDemain.toISOString(),
      }),

      // SAUVEGARDE DU CONTACT (NEWSLETTER)
      // Note : Il n'y a pas de fermeture "]);" avant cette partie, juste une virgule implicite
      resend.contacts.create({
        email: email,
        first_name: nom,
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID
      })
    ]); // <--- C'est ICI qu'on ferme tout le bloc, une seule fois.

    return { statusCode: 200, body: JSON.stringify({ message: "Tout est envoyé !" }) };

  } catch (error) {
    console.error("Erreur:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
