export class RelationshipProfile {
  constructor(contactName, data = {}) {
    this.contactName = contactName;
    this.relationshipType = data.relationshipType || '';
    this.timeKnown = data.timeKnown || '';
    this.interactionFrequency = data.interactionFrequency || '';
    this.communicationStyle = data.communicationStyle || '';
    this.attachmentStyle = data.attachmentStyle || '';
    
    // Additional attributes
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = new Date();
    this.memories = data.memories || [];
    this.sentimentScore = data.sentimentScore || 0;
    this.depthScore = data.depthScore || 1;
    this.reciprocityRatio = data.reciprocityRatio || 1.0;
    this.emotionalVolatility = data.emotionalVolatility || "Stable";
    this.initialTone = data.initialTone || '';
  }

  /**
   * Adds a new memory and returns a new instance of RelationshipProfile.
   */
  addMemory(type, content, weight = 1.0, tags = [], context = {}) {
    const newMemory = {
      type,
      content,
      weight,
      tags,
      createdAt: new Date(),
      context
    };

    // Analyze early memories
    const newData = {
      ...this,
      memories: [...this.memories, newMemory],
      updatedAt: new Date()
    };

    // Create a new instance
    const updatedProfile = new RelationshipProfile(this.contactName, newData);

    // Run analysis on early memory
    if (type === 'history' && this.memories.length < 3) {
      updatedProfile.analyzeInitialMemory(newMemory);
    }

    return updatedProfile;
  }

  /**
   * Analyze early memories to set relationshipType and initialTone.
   */
  analyzeInitialMemory(memory) {
    const content = memory.content.toLowerCase();

    // Infer relationship type
    if (!this.relationshipType) {
      if (content.includes('friend') || content.includes('pal')) {
        this.relationshipType = 'friend';
      } else if (content.includes('partner') || content.includes('boyfriend') || content.includes('girlfriend')) {
        this.relationshipType = 'partner';
      } else if (content.includes('mother') || content.includes('father') || content.includes('parent')) {
        this.relationshipType = 'family';
      } else if (content.includes('colleague') || content.includes('coworker')) {
        this.relationshipType = 'professional';
      }
    }

    // Infer initial tone
    if (!this.initialTone) {
      if (content.includes('happy') || content.includes('joy')) {
        this.initialTone = 'positive';
      } else if (content.includes('difficult') || content.includes('hard')) {
        this.initialTone = 'challenging';
      } else {
        this.initialTone = 'neutral';
      }
    }
  }

  /**
   * Analyze the communication style from memory patterns.
   */
  analyzeCommunicationStyle() {
    const verbalPatterns = this.memories.filter(m =>
      m.content.toLowerCase().includes('talk') || 
      m.content.toLowerCase().includes('say')
    ).length;

    const actionPatterns = this.memories.filter(m =>
      m.content.toLowerCase().includes('do') || 
      m.content.toLowerCase().includes('action')
    ).length;

    this.communicationStyle = verbalPatterns > actionPatterns ? 'verbal' : 'action-oriented';
    return this.communicationStyle;
  }
}
