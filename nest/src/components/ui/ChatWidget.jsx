import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Compass } from 'lucide-react';
import ocbcOwl from '../../assets/images/OCBC Owl.jpg';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasInitialized, setHasInitialized] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const bubbleRef = useRef(null);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi! I am your Nest Planner. What financial goals can we plan together today? Tap a suggestion below or write your plan here!"
    }
  ]);

  const planningSuggestions = [
    "Plan for Retirement",
    "Set up a Savings Goal",
    "Compare Credit Cards",
    "Invest in Gold"
  ];

  // Resolve container ref on mount
  useEffect(() => {
    const parent = bubbleRef.current?.parentElement;
    if (parent) {
      containerRef.current = parent;
      
      const parentRect = parent.getBoundingClientRect();
      const bubbleRect = bubbleRef.current.getBoundingClientRect();
      
      // Initial position: snap to right edge with 16px padding
      const initX = parentRect.width - bubbleRect.width - 16;
      const initY = parentRect.height - bubbleRect.height - 120;
      
      setPosition({ x: initX, y: initY });
      setHasInitialized(true);
    }
  }, []);

  // Scroll to bottom when messages list changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleOpen = () => {
    if (!containerRef.current || !bubbleRef.current) return;
    
    const parentRect = containerRef.current.getBoundingClientRect();
    const bubbleRect = bubbleRef.current.getBoundingClientRect();
    
    // Save previous drag coordinates
    lastPosition.current = { x: position.x, y: position.y };
    
    // Target position: flush in the bottom-right corner, aligned with bottom-5 (20px)
    const targetX = parentRect.width - bubbleRect.width - 16;
    const targetY = parentRect.height - bubbleRect.height - 20;
    
    setPosition({ x: targetX, y: targetY });
    setIsOpen(true);
  };

  const handleClose = () => {
    // Restore the bubble back to its last snap coordinate before it was opened
    setPosition({ x: lastPosition.current.x, y: lastPosition.current.y });
    setIsOpen(false);
  };

  const handleDragEnd = (event, info) => {
    if (!containerRef.current || !bubbleRef.current) return;
    
    const parentRect = containerRef.current.getBoundingClientRect();
    const bubbleRect = bubbleRef.current.getBoundingClientRect();
    
    const paddingX = 16;
    const paddingY = 16;
    
    // Find current horizontal position and snap to closest vertical side edge
    const bubbleCenterX = bubbleRect.left + bubbleRect.width / 2;
    const parentCenterX = parentRect.left + parentRect.width / 2;
    
    let targetX = 0;
    if (bubbleCenterX < parentCenterX) {
      targetX = paddingX; // snap to left edge
    } else {
      targetX = parentRect.width - bubbleRect.width - paddingX; // snap to right edge
    }
    
    // Compute current Y relative to the parent container
    let targetY = bubbleRect.top - parentRect.top;
    
    // Ensure Y bounds are respected
    const minY = paddingY;
    const maxY = parentRect.height - bubbleRect.height - paddingY;
    if (targetY < minY) targetY = minY;
    if (targetY > maxY) targetY = maxY;
    
    setPosition({ x: targetX, y: targetY });

    // Set to false in the next tick to prevent drag release from triggering tap/click
    setTimeout(() => {
      isDragging.current = false;
    }, 100);
  };

  const handleTap = () => {
    if (isDragging.current) return;
    
    if (isOpen) {
      if (inputText.trim()) {
        handleSend();
      } else {
        handleClose();
      }
    } else {
      handleOpen();
    }
  };

  const handleSend = (textToSend = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;
    
    // Add user message to conversation list
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: trimmed }
    ]);
    
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Cinematic Blur Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30 cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="absolute top-20 bottom-4 left-4 right-20 bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="h-14 px-4 bg-white border-b border-zinc-200/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full border border-brand-primary overflow-hidden bg-white shrink-0">
                  <img src={ocbcOwl} alt="Mascot" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-zinc-900 leading-tight">Nest Planner</h3>
                  <span className="text-[10px] font-semibold text-zinc-400">Personal Wealth Advisory</span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-700 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Scrollable Message Box */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-primary text-white font-medium rounded-tr-none shadow-md shadow-brand-primary/10'
                        : 'bg-white text-zinc-800 font-medium rounded-tl-none border border-zinc-200/40 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Pills Container */}
            <div className="px-4 py-3 border-t border-zinc-200/40 bg-zinc-50/50 shrink-0">
              <div className="flex items-center gap-1.5 mb-2">
                <Compass className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Plan suggestions based on your portfolio</span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {planningSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="flex-shrink-0 bg-white hover:bg-zinc-50 border border-zinc-200/60 shadow-sm text-zinc-700 font-bold px-3.5 py-2 rounded-full text-[10px] transition-colors cursor-pointer active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="px-4 pb-5 pt-3 bg-white/95 border-t border-zinc-200/50 flex items-center gap-3 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="How can we plan for you today?"
                className="flex-1 h-10 px-3.5 bg-zinc-100 border border-zinc-200/50 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary placeholder-zinc-400 transition-all duration-150"
              />
              <div className="w-14 h-10 shrink-0" /> {/* Spacer to avoid overlap with bubble Send button */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Mascot Bubble */}
      <motion.div
        ref={bubbleRef}
        drag={!isOpen}
        dragConstraints={containerRef}
        dragElastic={0.12}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        animate={hasInitialized ? { x: position.x, y: position.y } : undefined}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          touchAction: 'none'
        }}
        whileHover={!isOpen || inputText.trim() ? { scale: 1.05 } : { scale: 1 }}
        whileTap={!isOpen || inputText.trim() ? { scale: 0.95 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className={`w-14 h-14 rounded-full border-2 border-brand-primary bg-white shadow-xl flex items-center justify-center overflow-hidden select-none z-50 ${
          isOpen 
            ? 'pointer-events-auto cursor-pointer shadow-md' 
            : 'pointer-events-auto cursor-grab active:cursor-grabbing'
        }`}
      >
        <img
          src={ocbcOwl}
          alt="OCBC Owl Mascot"
          className="w-full h-full object-cover select-none pointer-events-none"
        />
        
        {/* Send Action Overlay when user is typing */}
        <AnimatePresence>
          {isOpen && inputText.trim() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-brand-primary flex items-center justify-center text-white"
            >
              <Send className="w-5 h-5 stroke-[2.5]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ChatWidget;
