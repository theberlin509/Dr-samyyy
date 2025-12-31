
import React from 'react';

interface DisclaimerProps {
  onAccept: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-4">Avertissement Médical</h2>
        
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed mb-8">
          <p>
            Bienvenue sur <strong>Dr. Samy</strong>. Je suis un assistant intelligent conçu pour vous aider à mieux comprendre votre santé.
          </p>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-red-800 font-semibold mb-1 uppercase tracking-tight text-[10px]">Important :</p>
            <p className="text-red-700">
              Je ne suis pas un médecin. Mes analyses ne remplacent pas une consultation, un diagnostic ou un traitement médical professionnel.
            </p>
          </div>
          <p>
            En cas d'urgence, contactez immédiatement les services de secours de votre région.
          </p>
          <p className="text-xs text-slate-400 italic">
            En continuant, vous reconnaissez que cette application est fournie à titre informatif uniquement.
          </p>
        </div>

        <button
          onClick={onAccept}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
        >
          J'ai compris et j'accepte
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;
