// src/api.js
const API_URL = 'http://localhost:8000/ask/';

export async function askQuestion(question) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.answer || "Désolé, je n'ai pas compris.";
  } catch (error) {
    console.error(error);
    return "Erreur serveur.";
  }
}
