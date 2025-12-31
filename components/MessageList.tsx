
import React from 'react';
import { Message } from '../types';
import { User, BrainCircuit } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <>
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
        >
          <div className={`
            w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm border
            ${msg.role === 'user' 
              ? 'bg-blue-600 border-blue-500 text-white' 
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-blue-600'}
          `}>
            {msg.role === 'user' ? <User size={20} /> : <BrainCircuit size={20} />}
          </div>

          <div className={`flex flex-col gap-1.5 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`
              px-5 py-4 shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-[1.75rem] rounded-tr-none' 
                : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-[1.75rem] rounded-tl-none border border-slate-100 dark:border-slate-800'}
            `}>
              {msg.content}
              
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {msg.attachments.map((base64, idx) => (
                    <img 
                      key={idx} 
                      src={`data:image/jpeg;base64,${base64}`} 
                      alt="Analyse médicale" 
                      className="w-full aspect-square object-cover rounded-xl border border-white/10 dark:border-white/5 shadow-md" 
                    />
                  ))}
                </div>
              )}
            </div>
            <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest px-2">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default MessageList;
