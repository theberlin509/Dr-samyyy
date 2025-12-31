
import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, SendHorizontal, X, Loader2 } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (text: string, files?: File[]) => void;
  isLoading: boolean;
  placeholder: string;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading, placeholder }) => {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && files.length === 0) return;
    onSendMessage(input, files);
    setInput('');
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {/* Liste des fichiers en attente */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((file, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-1"
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button 
                type="button" 
                onClick={() => removeFile(idx)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form 
        onSubmit={handleSubmit} 
        className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50"
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors flex-shrink-0"
        >
          <Paperclip size={20} />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 py-2.5 text-sm md:text-base placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none max-h-40 outline-none custom-scrollbar"
        />

        <button
          type="submit"
          disabled={isLoading || (!input.trim() && files.length === 0)}
          className={`
            p-2.5 rounded-xl transition-all flex-shrink-0 flex items-center justify-center
            ${isLoading || (!input.trim() && files.length === 0) 
              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'}
          `}
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <SendHorizontal size={22} />
          )}
        </button>
      </form>
    </div>
  );
};

export default InputArea;
