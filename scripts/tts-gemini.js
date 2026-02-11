const fs = require('fs');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const text = process.argv[2] || "Olá Bilal! Esta é a voz do Gemini em português.";
const outputFile = process.argv[3] || '/tmp/gemini-tts-test.wav';

async function generateSpeech() {
  const requestBody = {
    contents: [{
      parts: [{ text: text }]
    }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: "Aoede"  // Uma das vozes disponíveis
          }
        }
      }
    }
  };

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`,
    timeout: 30000,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error.message));
            return;
          }
          
          const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (audioData) {
            const buffer = Buffer.from(audioData, 'base64');
            fs.writeFileSync(outputFile, buffer);
            console.log(outputFile);
            resolve(outputFile);
          } else {
            console.error('Response:', JSON.stringify(response, null, 2));
            reject(new Error('No audio data in response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

generateSpeech().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
