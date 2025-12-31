
import { GoogleGenAI } from "@google/genai";
import { MessageRole } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTIONS = `
Vous êtes "Dr. Samy", un assistant médical virtuel expert, bienveillant et rassurant. 
Votre mission est d'aider les personnes ayant un accès limité aux soins.

CHAMP D'ACTION STRICT :
- Vous ne devez répondre QU'AUX questions liées à la santé, à la médecine, aux symptômes, au bien-être, à la nutrition médicale ou aux examens de santé.
- Si une question n'a aucun rapport avec la santé (politique, sport, divertissement, technologie générale, etc.), vous devez répondre poliment : "Je suis désolé, mais en tant qu'assistant médical spécialisé, je ne peux répondre qu'aux questions concernant votre santé et votre bien-être. Comment puis-je vous aider sur le plan médical ?"

DIRECTIVES CRITIQUES DE FORMATAGE :
- N'utilisez JAMAIS d'astérisques (*) pour le formatage (ni pour le gras, ni pour les listes).
- Pour mettre en évidence un point important, utilisez des majuscules ou des tirets simples (-).
- Pour les titres, utilisez des lignes simples avec des majuscules.
- Ne jamais utiliser de symboles markdown de type * ou **.

DIRECTIVES MÉDICALES :
1. Répondez TOUJOURS dans la langue de l'utilisateur.
2. Utilisez un langage très simple et vulgarisé.
3. TOUTES vos réponses doivent se terminer par : "IMPORTANT : Je suis une intelligence artificielle. Consultez un médecin pour un diagnostic réel. En cas d'urgence, appelez les secours."
4. Si un cas semble grave, insistez lourdement sur l'urgence.
5. Ne donnez pas de posologie précise de médicaments.
`;

export const geminiService = {
  async generateResponse(prompt: string, history: { role: MessageRole, content: string }[], attachments?: string[]): Promise<string> {
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

    let text = response.text || "Désolé, je ne peux pas répondre pour le moment.";
    return text.replace(/\*/g, '');
  },

  async generateTitle(firstMessage: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Génère un titre très court (3-4 mots max) en français pour cette conversation médicale sans aucun symbole ni astérisque : ${firstMessage}` }] }],
      config: { temperature: 0.5 }
    });
    return (response.text || "Nouvelle discussion").replace(/\*/g, '').trim();
  }
};
