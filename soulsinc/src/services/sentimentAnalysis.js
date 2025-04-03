const positiveWords = ["love", "appreciate", "happy", "support", "great"];
const negativeWords = ["hate", "annoy", "angry", "sad", "conflict"];

export function analyzeSentiment(text) {
  const textLower = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
  
  if (positiveCount + negativeCount === 0) return 0;
  return (positiveCount - negativeCount) / (positiveCount + negativeCount);
}