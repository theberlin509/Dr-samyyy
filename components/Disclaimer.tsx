import React from 'react';

interface DisclaimerProps {
  onAccept: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-300 my-auto">
        <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/30 text-brand-500 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 text-center mb-4 tracking-tight">DrSamy - Assistant Médical</h2>
        
        <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 font-medium">
          <p>
            Je suis une Intelligence Artificielle conçue pour vous accompagner dans la compréhension de votre santé.
          </p>
          <div className="bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500 p-5 rounded-r-2xl shadow-sm">
            <p className="text-brand-700 dark:text-brand-400 font-extrabold mb-1 uppercase tracking-wider text-[10px]">Attention :</p>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">
              Je ne suis pas un médecin. Mes réponses sont informatives et ne constituent pas un diagnostic médical.
            </p>
          </div>
          <p>
            En cas d'urgence, contactez immédiatement le <span className="font-bold text-red-500">15</span>, le <span className="font-bold text-red-500">112</span> ou rendez-vous aux urgences.
          </p>
        </div>

        <button
          onClick={onAccept}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-brand-500/30 active:scale-95 text-base"
        >
          J'ai compris et j'accepte
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;