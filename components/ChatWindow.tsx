
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { UserCircle2, BrainCircuit } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, files?: File[]) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-slate-950">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 md:px-12 lg:px-24 space-y-8 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-lg mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex items-center justify-center text-blue-600 shadow-xl">
                <BrainCircuit size={48} />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Bonjour, Dr. Samy à votre écoute</h2>
              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-medium">
                Je peux analyser vos symptômes, interpréter des examens biologiques ou répondre à vos questions médicales de manière simple.
              </p>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
        
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex-shrink-0 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-sm text-blue-600">
               <BrainCircuit size={18} />
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-[2rem] rounded-tl-none border border-slate-100 dark:border-slate-800 w-fit max-w-[80%]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <InputArea onSendMessage={onSendMessage} isLoading={isLoading} placeholder="Posez votre question médicale..." />
          <p className="text-[10px] text-center text-slate-400 dark:text-slate-600 mt-4 font-bold uppercase tracking-[0.15em]">
            L'IA ne remplace pas une consultation médicale réelle
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
