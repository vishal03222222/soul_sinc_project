import React, { useState, useEffect, useRef } from 'react';
import { 
  conversationPhases, 
  detectSafetyConcerns,
  selectQuestion,
  getNextPhase
} from '../services/aiService';
import SafetyNotice from './SafetyNotice';
import './conversation.css';

export default function Conversation({ contactName, onMemoryAdded, onSessionEnd }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPhase, setCurrentPhase] = useState('onboarding');
  const [showSafetyNotice, setShowSafetyNotice] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize conversation
  useEffect(() => {
    const initialQuestion = selectQuestion('onboarding', contactName);
    setMessages([{
      id: Date.now(),
      text: initialQuestion,
      sender: 'ai',
      phase: 'onboarding',
      timestamp: new Date()
    }]);
  }, [contactName]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      phase: currentPhase,
      timestamp: new Date()
    };

    // Check for safety concerns
    if (detectSafetyConcerns(inputValue)) {
      setMessages(prev => [...prev, userMessage]);
      setShowSafetyNotice(true);
      setInputValue('');
      return;
    }

    // Add memory to profile
    onMemoryAdded({
      type: 'user_response',
      content: inputValue,
      weight: currentPhase === 'emotional_mapping' ? 1.5 : 1,
      tags: conversationPhases[currentPhase].memoryTags,
      context: {
        phase: currentPhase,
        sentiment: analyzeSentiment(inputValue)
      }
    });

    // Determine next phase
    const nextPhase = getNextPhase(currentPhase);
    if (nextPhase) {
      const nextQuestion = selectQuestion(nextPhase, contactName);
      const aiMessage = {
        id: Date.now(),
        text: nextQuestion,
        sender: 'ai',
        phase: nextPhase,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage, aiMessage]);
      setCurrentPhase(nextPhase);
    } else {
      setMessages(prev => [...prev, userMessage]);
      onSessionEnd();
    }

    setInputValue('');
  };

  return (
    <div className="conversation-interface">
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">{message.text}</div>
            <div className="message-meta">
              <span className="phase-tag">{message.phase}</span>
              <span className="timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showSafetyNotice ? (
        <SafetyNotice
          onContinue={() => {
            setShowSafetyNotice(false);
            const nextPhase = getNextPhase(currentPhase);
            const nextQuestion = selectQuestion(nextPhase, contactName);
            setMessages(prev => [...prev, {
              id: Date.now(),
              text: nextQuestion,
              sender: 'ai',
              phase: nextPhase,
              timestamp: new Date()
            }]);
            setCurrentPhase(nextPhase);
          }}
          onTakeBreak={onSessionEnd}
        />
      ) : (
        <form onSubmit={handleSubmit} className="input-area">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your response..."
            autoFocus
          />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
}

// Simple sentiment analysis - replace with your actual implementation
function analyzeSentiment(text) {
  const positive = ['happy', 'love', 'great', 'wonderful'];
  const negative = ['sad', 'angry', 'hate', 'bad'];
  
  const words = text.toLowerCase().split(/\s+/);
  const posCount = words.filter(w => positive.includes(w)).length;
  const negCount = words.filter(w => negative.includes(w)).length;
  
  if (posCount + negCount === 0) return 0;
  return (posCount - negCount) / (posCount + negCount);
}