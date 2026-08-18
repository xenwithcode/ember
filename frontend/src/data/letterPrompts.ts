// frontend/src/data/letterPrompts.ts

export interface LetterPrompt {
  id: string;
  question: string;
  placeholder: string;
  purpose: string;
}

export interface DeliveryTimeframe {
  id: string;
  label: string;
  days: number;
  emoji: string;
  description: string;
}

export const deliveryTimeframes: DeliveryTimeframe[] = [
  {
    id: "week",
    label: "1 Week",
    days: 7,
    emoji: "📅",
    description: "A short check-in. Perfect for upcoming events.",
  },
  {
    id: "month",
    label: "1 Month",
    days: 30,
    emoji: "🌙",
    description: "Enough time for real change to happen.",
  },
  {
    id: "quarter",
    label: "3 Months",
    days: 90,
    emoji: "🍂",
    description: "A season of transformation.",
  },
  {
    id: "year",
    label: "1 Year",
    days: 365,
    emoji: "🌟",
    description: "A conversation across a whole year of growth.",
  },
];

export const letterPrompts: LetterPrompt[] = [
  {
    id: "worry",
    question: "What are you most worried about right now?",
    placeholder:
      "I'm afraid that... / I keep thinking about... / What if...",
    purpose: "Capture the specific fear or anxiety",
  },
  {
    id: "prediction",
    question: "What do you predict will happen?",
    placeholder:
      "I think... / I'm sure that... / It's going to...",
    purpose: "Make the prediction explicit so we can check it later",
  },
  {
    id: "feeling",
    question: "How do you think you'll feel when it happens?",
    placeholder:
      "I'll probably feel... / I imagine I'll be... / My gut says...",
    purpose: "Predict the emotional response",
  },
  {
    id: "hope",
    question: "What do you hope is different by then?",
    placeholder:
      "I hope that... / I wish... / It would mean everything if...",
    purpose: "Capture hopes and desires",
  },
  {
    id: "advice",
    question: "What would you tell your future self to remember?",
    placeholder:
      "Don't forget that... / Remember to... / Please hold onto...",
    purpose: "Leave a message of self-compassion",
  },
];

// Generate the letter template
export function generateLetterTemplate(
  answers: Record<string, string>,
  timeframe: DeliveryTimeframe
): string {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + timeframe.days);

  const formattedDate = futureDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `Dear me, on ${formattedDate},

${answers.worry ? `Right now, I'm carrying this weight: ${answers.worry}\n\n` : ""}
${answers.prediction ? `I predict that ${answers.prediction}\n\n` : ""}
${answers.feeling ? `When it happens, I think I'll feel ${answers.feeling}\n\n` : ""}
${answers.hope ? `But here's what I hope: ${answers.hope}\n\n` : ""}
${answers.advice ? `And here's what I need you to remember: ${answers.advice}\n\n` : ""}

With love and curiosity,
Your past self

P.S. — If things didn't go the way I feared, please smile for me. I was so worried for nothing.`;
}