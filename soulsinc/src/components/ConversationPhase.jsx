import React, { useState, useEffect, useRef } from 'react';
import { 
  conversationPhases, 
  detectSafetyConcerns,
  selectQuestion,
  getNextPhase
} from '../services/aiService';
import SafetyNotice from './SafetyNotice';
import './conversation.css'; // We'll create this file

export default function Conversation({
  contactName,
  onMemoryAdded,
  onSessionEnd
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPhase, setCurrentPhase] = useState('onboarding');
  const [showSafetyNotice, setShowSafetyNotice] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    const initialQuestion = selectQuestion('onboarding', contactName);
    setMessages([{
      id: 1,
      text: initialQuestion,
      sender: 'ai',
      phase: 'onboarding',
      timestamp: new Date()
    }]);
  }, [contactName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
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
      tags: conversationPhases[currentPhase].memoryTags
    });

    // Determine next phase
    const nextPhase = getNextPhase(currentPhase);
    if (nextPhase) {
      const nextQuestion = selectQuestion(nextPhase, contactName);
      const aiMessage = {
        id: messages.length + 2,
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
    <div className="conversation-container">
      <div className="conversation-header">
        <h3>Reflecting on: {contactName}</h3>
        <div className="phase-indicator">
          {conversationPhases[currentPhase]?.name}
        </div>
      </div>

      <div className="messages-area">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender}`}
          >
            <div className="message-bubble">
              <div className="message-text">{message.text}</div>
              <div className="message-meta">
                <span className="message-phase">{message.phase}</span>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
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
              id: prev.length + 1,
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