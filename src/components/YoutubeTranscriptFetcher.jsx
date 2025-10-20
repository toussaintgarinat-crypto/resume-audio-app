import React, { useState } from 'react';
import YoutubeTranscript from 'youtube-transcript';

function YoutubeTranscriptFetcher({ setText }) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleFetchTranscript = async () => {
    if (!youtubeUrl.trim()) return;
    
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      alert('URL YouTube invalide. Utilisez un format comme https://www.youtube.com/watch?v=VIDEO_ID');
      return;
    }

    setLoading(true);
    try {
      const transcriptObj = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'fr' });
      const transcriptText = transcriptObj.map(item => item.text).join(' ');
      
      if (transcriptText.trim()) {
        setText(transcriptText);
        alert(`Transcript extrait ! (${transcriptObj.length} segments)`);
      } else {
        const enTranscript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
        const enText = enTranscript.map(item => item.text).join(' ');
        setText(enText);
        alert('Transcript en anglais extrait (pas de version FR disponible).');
      }
    } catch (error) {
      console.error('Erreur transcript:', error);
      if (error.message.includes('Transcript is disabled')) {
        alert('Cette vidéo n\'a pas de sous-titres disponibles.');
      } else if (error.message.includes('Video unavailable')) {
        alert('Vidéo non disponible ou privée.');
      } else {
        alert('Erreur lors de l\'extraction du transcript. Vérifiez l\'URL.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h3>Ou ajoutez une vidéo YouTube</h3>
      <input
        type="url"
        placeholder="Collez l'URL YouTube ici (ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        style={{ width: '70%', padding: '5px' }}
      />
      <button 
        onClick={handleFetchTranscript} 
        disabled={loading || !youtubeUrl.trim()}
        style={{ marginLeft: '10px', padding: '5px 10px' }}
      >
        {loading ? 'Extraction...' : 'Extraire Transcript'}
      </button>
    </div>
  );
}

export default YoutubeTranscriptFetcher;
