export type ActivityCategory =
  | "creative"
  | "physical"
  | "social"
  | "intellectual"
  | "volunteer"
  | "nature"
  | "mindfulness"
  | "student";

export type AnxietyLevel = "solo" | "low" | "moderate" | "high";

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  anxietyLevel: AnxietyLevel;
  tags: string[];
  imageUrl: string;
  locationName: string;
  latitude: number;
  longitude: number;
  startDate: string;
  startTime: string;
  durationMinutes: number;
  price: number;
  spotsRemaining: number;
  organizerVerified: boolean;
  certificationAvailable: boolean;
}

function daysFromNow(days: number, hour: number): { date: string; time: string } {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return { date: d.toISOString(), time };
}

const w1 = daysFromNow(3, 10);
const w2 = daysFromNow(1, 7);
const w3 = daysFromNow(5, 18);
const w4 = daysFromNow(2, 7);
const w5 = daysFromNow(4, 14);
const w6 = daysFromNow(7, 17);
const w7 = daysFromNow(2, 9);
const w8 = daysFromNow(6, 11);

export const mockActivities: Activity[] = [
  {
    id: "watercolor-workshop",
    title: "Beginner Watercolor Workshop",
    description:
      "A relaxed 2-hour workshop for absolute beginners. No experience needed, all materials provided. Learn basic techniques in a supportive, judgment-free environment. Small group of 8 people max, so you'll get personal attention.",
    category: "creative",
    anxietyLevel: "low",
    tags: ["beginner", "art", "relaxing", "small-group"],
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
    locationName: "Brooklyn Art Studio",
    latitude: 40.6892,
    longitude: -73.9857,
    startDate: w1.date,
    startTime: w1.time,
    durationMinutes: 120,
    price: 25,
    spotsRemaining: 5,
    organizerVerified: true,
    certificationAvailable: true,
  },
  {
    id: "sunrise-yoga-park",
    title: "Sunrise Yoga in the Park",
    description:
      "Gentle morning yoga session in Central Park. Perfect for beginners — focus on breathing and being present. No flexibility required. Bring a mat or towel. The session ends with 5 minutes of guided meditation.",
    category: "physical",
    anxietyLevel: "low",
    tags: ["yoga", "outdoor", "morning", "beginner", "meditation"],
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    locationName: "Central Park - Sheep Meadow",
    latitude: 40.7794,
    longitude: -73.9654,
    startDate: w2.date,
    startTime: w2.time,
    durationMinutes: 60,
    price: 0,
    spotsRemaining: 12,
    organizerVerified: true,
    certificationAvailable: false,
  },
  {
    id: "board-game-cafe",
    title: "Board Game Café Night",
    description:
      "Casual board game evening at a cozy local café. Great for meeting people without pressure — the games do the talking! We'll have a variety of games from easy to moderate complexity. Come alone or with a friend. First drink is on us!",
    category: "social",
    anxietyLevel: "moderate",
    tags: ["board-games", "social", "casual", "cafe", "beginner"],
    imageUrl:
      "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800",
    locationName: "The Game Table Café",
    latitude: 40.7282,
    longitude: -73.9942,
    startDate: w3.date,
    startTime: w3.time,
    durationMinutes: 180,
    price: 0,
    spotsRemaining: 8,
    organizerVerified: true,
    certificationAvailable: false,
  },
  {
    id: "bird-watching-walk",
    title: "Beginner Bird Watching Walk",
    description:
      "A peaceful morning walk through Prospect Park with an experienced guide. Learn to identify common NYC birds by sight and sound. Binoculars provided. No experience needed — just curiosity. Perfect for clearing your mind and connecting with nature.",
    category: "nature",
    anxietyLevel: "solo",
    tags: ["nature", "birds", "outdoor", "peaceful", "beginner"],
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    locationName: "Prospect Park - Main Entrance",
    latitude: 40.6602,
    longitude: -73.969,
    startDate: w4.date,
    startTime: w4.time,
    durationMinutes: 120,
    price: 10,
    spotsRemaining: 7,
    organizerVerified: true,
    certificationAvailable: false,
  },
  {
    id: "animal-shelter-volunteer",
    title: "Volunteer at Animal Shelter",
    description:
      "Spend 2 hours playing with cats and dogs at a local shelter. No social pressure — just animals and kindness. You'll help socialize the animals, making them more adoptable. Perfect if you want to help others without the anxiety of big groups.",
    category: "volunteer",
    anxietyLevel: "low",
    tags: ["volunteer", "animals", "helping", "low-pressure"],
    imageUrl:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800",
    locationName: "Brooklyn Animal Rescue",
    latitude: 40.6687,
    longitude: -73.9876,
    startDate: w5.date,
    startTime: w5.time,
    durationMinutes: 120,
    price: 0,
    spotsRemaining: 3,
    organizerVerified: true,
    certificationAvailable: true,
  },
  {
    id: "book-club-first-chapters",
    title: "Casual Book Club: First Chapters",
    description:
      "A book club for people who read at their own pace. This month we're only reading the FIRST CHAPTER of a book together. No pressure to finish anything. Just show up, share your thoughts, and enjoy good conversation over coffee.",
    category: "intellectual",
    anxietyLevel: "moderate",
    tags: ["books", "reading", "discussion", "casual", "coffee"],
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    locationName: "The Cozy Corner Bookshop",
    latitude: 40.7306,
    longitude: -73.9866,
    startDate: w6.date,
    startTime: w6.time,
    durationMinutes: 90,
    price: 0,
    spotsRemaining: 6,
    organizerVerified: true,
    certificationAvailable: false,
  },
  {
    id: "guided-meditation-circle",
    title: "Guided Meditation Circle",
    description:
      "A quiet Sunday morning meditation circle in a calm community space. An experienced guide leads 30 minutes of guided meditation followed by optional sharing. Come as you are — no need to speak at all if you don't want to.",
    category: "mindfulness",
    anxietyLevel: "solo",
    tags: ["meditation", "mindfulness", "quiet", "beginner"],
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    locationName: "Calm Space Community Center",
    latitude: 40.7359,
    longitude: -73.9911,
    startDate: w7.date,
    startTime: w7.time,
    durationMinutes: 60,
    price: 0,
    spotsRemaining: 10,
    organizerVerified: true,
    certificationAvailable: false,
  },
  {
    id: "student-art-meetup",
    title: "Student Art Meetup: Sketch & Coffee",
    description:
      "A relaxed sketching meetup for college students and recent grads. Bring any notebook and pencil — a local artist shares one easy technique, then we draw together in a cozy café. A low-pressure way to meet people and make something.",
    category: "student",
    anxietyLevel: "low",
    tags: ["students", "art", "sketching", "coffee", "beginner"],
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    locationName: "The Sketch House Café",
    latitude: 40.7219,
    longitude: -73.9889,
    startDate: w8.date,
    startTime: w8.time,
    durationMinutes: 120,
    price: 5,
    spotsRemaining: 9,
    organizerVerified: true,
    certificationAvailable: false,
  },
];
