// frontend/src/data/onboardingDays.ts

export interface OnboardingDay {
  day: number;
  title: string;
  subtitle: string;
  emoji: string;

  // The lesson
  concept: string; // Short explanation of the concept
  science: string; // Scientific backing
  quote: string; // Inspirational quote
  quoteAuthor: string;

  // The practice
  prompt: string; // What to write today
  promptPlaceholder: string;
  suggestedRitual: string; // Which ritual to use
  estimatedTime: string;

  // The takeaway
  keyInsight: string; // What they should remember
}

export const onboardingDays: OnboardingDay[] = [
  // ============================================
  // DAY 1: Why Writing Works
  // ============================================
  {
    day: 1,
    title: "Why Writing Works",
    subtitle: "The science behind putting feelings into words",
    emoji: "🧠",

    concept:
      "When you write about your feelings, you're not just 'venting.' You're performing a neurological act that literally changes how your brain processes emotion.",

    science:
      "Psychologist James Pennebaker discovered that writing about emotional experiences for just 15 minutes a day reduces doctor visits by 50%, improves immune function, and decreases symptoms of depression. The act of naming an emotion activates your prefrontal cortex (rational brain) and calms your amygdala (fear center).",

    quote:
      "I write to understand. I write to find out what I think.",
    quoteAuthor: "Joan Didion",

    prompt:
      "What's one thing you'd like to understand about yourself? It doesn't have to be deep. It can be as simple as: 'Why do I always feel tired on Sundays?' or 'What actually makes me feel like myself?'",

    promptPlaceholder:
      "I've been wondering about... / I don't understand why I... / Something I'd like to figure out is...",

    suggestedRitual: "evening",
    estimatedTime: "~5 minutes",

    keyInsight:
      "Writing isn't about grammar or style. It's about translating the abstract chaos in your head into concrete words you can actually look at.",
  },

  // ============================================
  // DAY 2: The Power of Distance
  // ============================================
  {
    day: 2,
    title: "The Power of Distance",
    subtitle: "Seeing your problem from the outside",
    emoji: "🔭",

    concept:
      "When a problem is swirling in your mind, it feels enormous and urgent. When you write it down, something remarkable happens: you can read it like it belongs to someone else. That distance is where clarity lives.",

    science:
      "Research shows that writing about a problem in third person ('he felt...' instead of 'I felt...') reduces emotional reactivity by 27%. The simple act of externalizing a thought creates psychological distance, allowing you to evaluate it more objectively.",

    quote:
      "The first draft is just you telling yourself the story.",
    quoteAuthor: "Terry Pratchett",

    prompt:
      "Think of a problem that's been bothering you. Now, describe it as if you were telling a friend about THEIR problem. Use 'they' or 'this person' instead of 'I.' What advice would you give them?",

    promptPlaceholder:
      "This person has been dealing with... / They keep worrying about... / If I were advising them, I'd say...",

    suggestedRitual: "deep",
    estimatedTime: "~10 minutes",

    keyInsight:
      "You already have the wisdom to solve your problems. Writing creates the distance needed to access it.",
  },

  // ============================================
  // DAY 3: Patterns You Can't See
  // ============================================
  {
    day: 3,
    title: "Patterns You Can't See",
    subtitle: "Repetition reveals truth",
    emoji: "🔍",

    concept:
      "Your mind is a pattern-recognition machine, but it's terrible at recognizing its OWN patterns. Writing daily creates a record. And records reveal what your spinning mind cannot: the loops you're stuck in.",

    science:
      "Cognitive behavioral research shows that identifying recurring thought patterns is the first step to changing them. When you can say 'I always catastrophize on Mondays,' the pattern loses its power. It becomes observable, and therefore changeable.",

    quote:
      "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
    quoteAuthor: "Carl Jung",

    prompt:
      "What topic, worry, or feeling has shown up in your life at least 3 times this month? It could be a person, a situation, a fear, a recurring dream. Name it. Describe it. When did you first notice it?",

    promptPlaceholder:
      "I keep coming back to... / This keeps happening... / I've noticed a pattern with...",

    suggestedRitual: "deep",
    estimatedTime: "~10 minutes",

    keyInsight:
      "The patterns you can't see are the ones controlling you. Writing makes them visible. And visible patterns can be changed.",
  },

  // ============================================
  // DAY 4: Defeating the Inner Censor
  // ============================================
  {
    day: 4,
    title: "Defeating the Inner Censor",
    subtitle: "Writing alone frees your truth",
    emoji: "🎭",

    concept:
      "When you speak, you edit. You filter. You perform. But when you write alone — truly alone, with no audience — something different happens. The censor relaxes. And what comes out is often more honest than anything you'd say aloud.",

    science:
      "Studies on expressive writing show that people reveal more personal information in private writing than in face-to-face conversation. This 'disinhibition effect' allows access to thoughts and feelings that social performance normally blocks.",

    quote:
      "You can always edit a bad page. You can't edit a blank page.",
    quoteAuthor: "Jodi Picoult",

    prompt:
      "What's something you've never said out loud? A fear, a desire, a truth about yourself? Write it here. No one will see it. The censor can take the day off.",

    promptPlaceholder:
      "I've never admitted this, but... / If no one would judge me, I'd say... / The truth I keep hiding is...",

    suggestedRitual: "deep",
    estimatedTime: "~15 minutes",

    keyInsight:
      "The most important conversations you'll ever have are the ones you have with yourself on paper.",
  },

  // ============================================
  // DAY 5: Emotions as Data
  // ============================================
  {
    day: 5,
    title: "Emotions as Data",
    subtitle: "Your feelings have patterns. Learn to read them.",
    emoji: "📊",

    concept:
      "Emotions aren't random weather. They're signals with patterns, triggers, and purposes. When you write daily, you're collecting data. And data reveals what your rational mind misses: the architecture of your inner life.",

    science:
      "Emotional granularity research shows that people who can precisely identify their emotions (not just 'bad' but 'disappointed' vs 'frustrated' vs 'lonely') have better emotional regulation, lower anxiety, and stronger relationships.",

    quote:
      "What you resist, persists. What you feel, you can heal.",
    quoteAuthor: "Unknown",

    prompt:
      "Right now, in this moment, what are you feeling? Try to be specific. Not 'fine' or 'okay.' Dig deeper. Is it contentment? Restlessness? A quiet sadness? A low-level anxiety about tomorrow? Name it precisely.",

    promptPlaceholder:
      "Right now I feel... / If I'm honest, underneath everything there's... / The emotion I've been carrying today is...",

    suggestedRitual: "evening",
    estimatedTime: "~5 minutes",

    keyInsight:
      "You can't manage what you can't name. Precision in naming emotions is the first step to understanding them.",
  },

  // ============================================
  // DAY 6: From Insight to Action
  // ============================================
  {
    day: 6,
    title: "From Insight to Action",
    subtitle: "Writing without doing is just a beautiful loop",
    emoji: "🎯",

    concept:
      "Here's the hard truth: you can journal for years, discover profound insights about yourself, and change absolutely nothing. Insight without action is just sophisticated self-observation. The bridge between understanding and transformation is doing.",

    science:
      "Behavioral activation research shows that action precedes motivation, not the other way around. You don't wait to feel ready. You act, and the feeling follows. Small, concrete actions rewire neural pathways faster than any amount of reflection.",

    quote:
      "You don't have to see the whole staircase. Just take the first step.",
    quoteAuthor: "Martin Luther King Jr.",

    prompt:
      "Based on everything you've written this week, what's ONE small action you could take in the next 48 hours? Not a life overhaul. A tiny step. A conversation. A boundary. A walk. A creative act. What will you actually DO?",

    promptPlaceholder:
      "One small thing I can do is... / This week I will... / The first step looks like...",

    suggestedRitual: "morning",
    estimatedTime: "~10 minutes",

    keyInsight:
      "The purpose of journaling isn't to understand yourself. It's to become the person you understand yourself to be. That requires action.",
  },

  // ============================================
  // DAY 7: Your First Pattern Reveal
  // ============================================
  {
    day: 7,
    title: "Your First Pattern Reveal",
    subtitle: "Seven days. One ember. Let's see what it shows.",
    emoji: "🔥",

    concept:
      "You've been writing for a week. That's seven days of data. Seven days of your mind, captured in words. Now it's time to look at the whole picture. To see what your daily entries reveal when viewed together.",

    science:
      "Weekly reflection has been shown to increase self-awareness by 38% compared to daily-only journaling. The act of reviewing your week creates a 'meta-perspective' — you see yourself seeing. That's where real insight lives.",

    quote:
      "We do not learn from experience. We learn from reflecting on experience.",
    quoteAuthor: "John Dewey",

    prompt:
      "Read back through your entries from this week. What surprised you? What pattern do you notice? What would you tell the person who wrote Day 1? Write them a short note.",

    promptPlaceholder:
      "Looking back at this week, I notice... / I'm surprised that... / Dear Day 1 me...",

    suggestedRitual: "deep",
    estimatedTime: "~15 minutes",

    keyInsight:
      "You are not the same person who started this week. The ember you lit on Day 1 is burning differently now. That's growth.",
  },
];

// Get a specific day
export function getOnboardingDay(day: number): OnboardingDay | undefined {
  return onboardingDays.find((d) => d.day === day);
}