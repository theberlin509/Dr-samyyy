
import React, { useState, useEffect } from 'react';
import { Message, Conversation } from './types';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import InstallPopup from './components/InstallPopup';
import { geminiService } from './services/geminiService';
import { Stethoscope, Menu, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('dr_samy_theme') as 'light' | 'dark') || 'light';
  });

  // PWA Installation states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);

  useEffect(() => {
    // Capture the PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log('Install prompt captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Timer for 5 minutes (300,000 ms)
    const timer = setTimeout(() => {
      setShowInstallPopup(true);
    }, 300000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null);
      setShowInstallPopup(false);
    } else {
      // Fallback instructions for iOS or if prompt is missed
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert("Pour installer Dr. Samy sur votre iPhone :\n\n1. Appuyez sur le bouton 'Partager' (carré avec flèche en bas)\n2. Faites défiler et appuyez sur 'Sur l'écran d'accueil'");
      } else {
        alert("Installation impossible directement. \n\nSur Android : Cliquez sur les 3 points en haut à droite du navigateur et choisissez 'Installer l'application'.");
      }
      setShowInstallPopup(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('dr_samy_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
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
        const base64 = await fileToBase64(file);
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
        const newTitle = await geminiService.generateTitle(text);
        activeChat.title = newTitle;
      }

      setConversations([...updatedConversations]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) setCurrentChatId(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || "");
      reader.onerror = e => reject(e);
    });
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
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Stethoscope size={20} />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-base tracking-tight text-slate-800 dark:text-slate-100">Dr. Samy</h1>
                <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest leading-none">AI Medical Assistant</p>
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
        <InstallPopup 
          onInstall={handleInstall} 
          onClose={() => setShowInstallPopup(false)} 
        />
      )}
    </div>
  );
};

export default App;
