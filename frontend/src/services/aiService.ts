import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

let lastRequestTime = 0;
const REQUEST_DELAY = 2000; // 2 seconds

export const generateAIReply = async (message: string) => {
  const now = Date.now();

  if (now - lastRequestTime < REQUEST_DELAY) {
    console.warn("Too many requests! Waiting before next call...");
    await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY));
  }

  lastRequestTime = Date.now();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 50,
    });

    return response.choices[0]?.message?.content.trim() || "I see!";
  } catch (error) {
    console.error("AI Reply Error:", error);
    return "AI Response currently unavailable, please try again later!";
  }
};
