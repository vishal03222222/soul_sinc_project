import React, { useEffect, useState } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './Relationship.css'
import { analyzeSentiment } from '../services/sentimentAnalysis'; 
Chart.register(ArcElement, Tooltip, Legend);


export default function Relationship({ profile, onNewSession }) {
  const [themes, setThemes] = useState({});
  const [sentimentTrend, setSentimentTrend] = useState([]);

  useEffect(() => {
    if (profile) {
      setThemes(profile.getRecurringThemes());
      analyzeSentimentTrend();
    }
  }, [profile]);

  const analyzeSentimentTrend = () => {
    const trend = profile.memories.map(memory => ({
      x: new Date(memory.createdAt).toLocaleDateString(),
      y: analyzeSentiment(memory.content) * 10 // Scale for visibility
    }));
    setSentimentTrend(trend);
  };

  const themeData = {
    labels: Object.keys(themes),
    datasets: [{
      data: Object.values(themes),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
      ]
    }]
  };

  return (
    <div className="relationship-profile">
      <h2>Relationship with {profile.contactName}</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Sentiment Score</h3>
          <div className="score" style={{ 
            color: profile.sentimentScore > 0 ? '#4CAF50' : '#F44336'
          }}>
            {profile.sentimentScore.toFixed(2)}
          </div>
          <small>
            {profile.sentimentScore > 0.3 ? 'Very Positive' : 
             profile.sentimentScore > 0 ? 'Positive' : 
             'Neutral/Negative'}
          </small>
        </div>

        <div className="metric-card">
          <h3>Conversation Depth</h3>
          <div className="depth-meter">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={i < profile.depthScore ? 'active' : ''}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h3>Recurring Themes</h3>
        <div className="pie-chart">
          <Pie data={themeData} />
        </div>
      </div>

      <div className="memories-section">
        <h3>Key Memories</h3>
        <ul>
          {profile.memories
            .filter(m => m.weight > 1)
            .slice(0, 5)
            .map((memory, i) => (
              <li key={i}>
                <span className="memory-type">{memory.type}</span>
                <p>{memory.content}</p>
                <small>
                  {new Date(memory.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
        </ul>
      </div>

      <button onClick={onNewSession} className="new-session-btn">
        Start New Reflection
      </button>
    </div>
  );
}