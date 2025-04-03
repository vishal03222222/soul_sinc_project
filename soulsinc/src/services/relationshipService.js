export class RelationshipProfile {
    constructor(contactName, data = {}) {
      this.contactName = contactName;
      this.createdAt = data.createdAt || new Date();
      this.updatedAt = new Date();
      this.memories = data.memories || [];
      this.sentimentScore = data.sentimentScore || 0;
      this.depthScore = data.depthScore || 1;
      this.reciprocityRatio = data.reciprocityRatio || 1.0;
      this.emotionalVolatility = data.emotionalVolatility || "Stable";
    }
  
    addMemory(type, content, weight = 1.0, tags = []) {
      // Return a NEW instance with the added memory (immutable approach)
      return new RelationshipProfile(this.contactName, {
        ...this,
        memories: [
          ...this.memories,
          { type, content, weight, tags, createdAt: new Date() }
        ],
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