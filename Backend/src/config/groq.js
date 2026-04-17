let groqInstance = null;

const getGroq = () => {
  if (!groqInstance) {
    if (!process.env.GROQ_API_KEY) {
      console.error("[Groq Error] GROQ_API_KEY is not defined in environment variables.");
    }
    groqInstance = new Groq({
      apiKey: process.env.GROQ_API_KEY || "dummy_key", // Use dummy to prevent immediate crash if not used yet
    });
  }
  return groqInstance;
};

module.exports = { groq: getGroq() }; // Still exporting an instance but with dummy fallback
