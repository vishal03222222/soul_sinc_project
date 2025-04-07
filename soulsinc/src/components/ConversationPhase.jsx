// src/components/Conversation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { conversationPhases, detectSafetyConcerns, selectQuestion, getNextPhase } from '../services/aiService';
import SafetyNotice from './SafetyNotice';
import './conversation.css'

export default function Conversation({ contactName, onMemoryAdded, onSessionEnd }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPhase, setCurrentPhase] = useState('onboarding');
  const [showSafetyNotice, setShowSafetyNotice] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      phase: currentPhase,
      timestamp: new Date()
    };

    if (detectSafetyConcerns(inputValue)) {
      setMessages(prev => [...prev, userMessage]);
      setShowSafetyNotice(true);
      setInputValue('');
      return;
    }

    onMemoryAdded({
      type: 'user_response',
      content: inputValue,
      weight: currentPhase === 'emotional_mapping' ? 1.5 : 1,
      tags: conversationPhases[currentPhase].memoryTags
    });

    const nextPhase = getNextPhase(currentPhase);
    if (nextPhase) {
      const nextQuestion = selectQuestion(nextPhase, contactName);
      setMessages(prev => [...prev, userMessage, {
        id: prev.length + 2,
        text: nextQuestion,
        sender: 'ai',
        phase: nextPhase,
        timestamp: new Date()
      }]);
      setCurrentPhase(nextPhase);
    } else {
      setMessages(prev => [...prev, userMessage]);
      onSessionEnd();
    }

    setInputValue('');
  };

  return (
    <div className="conversation-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">{message.text}</div>
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
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your response..."
          />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
}