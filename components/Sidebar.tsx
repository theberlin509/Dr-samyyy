
import React from 'react';
import { Conversation } from '../types';
import { Plus, MessageSquare, Trash2, ShieldCheck, Download } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onInstall: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, onClose, conversations, activeId, onSelectChat, onNewChat, onDeleteChat, onInstall 
}) => {
  const sortedChats = [...conversations].sort((a, b) => 
    new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-20 lg:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 border-r dark:border-slate-800 z-30 transform transition-all duration-300 ease-in-out flex flex-col
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-5">
          <button
            onClick={onNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus size={20} />
            Nouveau Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1.5 custom-scrollbar">
          <div className="px-4 py-2">
             <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">Historique</h3>
          </div>
          
          {sortedChats.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-600 italic">Aucun historique local.</p>
            </div>
          ) : (
            sortedChats.map((chat) => (
              <div 
                key={chat.id}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer ${
                  activeId === chat.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/50' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                }`}
                onClick={() => { onSelectChat(chat.id); onClose(); }}
              >
                <MessageSquare size={18} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate leading-tight">
                    {chat.title}
                  </p>
                  <p className="text-[10px] opacity-60 mt-0.5">
                    {new Date(chat.lastUpdate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t dark:border-slate-800 space-y-3">
          <button
            onClick={() => { onInstall(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold text-sm border border-blue-100 dark:border-blue-900/50"
          >
            <Download size={18} />
            Installer l'application
          </button>
          
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <ShieldCheck size={18} className="text-emerald-500" />
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
              Données privées chiffrées localement dans votre navigateur.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
