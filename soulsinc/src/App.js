import React, { useState, useEffect } from 'react';
import { RelationshipProfile } from './services/relationshipService';
import Conversation from './components/ConversationPhase';
import SessionSummary from './components/SessionSummary';
import './App.css';

function App() {
  const [contactName, setContactName] = useState('');
  const [profile, setProfile] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  // Load from localStorage if available
  useEffect(() => {
    const savedProfile = localStorage.getItem('relationshipProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(RelationshipProfile.revive(parsed));
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
  }, []);

  const startNewSession = () => {
    // Proper class instantiation
    const newProfile = new RelationshipProfile(contactName);
    setProfile(newProfile);
    setSessionEnded(false);
  };

 // In your handleMemoryAdded function
const handleMemoryAdded = (memoryData) => {
  if (!profile) return;
  
  // This will return a proper RelationshipProfile instance
  const updatedProfile = profile.addMemory(
    memoryData.type,
    memoryData.content,
    memoryData.weight,
    memoryData.tags,
    memoryData.context
  );

  // Ensure we're storing the proper instance
  setProfile(updatedProfile);
  
  // If using localStorage:
  localStorage.setItem('relationshipProfile', JSON.stringify(updatedProfile));
};

  const handleEndSession = () => {
    setSessionEnded(true);
  };

  const handleNewSession = () => {
    localStorage.removeItem('relationshipProfile');
    setProfile(null);
    setContactName('');
    setSessionEnded(false);
  };

  return (
    <div className="app-container">
      {!profile ? (
        <div className="start-screen">
          <h1>Emotional Mapping</h1>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Who would you like to reflect on?"
          />
          <button 
            onClick={startNewSession} 
            disabled={!contactName.trim()}
          >
            Begin Reflection
          </button>
        </div>
      ) : sessionEnded ? (
        <SessionSummary 
          profile={profile} 
          onNewSession={handleNewSession} 
        />
      ) : (
        <Conversation
          contactName={contactName}
          onMemoryAdded={handleMemoryAdded}
          onSessionEnd={handleEndSession}
        />
      )}
    </div>
  );
}

export default App;