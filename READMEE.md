Résumeur Audio
Une application React inspirée de NotebookLM pour générer des résumés audio à partir de fichiers texte, PDFs ou vidéos YouTube, avec sauvegarde sur Google Drive.
Fonctionnalités

Drag-and-Drop : Chargez des fichiers TXT ou PDF.
YouTube Transcripts : Extrayez les sous-titres de vidéos YouTube (français ou anglais).
Résumé : Générez un résumé court via l'API Hugging Face (BART).
Audio : Convertissez le résumé en audio avec Web Speech API.
Google Drive : Sauvegardez les résumés (et audio, en texte pour la démo) sur Drive.

Prérequis

Node.js 18+
Compte Google Cloud avec Drive API activée (Client ID)
Token Hugging Face pour l'API (gratuit sur huggingface.co)

Installation

Clonez le repo :git clone <votre-repo-url>
cd resume-audio-app


Installez les dépendances :npm install


Créez un fichier .env à partir de .env.example :cp .env.example .env

Ajoutez votre REACT_APP_GOOGLE_CLIENT_ID et REACT_APP_HF_TOKEN.
Lancez l'app :npm start



Utilisation

Connectez-vous à Google Drive via le bouton.
Glissez un fichier TXT/PDF, entrez du texte, ou collez une URL YouTube.
Cliquez sur "Générer Résumé Audio".
Écoutez le résumé et sauvegardez-le sur Drive.

Déploiement

Vercel/Netlify : Déployez facilement.
Configurez les variables d'environnement dans la plateforme.
Ajoutez votre domaine (ex. https://votre-app.vercel.app) aux redirect URIs dans Google Cloud Console.

Limites

L'audio est généré via Web Speech API (pas de MP3 direct). Pour MP3, ajoutez un backend (ex. Node.js + gTTS).
YouTube : Les vidéos doivent avoir des sous-titres activés.
API Hugging Face : Gratuite mais avec limites (créez un token).

Améliorations futures

Backend pour générer des fichiers MP3.
Support multi-langues pour les transcripts.
Style "podcast" avec plusieurs voix via ElevenLabs.

Contribuer
Ouvrez une issue ou PR sur GitHub !
