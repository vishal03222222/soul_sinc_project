export default function SafetyNotice({ onContinue, onTakeBreak }) {
    return (
      <div className="safety-notice">
        <div className="safety-content">
          <h3>Important Notice</h3>
          <p>
            That sounds like something really serious. While I can help you reflect, 
            I'm not equipped to offer emergency help. Connecting with a therapist 
            or support line could make a real difference.
          </p>
          <div className="safety-buttons">
            <button onClick={onContinue}>Continue Reflection</button>
            <button onClick={onTakeBreak}>Take a Break</button>
          </div>
        </div>
      </div>
    );
  }