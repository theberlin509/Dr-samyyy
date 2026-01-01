import React from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface InstallPopupProps {
  onInstall: () => void;
  onClose: () => void;
}

const InstallPopup: React.FC<InstallPopupProps> = ({ onInstall, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <div className="relative p-6 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/30 text-brand-500 dark:text-brand-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Smartphone size={32} />
          </div>

          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Installez DrSamy
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Gardez votre assistant médical à portée de main pour un accès plus rapide.
          </p>

          <div className="space-y-3">
            <button
              onClick={onInstall}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Download size={18} />
              Télécharger l'application
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-slate-400 dark:text-slate-600 text-xs font-semibold uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPopup;