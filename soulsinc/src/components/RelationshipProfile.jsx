export class RelationshipProfile {
  constructor(contactName, data = {}) {
    // Core properties
    this.contactName = contactName || data.contactName || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = new Date();
    this.memories = data.memories || [];

    // Relationship metadata
    this.relationshipType = data.relationshipType || '';
    this.timeKnown = data.timeKnown || '';
    this.interactionFrequency = data.interactionFrequency || '';
    this.communicationStyle = data.communicationStyle || '';
    this.attachmentStyle = data.attachmentStyle || '';
    this.initialTone = data.initialTone || '';

    // Analytics
    this.sentimentScore = data.sentimentScore || 0;
    this.depthScore = data.depthScore || 1;
    this.reciprocityRatio = data.reciprocityRatio || 1.0;
    this.emotionalVolatility = data.emotionalVolatility || "Stable";
  }

  // Safe deserialization method
  static revive(data) {
    if (data instanceof RelationshipProfile) return data;
    return new RelationshipProfile(data.contactName, {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      memories: data.memories?.map(m => ({
        ...m,
        createdAt: new Date(m.createdAt)
      })) || []
    });
  }

  // Communication style analysis
  getCommunicationStyle() {
    if (this.communicationStyle) return this.communicationStyle;
    
    const verbalPatterns = this.memories.filter(m => 
      m.content.toLowerCase().includes('talk') || 
      m.content.toLowerCase().includes('say') ||
      m.content.toLowerCase().includes('tell')
    ).length;
    
    const actionPatterns = this.memories.filter(m => 
      m.content.toLowerCase().includes('do') || 
      m.content.toLowerCase().includes('action') ||
      m.content.toLowerCase().includes('show')
    ).length;
    
    this.communicationStyle = verbalPatterns > actionPatterns ? 'verbal' : 'action-oriented';
    return this.communicationStyle;
  }

  // Memory management
  addMemory(type, content, weight = 1.0, tags = [], context = {}) {
    const newMemory = {
      type,
      content,
      weight,
      tags,
      context,
      createdAt: new Date()
    };

    return new RelationshipProfile(this.contactName, {
      ...this,
      memories: [...this.memories, newMemory],
      updatedAt: new Date()
    });
  }

  getRecurringThemes(minCount = 2) {
    const themeCounts = {};
    this.memories.forEach(memory => {
      memory.tags.forEach(tag => {
        themeCounts[tag] = (themeCounts[tag] || 0) + 1;
      });
    });
    return Object.fromEntries(
      Object.entries(themeCounts).filter(([_, count]) => count >= minCount)
    );
  }
}