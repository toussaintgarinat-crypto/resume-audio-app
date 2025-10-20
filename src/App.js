import React, { useState, useEffect } from 'react';
import DropzoneComponent from './components/DropzoneComponent';
import YoutubeTranscriptFetcher from './components/YoutubeTranscriptFetcher';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialisation Google API
  useEffect(() => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.file',
      }).then(() => {
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(setIsSignedIn);
        setIsSignedIn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      }).catch(err => console.error('Erreur Google API:', err));
    });
  }, []);

  const handleSignIn = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  };

  const generateSummary = async (inputText) => {
    if (!inputText.trim()) {
      alert('Aucun texte à résumer.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: inputText.slice(0, 1024), max_length: 130, min_length: 30 }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      const sum = data[0].summary_text;
      setSummary(sum);
      generateAudio(sum);
    } catch (error) {
      console.error('Erreur summarisation:', error);
      alert('Erreur lors de la génération du résumé.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAudio = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    synth.speak(utterance);
    // Placeholder pour URL audio (Web Speech API ne génère pas de MP3 direct)
    setAudioUrl(URL.createObjectURL(new Blob([text], { type: 'text/plain' })));
  };

  const saveToDrive = async (content, fileName, mimeType = 'text/plain') => {
    if (!isSignedIn) {
      alert('Veuillez vous connecter à Google Drive.');
      return;
    }
    try {
      const file = new Blob([content], { type: mimeType });
      const metadata = { name: fileName, mimeType };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const accessToken = window.gapi.auth.getToken().access_token;
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
        body: form,
      });
      const data = await response.json();
      if (data.id) alert(`Fichier ${fileName} sauvegardé sur Google Drive !`);
    } catch (error) {
      console.error('Erreur Drive:', error);
      alert('Erreur lors de la sauvegarde.');
    }
  };

  return (
    <div className="App">
      <h1>Résumeur Audio</h1>
      <p>Inspirez-vous de NotebookLM : glissez un fichier, entrez du texte, ou ajoutez une vidéo YouTube pour un résumé audio !</p>
      
      {!isSignedIn && <button onClick={handleSignIn}>Se connecter à Google Drive</button>}
      
      <DropzoneComponent setText={setText} />
      
      <YoutubeTranscriptFetcher setText={setText} />
      
      <textarea
        placeholder="Ou collez du texte ici..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        style={{ width: '100%', margin: '10px 0' }}
      />
      
      <button 
        onClick={() => generateSummary(text)} 
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? 'Génération...' : 'Générer Résumé Audio'}
      </button>
      
      {summary && (
        <div style={{ margin: '20px 0' }}>
          <p><strong>Résumé :</strong> {summary}</p>
          <button onClick={() => saveToDrive(summary, `resume_${Date.now()}.txt`)}>
            Sauvegarder Résumé sur Drive
          </button>
        </div>
      )}
      
      {audioUrl && (
        <div style={{ margin: '20px 0' }}>
          <audio controls src={audioUrl} />
          <button onClick={() => saveToDrive(summary, `resume_audio_${Date.now()}.txt`, 'text/plain')}>
            Sauvegarder Audio (Texte pour démo)
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
