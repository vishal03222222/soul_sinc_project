import { useState } from 'react';
import { 
  conversationPhases, 
  detectSafetyConcerns,
  selectQuestion,
  getNextPhase
} from '../services/aiService';
import SafetyNotice from './SafetyNotice';

export default function Conversation({
  contactName,
  currentPhase,
  onPhaseChange,
  onMemoryAdded,
  onSessionEnd
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showSafetyNotice, setShowSafetyNotice] = useState(false);

  // Initialize conversation
  useState(() => {
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

    // Add user message to UI
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

    // Add AI response or end session
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
      onPhaseChange(nextPhase);
    } else {
      setMessages(prev => [...prev, userMessage]);
      onSessionEnd();
    }

    setInputValue('');
  };

  return (
    <div className="conversation-interface">
      <div className="phase-indicator">
        Current Phase: <strong>{conversationPhases[currentPhase]?.name}</strong>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender}`}
          >
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-meta">
              <span className="phase-tag">{message.phase}</span>
              <span className="timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!showSafetyNotice ? (
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
      ) : (
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
            onPhaseChange(nextPhase);
          }}
          onTakeBreak={onSessionEnd}
        />
      )}
    </div>
  );
}