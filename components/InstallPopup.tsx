import React from 'react';
import { Download, X, Smartphone, CheckCircle } from 'lucide-react';

interface InstallPopupProps {
  onInstall: () => void;
  onClose: () => void;
}

const InstallPopup: React.FC<InstallPopupProps> = ({ onInstall, onClose }) => {
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

  const Instructions: React.FC = () => {
    if (isIOS && isSafari) {
      return (
        <div className="text-xs text-slate-500 dark:text-slate-400 text-left space-y-1">
          <p className="font-semibold">Sur iPhone/iPad (Safari):</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Appuyez sur l\u2019ic\u00f4ne Partager (carr\u00e9 avec fl\u00e8che).</li>
            <li>S\u00e9lectionnez \"Ajouter \u00e0 l\u2019\u00e9cran d\u2019accueil\".</li>
            <li>Validez pour installer.</li>
          </ol>
        </div>
      );
    }
    if (isAndroid) {
      return (
        <div className="text-xs text-slate-500 dark:text-slate-400 text-left space-y-1">
          <p className="font-semibold">Sur Android (Chrome):</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Ouvrez le menu (\u22ee) en haut \u00e0 droite.</li>
            <li>Choisissez \"Ajouter \u00e0 l\u2019\u00e9cran d\u2019accueil\".</li>
            <li>Confirmez l\u2019installation.</li>
          </ol>
        </div>
      );
    }
    return (
      <div className="text-xs text-slate-500 dark:text-slate-400 text-left">
        <p>Sur ordinateur, utilisez l\u2019ic\u00f4ne d\u2019installation dans la barre d\u2019adresse ou le menu du navigateur \"Installer l\u2019application\".</p>
      </div>
    );
  };
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
            Gardez votre assistant m\u00e9dical \u00e0 port\u00e9e de main pour un acc\u00e8s plus rapide.
          </p>

          <div className="mb-4">
            <Instructions />
          </div>

          <div className="space-y-3">
            <button
              onClick={onInstall}
              disabled={isStandalone}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 active:scale-95"
            >
              {isStandalone ? <CheckCircle size={18} /> : <Download size={18} />}
              {isStandalone ? "Application d\u00e9j\u00e0 install\u00e9e" : "T\u00e9l\u00e9charger l'application"}
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