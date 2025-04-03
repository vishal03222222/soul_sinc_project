// import { useState, useEffect } from 'react';
// import { RelationshipProfile } from './services/relationshipService';
// import { 
//   conversationPhases, 
//   detectSafetyConcerns, 
//   handleSafetyConcern,
//   getNextPhase,
//   selectQuestion
// } from './services/aiService';
// import { analyzeSentiment } from './services/sentimentAnalysis';
// import SafetyNotice from './components/SafetyNotice';
// import SessionSummary from './components/SessionSummary';
// import './App.css';

// function App() {
//   const [contactName, setContactName] = useState('');
//   const [profile, setProfile] = useState(null);
//   const [currentPhase, setCurrentPhase] = useState('onboarding');
//   const [conversation, setConversation] = useState([]);
//   const [userInput, setUserInput] = useState('');
//   const [showSafetyNotice, setShowSafetyNotice] = useState(false);
//   const [sessionEnded, setSessionEnded] = useState(false);

//   const startNewSession = () => {
//     const newProfile = new RelationshipProfile(contactName);
//     setProfile(newProfile);
//     setCurrentPhase('onboarding');
//     setConversation([{
//       speaker: 'AI',
//       message: selectQuestion('onboarding', contactName),
//       phase: 'onboarding'
//     }]);
//     setSessionEnded(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;

//     // Add user message to conversation
//     const newConversation = [...conversation, {
//       speaker: 'User',
//       message: userInput,
//       phase: currentPhase
//     }];

//     // Check for safety concerns
//     if (detectSafetyConcerns(userInput)) {
//       setShowSafetyNotice(true);
//       setConversation(newConversation);
//       setUserInput('');
//       return;
//     }

//     // Analyze sentiment and add to profile
//     const sentiment = analyzeSentiment(userInput);
//     const updatedProfile = { ...profile };
//     updatedProfile.addMemory(
//       'user_response', 
//       userInput, 
//       1.0, 
//       conversationPhases[currentPhase].memoryTags
//     );
//     updatedProfile.sentimentScore = (
//       (updatedProfile.sentimentScore * (updatedProfile.memories.length - 1) + sentiment) / 
//       updatedProfile.memories.length
//     );
//     setProfile(updatedProfile);

//     // Determine next phase
//     const nextPhase = getNextPhase(currentPhase);
//     if (nextPhase) {
//       const nextQuestion = selectQuestion(nextPhase, contactName);
//       newConversation.push({
//         speaker: 'AI',
//         message: nextQuestion,
//         phase: nextPhase
//       });
//       setCurrentPhase(nextPhase);
//     } else {
//       // End of conversation
//       setSessionEnded(true);
//     }

//     setConversation(newConversation);
//     setUserInput('');
//   };

//   const handleEndSession = () => {
//     setSessionEnded(true);
//   };

//   return (
//     <div className="app">
//       <h1>Emotional Mapping</h1>
      
//       {!profile ? (
//         <div className="start-screen">
//           <h2>Reflect on a Relationship</h2>
//           <input
//             type="text"
//             value={contactName}
//             onChange={(e) => setContactName(e.target.value)}
//             placeholder="Who would you like to reflect on?"
//           />
//           <button onClick={startNewSession} disabled={!contactName.trim()}>
//             Start Reflection
//           </button>
//         </div>
//       ) : (
//         <div className="conversation-container">
//           <div className="conversation">
//             {conversation.map((item, index) => (
//               <div key={index} className={`message ${item.speaker.toLowerCase()}`}>
//                 <strong>{item.speaker}:</strong> {item.message}
//                 <div className="phase-tag">{item.phase}</div>
//               </div>
//             ))}
//           </div>

//           {!sessionEnded ? (
//             <form onSubmit={handleSubmit} className="input-form">
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 placeholder="Type your response..."
//               />
//               <button type="submit">Send</button>
//               <button type="button" onClick={handleEndSession} className="end-button">
//                 End Session
//               </button>
//             </form>
//           ) : (
//             <SessionSummary profile={profile} />
//           )}
//         </div>
//       )}

//       {showSafetyNotice && (
//         <SafetyNotice 
//           onContinue={() => {
//             setShowSafetyNotice(false);
//             const nextPhase = getNextPhase(currentPhase);
//             if (nextPhase) {
//               const nextQuestion = selectQuestion(nextPhase, contactName);
//               setConversation([...conversation, {
//                 speaker: 'AI',
//                 message: nextQuestion,
//                 phase: nextPhase
//               }]);
//               setCurrentPhase(nextPhase);
//             } else {
//               setSessionEnded(true);
//             }
//           }}
//           onTakeBreak={() => {
//             setShowSafetyNotice(false);
//             setSessionEnded(true);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// export default App;
import { useState } from 'react';
import { RelationshipProfile } from './services/relationshipService';
//import { conversationPhases } from './services/aiService';
import { analyzeSentiment } from './services/sentimentAnalysis';
import Conversation from './components/ConversationPhase';
import Relationship from './components/RelationshipProfile';
import './App.css';

function App() {
  const [contactName, setContactName] = useState('');
  const [profile, setProfile] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('onboarding');
  const [sessionEnded, setSessionEnded] = useState(false);

  const startNewSession = () => {
    const newProfile = new RelationshipProfile(contactName);
    setProfile(newProfile);
    setCurrentPhase('onboarding');
    setSessionEnded(false);
  };

  const handleMemoryAdded = (memoryData) => {
    if (!profile) return;
    
    const sentiment = analyzeSentiment(memoryData.content);
    const updatedProfile = profile.addMemory(
      memoryData.type,
      memoryData.content,
      memoryData.weight,
      memoryData.tags
    );
    
    // Update sentiment score (average of all memories)
    const newSentiment = (
      (updatedProfile.sentimentScore * (updatedProfile.memories.length - 1) + sentiment) / 
      updatedProfile.memories.length
    );
    
    setProfile(new RelationshipProfile(updatedProfile.contactName, {
      ...updatedProfile,
      sentimentScore: newSentiment
    }));
  };

  const handleSessionEnd = () => {
    setSessionEnded(true);
  };

  return (
    <div className="app">
      {!profile ? (
        <div className="start-screen">
          <h2>Emotional Mapping</h2>
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
      ) : sessionEnded ? (
        <Relationship 
          profile={profile} 
          onNewSession={() => {
            setProfile(null);
            setContactName('');
          }} 
        />
      ) : (
        <Conversation
          contactName={contactName}
          currentPhase={currentPhase}
          onPhaseChange={setCurrentPhase}
          onMemoryAdded={handleMemoryAdded}
          onSessionEnd={handleSessionEnd}
        />
      )}
    </div>
  );
}

export default App;