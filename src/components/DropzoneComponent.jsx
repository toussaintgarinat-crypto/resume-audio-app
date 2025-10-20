import React from 'react';
import Dropzone from 'react-dropzone';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function DropzoneComponent({ setText }) {
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const pdf = await pdfjs.getDocument(e.target.result).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            fullText += content.items.map(item => item.str).join(' ') + '\n';
          }
          setText(fullText);
        } catch (error) {
          console.error('Erreur PDF:', error);
          alert('Erreur lors de l\'extraction du texte PDF.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setText(e.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <Dropzone onDrop={onDrop} accept={{ 'text/plain': ['.txt'], 'application/pdf': ['.pdf'] }}>
      {({ getRootProps, getInputProps }) => (
        <section style={{ border: '2px dashed #ccc', padding: '20px', margin: '10px 0' }}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Glissez-déposez un fichier TXT ou PDF ici, ou cliquez pour sélectionner.</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
}

export default DropzoneComponent;
