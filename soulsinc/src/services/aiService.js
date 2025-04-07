export const conversationPhases = {
    onboarding: {
      name: "Onboarding & History",
      description: "Set context and break the ice with light, open-ended questions",
      starterQuestions: [
        "How did you and {contactName} meet?",
        "How long have you known {contactName}?",
        "What type of relationship do you have with {contactName}?",
        "How often do you typically interact with {contactName}?"
      ],
      objectives: ["history", "frequency", "shared_topics"],
      memoryTags: ["history", "type", "frequency"],
    },
    emotionalMapping: {
      name: "Emotional Mapping",
      description: "Explore feelings, memories, and emotional depth",
      starterQuestions: [
        "What do you love or appreciate most about {contactName}?",
        "What role do they play in your life?",
        "How do you feel after talking to them?",
        "Have they been there for you during hard times?"
      ],
      objectives: ["sentiment", "emotional_reciprocity", "support_roles"],
      memoryTags: ["appreciation", "emotion", "support"]
    },
    // Add other phases similarly
  };
  
  const safetyKeywords = ["unsafe", "yelled", "cheated", "depressed", "hurt myself"];
  
  export function detectSafetyConcerns(text) {
    return safetyKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }
  
  export function handleSafetyConcern() {
    return "That sounds like something really serious. Would you prefer to continue reflecting or take a break from this topic?";
  }
  
  export function getNextPhase(currentPhase) {
    const phaseKeys = Object.keys(conversationPhases);
    const currentIndex = phaseKeys.indexOf(currentPhase);
    return phaseKeys[currentIndex + 1] || null;
  }
  
  export function selectQuestion(phase, contactName) {
    const phaseData = conversationPhases[phase];
    if (!phaseData) return null;
    return phaseData.starterQuestions[0].replace("{contactName}", contactName);
  }