export default function SessionSummary({ profile }) {
    const themes = profile.getRecurringThemes();
    
    return (
      <div className="session-summary">
        <h3>Reflection Summary</h3>
        <p>
          Today you reflected on your relationship with <strong>{profile.contactName}</strong>.
        </p>
        
        {Object.keys(themes).length > 0 ? (
          <>
            <p>Key themes that emerged:</p>
            <ul>
              {Object.entries(themes).map(([theme, count]) => (
                <li key={theme}>
                  {theme} (mentioned {count} times)
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No specific themes emerged during this session.</p>
        )}
        
        <p>Overall sentiment: {profile.sentimentScore > 0 ? 'Positive' : 'Neutral'}</p>
        
        <button onClick={() => window.location.reload()}>
          Start New Reflection
        </button>
      </div>
    );
  }