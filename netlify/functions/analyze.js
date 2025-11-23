const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Resend } = require("resend");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") { return { statusCode: 405, body: "Method Not Allowed" }; }

  try {
    const data = JSON.parse(event.body);
    const { nom, email, sexe, age, taille, poids, objectif, douleur, description, sommeil } = data;

    console.log(`Start Turbo Analysis: ${nom}`);

    // 1. PROMPT OPTIMISÉ (On demande juste le CŒUR de l'analyse, pas tout l'email)
    // Cela réduit le temps de génération de 50%
    const promptSysteme = `
      Tu es un expert mondial en biomécanique.
      Profil : ${nom} (${sexe}, ${age} ans, ${taille}cm/${poids}kg).
      Douleur : ${douleur} (${description}). Sommeil : ${sommeil}. Objectif : ${objectif}.

      Tâche : Rédige UNIQUEMENT le bloc central de l'analyse en HTML simple (balises <p>, <ul>, <li>, <strong>).
      Ne mets ni "Bonjour", ni signature, ni introduction. Va droit au but.

      Contenu attendu :
      1. Un paragraphe <p> d'analyse biomécanique percutante sur le lien entre sa morphologie (poids/taille), sa douleur et son sommeil. Sois technique mais clair.
      2. Une liste <ul> avec 3 <li> pour la stratégie sur 12 semaines :
         - Phase 1 (Fondation/Soulagement) adaptée à la douleur.
         - Phase 2 (Renforcement) adaptée à la biomécanique.
         - Phase 3 (Performance) adaptée à l'objectif.
    `;

    // 2. APPEL IA (Modèle Flash pour la vitesse)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(promptSysteme);
    const aiAnalysis = result.response.text(); // On récupère juste l'analyse

    // 3. CONFIGURATION
    const bookingLink = "https://zeeg.me/cyril41mangeolle/bilanstrategiques";
    const instagramLink = "https://www.instagram.com/cyril_fitlife";
    
    const demain = new Date(); demain.setDate(demain.getDate() + 1);
    const apresDemain = new Date(); apresDemain.setDate(apresDemain.getDate() + 2);

    // 4. CONSTRUCTION DE L'EMAIL (On insère l'IA dans un moule rapide)
    const htmlEmail1 = `
      <div style="font-family: Helvetica, sans-serif; color: #333; max-width: 600px; margin: 0 auto; background: #fdfdfd; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
        
        <div style="text-align: center; padding-bottom: 15px; border-bottom: 2px solid #e67e22;">
          <h2 style="color: #2b5f7f; margin: 0;">⚠️ Analyse du profil de ${nom}</h2>
          <p style="color: #666; font-size: 12px; margin-top:5px;">Rapport Stratégique IA • Confidentiel</p>
        </div>

        <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            ${aiAnalysis}
        </div>

        <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; font-size: 14px; margin-bottom: 20px;">
            <strong>✋ Bloquage de sécurité :</strong> Ceci est une ébauche stratégique. En tant qu'ostéopathe, je ne peux pas générer le PDF d'exercices sans avoir validé votre posture en visio.
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${bookingLink}" style="background-color: #e67e22; color: white; padding: 16px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 18px; display: inline-block;">
            RÉSERVER MON BILAN (OFFERT)
          </a>
          <p style="font-size: 12px; color: #999; margin-top: 10px;">*Créneaux limités cette semaine.</p>
        </div>

        <div style="text-align:center; margin-top:30px; border-top:1px solid #eee; padding-top:20px;">
           <a href="${instagramLink}" style="color:#C13584; text-decoration:none; font-weight:bold;">📸 Voir mes conseils sur Instagram</a>
        </div>
      </div>
    `;

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


    // 5. ENVOI MASSIF
    await Promise.all([
      resend.emails.send({ from: "Coach IA <onboarding@resend.dev>", to: email, subject: `⚠️ Analyse terminée : Plan pour ${nom}`, html: htmlEmail1 }),
      resend.emails.send({ from: "Cyril Mangeolle <onboarding@resend.dev>", to: email, subject: `Pensée pour votre ${douleur}...`, html: htmlEmail2, scheduled_at: demain.toISOString() }),
      resend.emails.send({ from: "Cyril Mangeolle <onboarding@resend.dev>", to: email, subject: `Fermeture dossier ${nom}`, html: htmlEmail3, scheduled_at: apresDemain.toISOString() }),
      resend.contacts.create({ email: email, first_name: nom, unsubscribed: false, audienceId: process.env.RESEND_AUDIENCE_ID })
    ]);

    return { statusCode: 200, body: JSON.stringify({ message: "Envoyé" }) };

  } catch (error) {
    console.error("Erreur:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Erreur serveur" }) };
  }
};

