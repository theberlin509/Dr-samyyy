import React, { useState, useEffect } from 'react';
import { Message, Conversation } from './types';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { geminiService } from './services/geminiService';
import { Menu, Moon, Sun } from 'lucide-react';
import InstallPopup from './components/InstallPopup';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('dr_samy_theme') as 'light' | 'dark') || 'light';
  });

  // PWA States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(false);
  const [showInstallPopup, setShowInstallPopup] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                          || (window.navigator as any).standalone;
      setIsAlreadyInstalled(isStandalone);
      console.log('PWA: initial install status', { isStandalone });
    };

    checkStatus();

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      console.log('PWA: beforeinstallprompt event captured');
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      console.log('PWA: appinstalled event fired');
      setIsAlreadyInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (isAlreadyInstalled) {
      console.log('PWA: install requested but app is already installed');
      return;
    }
    if (deferredPrompt) {
      // Déclenche instantanément le dialogue système d'installation
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      // Si le prompt n'est pas prêt, afficher un popup d'aide
      setShowInstallPopup(true);
      console.log("PWA: Prompt non disponible pour le moment");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('dr_samy_chats');
    if (saved) {
      try {
        setConversations(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dr_samy_chats', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('dr_samy_theme', theme);
  }, [theme]);

  const currentChat = conversations.find(c => c.id === currentChatId);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const startNewChat = () => {
    const newId = Date.now().toString();
    setCurrentChatId(newId);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async (text: string, files?: File[]) => {
    const attachments: string[] = [];
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result?.toString().split(',')[1] || "");
          reader.readAsDataURL(file);
        });
        attachments.push(base64);
      }
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    let updatedConversations = [...conversations];
    let activeChat = updatedConversations.find(c => c.id === currentChatId);

    if (!activeChat) {
      const newChat: Conversation = {
        id: currentChatId || Date.now().toString(),
        title: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
        messages: [userMsg],
        lastUpdate: new Date().toISOString()
      };
      updatedConversations.push(newChat);
      setCurrentChatId(newChat.id);
      activeChat = newChat;
    } else {
      activeChat.messages.push(userMsg);
      activeChat.lastUpdate = new Date().toISOString();
    }

    setConversations([...updatedConversations]);
    setIsLoading(true);

    try {
      const history = activeChat.messages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));
      const aiResponse = await geminiService.generateResponse(text, history, attachments);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      activeChat.messages.push(aiMsg);
      if (activeChat.messages.length <= 3) {
        activeChat.title = await geminiService.generateTitle(text);
      }
      setConversations([...updatedConversations]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) setCurrentChatId(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        conversations={conversations}
        activeId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={startNewChat}
        onDeleteChat={deleteConversation}
        onInstall={handleInstall}
        isAlreadyInstalled={isAlreadyInstalled}
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors lg:hidden"
            >
              <Menu size={24} className="text-slate-600 dark:text-slate-300" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden">
                <img src="/logo.png" alt="Dr. Samy" className="w-full h-full object-cover" onError={(e) => {
                  (e.target as any).style.display = 'none';
                  (e.target as any).parentElement.innerHTML = '<span class="font-bold text-xs">DrS</span>';
                }} />
              </div>
              <div className="hidden sm:block leading-none">
                <h1 className="font-extrabold text-lg tracking-tight text-slate-800 dark:text-slate-100">DrSamy</h1>
                <p className="text-[9px] text-brand-500 font-bold uppercase tracking-widest">Medical Assistant</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentChat && (
              <div className="hidden lg:block max-w-[200px] xl:max-w-[400px] truncate text-sm font-medium text-slate-400">
                {currentChat.title}
              </div>
            )}
            <button 
              onClick={toggleTheme}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        <ChatWindow 
          messages={currentChat?.messages || []} 
          isLoading={isLoading} 
          onSendMessage={handleSendMessage}
        />
      </main>
      {showInstallPopup && (
        <InstallPopup onInstall={handleInstall} onClose={() => setShowInstallPopup(false)} />
      )}
    </div>
  );
};

export default App;