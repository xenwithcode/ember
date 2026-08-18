"use client";

const partnerTypes = [
  { emoji: "🎨", title: "Art Studios", desc: "Creative workshops, painting, pottery, sketch nights" },
  { emoji: "🧘", title: "Yoga & Meditation", desc: "Mindfulness centers, breathwork classes" },
  { emoji: "📚", title: "Libraries & Book Clubs", desc: "Reading circles, author events, literacy programs" },
  { emoji: "⚽", title: "Sports Clubs", desc: "Community teams, recreational leagues" },
  { emoji: "🌿", title: "Nature Groups", desc: "Hiking clubs, bird watching, forest bathing" },
  { emoji: "🎵", title: "Music Schools", desc: "Jam sessions, open mics, instrument lessons" },
  { emoji: "🍳", title: "Cooking Classes", desc: "Food co-ops, community kitchens" },
  { emoji: "🎭", title: "Theater & Improv", desc: "Community theater, improv workshops" },
  { emoji: "🤝", title: "Volunteer Orgs", desc: "Service projects, community aid" },
  { emoji: "🎓", title: "Student Groups", desc: "University clubs, study groups" },
  { emoji: "☕", title: "Cafés & Venues", desc: "Community event hosts" },
  { emoji: "🏛️", title: "Community Centers", desc: "Churches, libraries, local hubs" },
];

export default function PartnerTypes() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {partnerTypes.map((type) => (
        <div
          key={type.title}
          className="card-static p-5 text-center hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="text-3xl mb-3">{type.emoji}</div>
          <h3 className="font-serif font-semibold text-coffee-800 mb-1 text-sm">
            {type.title}
          </h3>
          <p className="text-xs text-warm-gray">{type.desc}</p>
        </div>
      ))}
    </div>
  );
}