import React, { useState } from 'react';
import { RelationshipProfile } from './services/relationshipService';
import Conversation from './components/ConversationPhase';
//import RelationshipProfile from './components/RelationshipProfile';
import './App.css';

function App() {
  const [contactName, setContactName] = useState('');
  const [profile, setProfile] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  const startNewSession = () => {
    // Create new profile instance with current contact name
    const newProfile = new RelationshipProfile(contactName);
    setProfile(newProfile);
    setSessionEnded(false);
  };

  const handleMemoryAdded = (memoryData) => {
    if (!profile) return;
    
    // Create new profile instance with updated memories
    const updatedProfile = new RelationshipProfile(profile.contactName, {
      // Copy all existing profile properties
      ...profile,
      // Add new memory to the array
      memories: [
        ...profile.memories,
        {
          type: memoryData.type,
          content: memoryData.content,
          weight: memoryData.weight,
          tags: memoryData.tags,
          createdAt: new Date()
        }
      ],
      // Update the timestamp
      updatedAt: new Date()
    });
    
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
          <h1 className="app-title">Emotional Mapping</h1>
          <p className="app-subtitle">Reflect on your important relationships</p>
          
          <div className="input-group">
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Who would you like to reflect on today?"
              className="contact-input"
            />
            <button
              onClick={startNewSession}
              disabled={!contactName.trim()}
              className="start-button"
            >
              Begin Reflection
            </button>
          </div>
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