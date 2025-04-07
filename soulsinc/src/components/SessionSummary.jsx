import React from 'react';
import './SessionSummary.css';
import { RelationshipProfile } from './RelationshipProfile';

export default function SessionSummary({ profile: profileData, onNewSession }) {
  // Ensure we have a proper class instance
  const profile = RelationshipProfile.revive(profileData);
  
  const themes = profile.getRecurringThemes();
  const communicationStyle = profile.getCommunicationStyle();

  return (
    <div className="session-summary">
      <div className="summary-header">
        <h3>Relationship Profile: {profile.contactName}</h3>
        <div className="relationship-meta">
          <span className="meta-item">
            <strong>Communication Style:</strong> {communicationStyle}
          </span>
          <span className="meta-item">
            <strong>Relationship Type:</strong> {profile.relationshipType || 'Not specified'}
          </span>
        </div>
      </div>

      <div className="summary-content">
        <div className="themes-section">
          <h4>Key Themes</h4>
          {Object.keys(themes).length > 0 ? (
            <div className="themes-container">
              {Object.entries(themes).map(([theme, count]) => (
                <div key={theme} className="theme-tag">
                  {theme} <span className="theme-count">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-themes">No specific themes emerged during this session.</p>
          )}
        </div>

        <button className="new-session-button" onClick={onNewSession}>
          Start New Reflection
        </button>
      </div>
    </div>
  );
}