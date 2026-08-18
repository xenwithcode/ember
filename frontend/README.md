# Ember 🔥

> A collaborative AI agent that helps young adults (18-23) rebuild self-esteem
> through real-world actions, not digital validation.

[![Built for All Things Agentic Hackathon](https://img.shields.io/badge/Hackathon-All%20Things%20Agentic-E28766?style=for-the-badge)](https://allthingsagentichackathon.devpost.com/)
[![Google ADK](https://img.shields.io/badge/Google-ADK-4285F4?style=for-the-badge&logo=google)](https://google.github.io/adk-docs/)
[![Gemini 3.5 Flash](https://img.shields.io/badge/Gemini-3.5%20Flash-34A853?style=for-the-badge)](https://ai.google.dev/)
[![Cloud Run](https://img.shields.io/badge/Google%20Cloud-Cloud%20Run-EA4335?style=for-the-badge&logo=googlecloud)](https://cloud.google.com/run)

---

## 🎯 The Problem

Young adults are experiencing an unprecedented crisis of self-esteem that most
adults don't even see:

- **42%** of high school students report persistent feelings of sadness and hopelessness
- **1 in 3** teenage girls has seriously considered suicide
- **81%** of teens feel crushing pressure to have a "perfect life plan" by 25
- **48%** say social media negatively impacts their self-worth
- **Only 58.5%** of teens feel they get the emotional support they need,
  while **93%** of parents believe they're providing it

### The Digital Accelerant

The device in their pocket is making it worse:

- Teens who spend **3+ hours/day** on social media **double** their risk of
  mental health problems
- Girls who spend **5+ hours/day** are **3x more likely** to be depressed
- The algorithm doesn't care about their self-worth — it cares about their screen time

### The Economic Emergency

This isn't just a mental health crisis. It's an economic one:

- **$185 billion** in lifetime medical costs per generation
- **$3 trillion** in lost productivity and wages
- **$300,000** lost income per affected individual over a lifetime

### Why Existing Solutions Fall Short

Traditional mental health apps keep users **in the digital world** — more
notifications, more screen time, more digital "wellness" that never translates
to real-life confidence. It's like trying to cure a hangover with more alcohol.

---

## 💡 The Solution: Rekindle Your Spark

**Ember** is not another app to keep you on your phone.
It's a **bridge back to your real life**.

Our collaborative AI agent combines **two core pillars** and **one protective shield**:

### 🌉 The Bridge (Core Identity)

#### Pillar 1: Smart Journal 📖
A private, AI-guided journal that helps you untangle thoughts through
structured introspection and healthy self-reflection.

- Detects emotional patterns, fears, and genuine interests
- Asks clarifying questions, never judges
- Builds your "Identity Graph" over time
- **Voice input**: Dictate your entry using speech recognition
- **Voice output**: The coach reads responses aloud

#### Pillar 2: Face-to-Face Activities 🌍
A curated catalog of low-pressure, real-world activities matched to your
anxiety level and interests.

- **8 categories**: Creative, Physical, Social, Intellectual, Volunteer, Nature, Mindfulness, Student
- **Geolocation-based discovery** with Google Maps integration
- **Agent handles logistics**: scheduling, invites, reminders
- **Community-verified** experiences that build real confidence

### 🛡️ The Shield (Complement)

#### Guardian Mode (Future Enhancement)
A user-controlled, non-invasive approach to mindful device usage.
Protects the bridge by helping users break free from scroll paralysis
so they CAN cross.

- Focus timer with scroll-awareness
- Educational insights about social media's impact
- Real-time alternative suggestions (walks, reading, nature)
- **User-controlled, never invasive**

---

## ⚠️ Important Disclaimer

> **Ember is a self-help tool designed to support personal growth
> and well-being. It is NOT a substitute for professional medical,
> psychological, or psychiatric care.**
>
> If you're experiencing thoughts of self-harm, severe depression, anxiety,
> or any mental health crisis, please reach out to a qualified healthcare
> professional or contact a crisis hotline immediately:
>
> - **988 Suicide & Crisis Lifeline:** Call or text **988** (US)
> - **Crisis Text Line:** Text **HOME** to **741741**
> - **International resources:** [findahelpline.com](https://findahelpline.com)
>
> The AI in this app provides general guidance for personal development,
> not professional advice. By using this app, you acknowledge this limitation.

---

## 🏗️ Architecture

Built with **Google ADK**, **Gemini 3.5 Flash**, and **Google Cloud Firestore**.

![Architecture Diagram](docs/architecture.png)

### System Overview
┌──────────────────────────────────────────────────────────────────────┐
│ EMBER │
│ Collaborative Partner Agent │
└──────────────────────────────────────────────────────────────────────┘

                     ┌──────────────┐
                     │   Frontend   │
                     │  (Next.js)   │
                     │  Warm UI/UX  │
                     │  Journal     │
                     │  Activities  │
                     │  Calendar    │
                     │  Dashboard   │
                     └──────┬───────┘
                            │ REST API
                            ▼
                     ┌──────────────┐
                     │  Cloud Run   │  ← Google Cloud Service
                     │  (FastAPI)   │
                     └──────┬───────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Resilience │    │  Activity   │    │  Guardian   │
│  Coach      │    │  Catalog    │    │  Mode       │
│  Agent      │    │  Service    │    │  (Future)   │
│  (ADK)      │    │  + Geo      │    │             │
└──────┬──────┘    └──────┬──────┘    └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐    ┌─────────────┐
│  Gemini     │    │  Firestore  │
│  3.5 Flash  │    │  (Memory    │
│  (Vertex AI)│    │   Bank)     │
└─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  Google     │
                   │  Maps API   │
                   │  Calendar   │
                   │  Gmail      │
                   └─────────────┘

 
### Agent Workflow

 User writes journal entry (text or voice)
│
▼
┌─────────────────────────┐
│ 1. analyze_journal_entry│ ← Detects emotions, fears, interests
└────────────┬────────────┘
│
▼
┌─────────────────────────┐
│ 2. Agent asks │ ← Clarifying questions
│ (Collaborative │ (never judges)
│ Partner) │
└────────────┬────────────┘
│
▼
┌─────────────────────────┐
│ 3. find_local_activities│ ← Searches catalog by interest + anxiety
│ + geolocation │ Shows: address, date, price, spots
└────────────┬────────────┘
│
▼
┌─────────────────────────┐
│ 4. schedule_activity │ ← Adds to user's calendar
│ + set reminders │ Google Calendar integration
└────────────┬────────────┘
│
▼
┌─────────────────────────┐
│ 5. send_invitation_email│ ← Drafts email to invite a friend
│ (optional) │ Reduces social friction
└────────────┬────────────┘
│
▼
🌍 User attends activity
(in the REAL WORLD)
│
▼
┌──────────────────────────────────┐
│ 6. capture_post_action_reflection│ ← "How did it feel?"
│ Update Identity Graph │ Agent adapts for next time
└──────────────────────────────────┘


### Tech Stack

| Component | Technology | Hackathon Requirement |
|-----------|-----------|:--------------------:|
| AI Model | Gemini 3.5 Flash | ✅ Gemini 3.5+ |
| Agent Framework | Google ADK (Agent Development Kit) | ✅ Agent Framework |
| Database | Google Cloud Firestore | ✅ Cloud Service |
| Backend Hosting | Google Cloud Run | ✅ Cloud Service |
| Geolocation | Google Maps Platform API | Activity discovery |
| Calendar | Google Calendar API | Real-world scheduling |
| Email | Gmail API | Friend invitations |
| Frontend | Next.js 16 + React 19 + Tailwind CSS v4 | — |
| Backend Language | Python 3.11 + FastAPI | — |

---

## 🎙️ Multimodal UX

Ember offers multiple interaction modes so users can choose
what works best for their moment:

| Modality | Feature | Implementation |
|----------|---------|---------------|
| ✍️ Text | Write journal entries | Textarea with serif font |
| 🎤 Voice Input | Dictate journal entries | Web Speech API (free) |
| 🔊 Voice Output | Coach reads responses aloud | Web Speech API TTS (free) |
| 🫁 Breathing | Guided 4-7-8 exercise | Visual + voice guidance |
| 👆 Touch | Swipe, tap, interact | Standard web interactions |

### Voice Features

- **Voice Journal**: Tap the mic and dictate your entry. No typing needed.
- **Voice Coach**: Toggle voice responses and the coach reads aloud.
- **Breathing Exercise**: Guided 4-7-8 breathing with visual circle animation
  and voice prompts. Calm your nervous system in 60 seconds.

---

## 📱 Pages & Features

### ✅ Implemented

| Page | Description | Key Features |
|------|-------------|-------------|
| `/` | Landing page | Problem narrative, value prop, scenarios |
| `/journal` | Interactive journal | Split view, voice I/O, breathing, emotion detection |
| `/activities` | Activity catalog | Google Maps, filters, geolocation |
| `/activities/[id]` | Activity detail | Registration, invite friend, what to expect |
| `/calendar` | Growth calendar | Monthly view, mood check-in, upcoming |
| `/dashboard` | Triumph Board | Identity Graph, achievements, journey timeline |
| Ember Journey | Auto-play demo | Scenario + activity journeys with dashboard reveal |

### 🚧 Future Enhancements

| Feature | Description | Priority |
|---------|-------------|:--------:|
| Guardian Mode | Scroll awareness + alternatives | High |
| Comparison Detox | 7-day social media reduction challenge | Medium |
| Digital Sunset | Evening wind-down routine | Medium |
| Gratitude Walk | Mindful walking with reflection prompts | Medium |
| Nutrition awareness | Healthy eating suggestions (positive, not surveillance) | Low |
| Mobile app | iOS/Android native experience | Future |

---

## 🌍 Activity Catalog

### Categories

| Category | Examples | Anxiety Level |
|----------|----------|:------------:|
| 🎨 Creative | Watercolor, pottery, music jam, sketch night | Low |
| 🧘 Physical | Yoga, hiking, calisthenics, stretching | Low |
| 👥 Social | Board games, book club, café meetups | Moderate |
| 📚 Intellectual | Courses, library discovery, workshops | Low |
| 🤝 Volunteer | Animal shelter, community garden, mentoring | Low |
| 🌿 Nature | Bird watching, forest bathing, nature journaling | Solo |
| 🧠 Mindfulness | Meditation, Qi Gong, Tai Chi, breathing | Solo |
| 🎓 Student | Study groups, campus events, focus sessions | Low |

### Activity Features

Each activity includes:

- 📍 **Geolocation**: GPS coordinates, address, distance from user
- 📅 **Schedule**: Date, time, duration, recurrence
- 👥 **Capacity**: Max participants, spots remaining
- 🌱 **Anxiety level**: Solo / Low / Moderate / High
- 💰 **Price**: Free or paid
- 🎓 **Certification**: Completion certified by organizer
- ✅ **What to expect**: Detailed description of the experience
- 🎒 **What to bring**: Preparation checklist
- 👋 **Beginner friendly**: No experience needed

---

## 🎬 Ember Journey Demo

Click **"Try a Scenario"** on the landing page to open the auto-playing
**Ember Journey** — a hands-free demo for judges. No clicks needed: the
whole story unfolds by itself.

### Scenario Journeys

Follow a real struggle end-to-end — everything auto-plays:

1. User writes in the journal (typing effect)
2. Coach analyzes emotions (thinking animation)
3. Coach responds with empathy (typing effect + emotion chips)
4. Agent suggests a matched real-world activity (with details)
5. Google Maps shows the exact location
6. Agent handles logistics: booking, calendar, friend invitation
7. User attends in the real world
8. **Dashboard reveal**: Triumph Board with stats, Identity Graph evolution
   and unlocked achievements — with a link to the full board

| Scenario | Description |
|----------|-------------|
| 😰 Comparison Anxiety | Feeling behind after seeing a friend's success |
| 🫥 Social Isolation | Haven't talked to anyone in days |
| 🎭 Imposter Syndrome | Got the job but feels like a fraud |

### Activity Journeys

Pick any of the curated real-world activities to watch Ember plan a full
outing — details, map, registration — ending in the same dashboard reveal.

Controls: play/pause, skip step, and replay are available in the footer.

---

## ☁️ Google Cloud Deployment

Ember is built and deployed entirely on Google Cloud.

### Services Used

| Service | Purpose | Evidence |
|---------|---------|----------|
| **Vertex AI** | Gemini 3.5 Flash model access | `backend/agent.py` |
| **Google ADK** | Agent orchestration framework | `backend/agent.py`, `backend/tools/` |
| **Firestore** | User data, journal, activities | `backend/database/firestore_client.py` |
| **Cloud Run** | Backend API hosting | `backend/Dockerfile`, `cloudrun.yaml` |
| **Cloud Build** | Docker image building | `cloudbuild.yaml` |
| **Google Maps Platform** | Geolocation for activities | `frontend/src/components/activities/ActivityMap.tsx` |

### Deployment Proof

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step deployment guide.

Screenshots of the live deployment:

| Screenshot | Description |
|-----------|-------------|
| ![Project](docs/screenshots/01-gcloud-project.png) | Google Cloud project dashboard |
| ![Firestore](docs/screenshots/02-firestore-data.png) | Firestore with activity data |
| ![Cloud Run](docs/screenshots/03-cloudrun-service.png) | Cloud Run service deployed |
| ![Vertex AI](docs/screenshots/04-vertex-ai-gemini.png) | Gemini 3.5 enabled in Vertex AI |

### Quick Deploy

```bash
# One-command deployment
gcloud run deploy ember-api \
  --source ./backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

  Cost Management
This project runs within the $150 hackathon credit:
Service
Free Tier
Est. Monthly Cost
Cloud Run
2M requests
$0
Firestore
1GB + 50k reads/day
$0
Vertex AI (Gemini Flash)
$300 credit
~$5
Google Maps API
$200 credit
$0
Gmail/Calendar API
Free
$0
Total
~$5/month
After judging, the service can be paused to avoid charges.
🎨 Design System
Color Palette: "Warm Sunset"
Element
Color
Hex
Purpose
Background
Cream/Ivory
#FDFBF7
Premium paper feel
Text
Dark Coffee
#2C2523
Softer than black
Accent
Terracotta
#E28766
Warm, inviting CTAs
Accent Hover
Deep Terracotta
#D97757
Interactive states
Secondary Text
Warm Gray
#5A5350
Body copy
Dark Mode BG
Charcoal
#1E1C1B
Candlelight feel
Typography
Usage
Font
Style
Headings
Playfair Display
Serif, literary, human
Body
Inter
Clean, readable, modern
Quotes
Caveat
Handwritten, personal
Design Principles
🕯️ Feel like a café, not a hospital — warm tones, generous spacing
📖 Feel like a journal, not a dashboard — serif headings, paper textures
🌱 Feel encouraging, not demanding — soft animations, no red alerts
🤗 Feel safe, not clinical — rounded corners, gentle shadows
See docs/design-system.md for full specifications.
🔧 Getting Started
Prerequisites
Python 3.11+
Node.js 18+
Google Cloud account with billing enabled
$150 in Google Cloud credits (from hackathon)
APIs enabled: Vertex AI, Firestore, Cloud Run, Maps, Calendar, Gmail
Installation
Clone the repository

   git clone https://github.com/yourusername/ember.git
   cd ember

 2.- Set up environment

      cp .env.example .env
   # Edit .env with your Google Cloud credentials

   3.-Set up backend

      cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r ../requirements.txt

   4.-Seed the activity catalog (for demo)

      python -m backend.database.seed_data

   5.-Run the backend

      uvicorn backend.main:app --reload --port 8080

    6.- Set up frontend (separate terminal)

       cd frontend
   npm install
   npm run dev

 7,-  Access the app

Frontend: http://localhost:3000
Backend API: http://localhost:8080
API Docs: http://localhost:8080/docs

Deploy to Cloud Run

# Build Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/ember-api

# Deploy to Cloud Run
gcloud run deploy ember-api \
  --image gcr.io/PROJECT_ID/ember-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi

📂 Project Structure

ember/
├── README.md                         # This file
├── ARCHITECTURE.md                   # Detailed technical documentation
├── requirements.txt                  # Python dependencies
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
│
├── backend/                          # Python backend (FastAPI + ADK)
│   ├── __init__.py
│   ├── main.py                       # FastAPI server (Cloud Run entry)
│   ├── agent.py                      # Resilience Coach agent (ADK)
│   ├── config.py                     # Central configuration
│   ├── Dockerfile                    # Docker for Cloud Run
│   ├── cloudrun.yaml                 # Cloud Run deployment config
│   │
│   ├── api/                          # REST API endpoints
│   │   ├── __init__.py
│   │   ├── chat.py                   # Agent chat endpoints
│   │   ├── activities.py             # Activity discovery endpoints
│   │   └── calendar.py              # Calendar management endpoints
│   │
│   ├── models/                       # Data models (Pydantic)
│   │   ├── __init__.py
│   │   ├── user_profile.py           # Identity Graph model
│   │   ├── journal_entry.py          # Journal entry model
│   │   └── activity.py              # Activity + UserActivity models
│   │
│   ├── services/                     # Business logic
│   │   ├── __init__.py
│   │   ├── activity_catalog.py       # Activity CRUD + discovery
│   │   ├── geolocation.py           # GPS, maps, distances
│   │   ├── calendar_service.py      # User calendar management
│   │   └── registration_service.py  # Activity registration
│   │
│   ├── tools/                        # Agent tools (ADK)
│   │   ├── __init__.py
│   │   ├── journal_analyzer.py       # Analyze emotions/fears
│   │   ├── activity_finder.py       # Find matching activities
│   │   ├── calendar_scheduler.py    # Schedule in calendar
│   │   ├── email_sender.py          # Draft invitations
│   │   └── reflection_capture.py    # Post-action feedback
│   │
│   └── database/                     # Data layer
│       ├── __init__.py
│       ├── firestore_client.py       # Firestore operations
│       └── seed_data.py             # Demo activity data
│
├── frontend/                         # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── journal/page.tsx      # Interactive journal
│   │   │   ├── activities/page.tsx   # Activity catalog
│   │   │   ├── activities/[id]/page.tsx  # Activity detail
│   │   │   ├── calendar/page.tsx     # Growth calendar
│   │   │   └── dashboard/page.tsx    # Triumph Board
│   │   ├── components/
│   │   │   ├── layout/              # Sidebar, MainLayout
│   │   │   ├── journal/             # Editor, CoachPanel, VoiceInput
│   │   │   ├── activities/          # Cards, Map, Filters
│   │   │   ├── calendar/            # Grid, UpcomingPanel, MoodCheckIn
│   │   │   ├── dashboard/           # IdentityGraph, Achievements, Journey
│   │   │   ├── demo/                # EmberJourney (auto-play demo)
│   │   │   └── wellness/            # BreathingExercise
│   │   └── data/                    # Mock data
│   │       ├── activities.ts
│   │       ├── calendarEvents.ts
│   │       └── dashboard.ts
│   └── package.json
│
└── docs/                             # Documentation
    ├── architecture.mermaid          # Diagram source code
    ├── architecture.png              # Exported diagram (for Devpost)
    ├── ARCHITECTURE-DIAGRAM.md       # Diagram documentation
    ├── DEPLOYMENT.md                 # Deployment guide
    ├── design-system.md              # Full design specifications
    ├── demo-script.md                # Video demo script
    └── screenshots/                  # Google Cloud Console screenshots
        ├── 01-gcloud-project.png
        ├── 02-firestore-data.png
        ├── 03-cloudrun-service.png
        ├── 04-vertex-ai-gemini.png
        └── 05-deploy-terminal.png

💰 Cost Estimation

Designed to run within the $150 hackathon credit:
Service
Free Tier
Est. Monthly Cost
Cloud Run
2M requests
$0
Firestore
1GB + 50k reads/day
$0
Vertex AI (Gemini Flash)
$300 credit
~$5
Google Maps API
$200 credit
$0
Gmail/Calendar API
Free
$0
Total
~$5/month

  🙏 Acknowledgments
Built for the All Things Agentic Hackathon
organized by Devpost and Google.
Inspired by research from:
American Psychological Association (APA)
Pew Research Center
Centers for Disease Control and Prevention (CDC)
U.S. Department of Health and Human Services (HHS)
Jonathan Haidt's "The Anxious Generation"
Harvard + Common Sense Media: Achievement pressure study
📄 License
MIT License - feel free to use this project to help others build confidence.
Built with ❤️ and ☕ using Google Cloud, Gemini, and ADK
"Your spark is still there. We just help you find the air."
"One journal entry. One activity. One real-world step at a time."     