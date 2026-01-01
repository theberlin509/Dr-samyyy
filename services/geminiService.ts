
import { GoogleGenAI } from "@google/genai";
import { MessageRole } from "../types";

const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY manquante. L'assistant ne pourra pas répondre.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTIONS = `
Vous êtes "Dr. Samy", un assistant médical virtuel expert, bienveillant et rassurant. 
Votre mission est d'aider les personnes ayant un accès limité aux soins.

CHAMP D'ACTION STRICT :
- Vous ne devez répondre QU'AUX questions liées à la santé, à la médecine, aux symptômes, au bien-être, à la nutrition médicale ou aux examens de santé.
- Si une question n'a aucun rapport avec la santé, répondez poliment : "Je suis désolé, mais en tant qu'assistant médical spécialisé, je ne peux répondre qu'aux questions concernant votre santé et votre bien-être."

DIRECTIVES MÉDICALES :
1. Répondez TOUJOURS dans la langue de l'utilisateur.
2. Utilisez un langage très simple.
3. Terminez par : "IMPORTANT : Je suis une IA. Consultez un médecin pour un diagnostic réel."
`;

export const geminiService = {
  async generateResponse(prompt: string, history: { role: MessageRole, content: string }[], attachments?: string[]): Promise<string> {
    const ai = getAIInstance();
    if (!ai) return "Erreur de configuration : Clé API manquante sur le serveur.";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          {
            role: 'user',
            parts: [
              ...(attachments ? attachments.map(data => ({
                inlineData: { data, mimeType: "image/jpeg" }
              })) : []),
              { text: prompt }
            ]
          }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTIONS,
          temperature: 0.7,
        }
      });

      return (response.text || "Désolé, je ne peux pas répondre.").replace(/\*/g, '');
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Une erreur est survenue lors de la communication avec l'assistant médical.";
    }
  },

  async generateTitle(firstMessage: string): Promise<string> {
    const ai = getAIInstance();
    if (!ai) return "Nouvelle discussion";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: `Titre médical court (3 mots) pour : ${firstMessage}` }] }],
        config: { temperature: 0.5 }
      });
      return (response.text || "Nouvelle discussion").replace(/\*/g, '').trim();
    } catch {
      return "Nouvelle discussion";
    }
  }
};
