// src/App.js
import React, { useState } from 'react';
import { RelationshipProfile } from './services/relationshipService';
import Conversation from './components/ConversationPhase';
//import Relationship from './components/Relationship';
import './App.css';

function App() {
  const [contactName, setContactName] = useState('');
  const [profile, setProfile] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  const startNewSession = () => {
    // Properly instantiate with 'new'
    const newProfile = new RelationshipProfile(contactName);
    setProfile(newProfile);
    setSessionEnded(false);
  };

  const handleMemoryAdded = (memoryData) => {
    if (!profile) return;
    
    // Use the class method properly
    const updatedProfile = profile.addMemory(
      memoryData.type,
      memoryData.content,
      memoryData.weight,
      memoryData.tags
    );
    
    setProfile(updatedProfile);
  };

  const handleEndSession = () => {
    setSessionEnded(true);
  };

  const handleNewSession = () => {
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
            placeholder="Who would you like to reflect on today?"
          />
          <button 
            onClick={startNewSession} 
            disabled={!contactName.trim()}
          >
            Begin Reflection
          </button>
        </div>
      ) : sessionEnded ? (
        <RelationshipProfile 
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