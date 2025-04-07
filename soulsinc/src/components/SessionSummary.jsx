export default function SessionSummary({ profile, onNewSession }) {
  // Calculate additional metrics
  const themes = profile.getRecurringThemes();
  const communicationStyle = profile.analyzeCommunicationStyle();
  
  return (
      <div className="session-summary">
          <div className="summary-header">
              <h3>Relationship Profile: {profile.contactName}</h3>
              <div className="relationship-meta">
                  <span className="meta-item">
                      <strong>Type:</strong> {profile.relationshipType || 'Not specified'}
                  </span>
                  <span className="meta-item">
                      <strong>Known for:</strong> {profile.timeKnown || 'Not specified'}
                  </span>
                  <span className="meta-item">
                      <strong>Interaction:</strong> {profile.interactionFrequency || 'Not specified'}
                  </span>
                  <span className="meta-item">
                      <strong>Communication:</strong> {communicationStyle}
                  </span>
              </div>
          </div>

          <div className="summary-sections">
              <div className="summary-section">
                  <h4>Initial Impressions</h4>
                  <p>
                      Your early memories with {profile.contactName} were predominantly{' '}
                      <span className="highlight">{profile.initialTone || 'neutral'}</span> in tone.
                  </p>
              </div>

              <div className="summary-section">
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
                      <p>No specific themes emerged during this session.</p>
                  )}
              </div>

              <div className="summary-section">
                  <h4>Relationship Dynamics</h4>
                  <div className="dynamics-grid">
                      <div className="dynamic-item">
                          <h5>Reciprocity</h5>
                          <div className="dynamic-value">
                              {profile.reciprocityRatio > 1.2 ? 'You give more' :
                               profile.reciprocityRatio < 0.8 ? 'They give more' : 'Balanced'}
                          </div>
                      </div>
                      <div className="dynamic-item">
                          <h5>Emotional Pattern</h5>
                          <div className="dynamic-value">
                              {profile.emotionalVolatility}
                          </div>
                      </div>
                      <div className="dynamic-item">
                          <h5>Depth Level</h5>
                          <div className="dynamic-value">
                              {profile.depthScore}/5
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <button className="new-session-button" onClick={onNewSession}>
              Start New Reflection
          </button>
      </div>
  );
}