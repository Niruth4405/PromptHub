<div align="center">

# ✨ PromptHub

**A full-stack community platform to share, discover, and save AI prompts.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple)](https://authjs.dev)

[Live Demo](#) · [Report Bug](https://github.com/Niruth4405/PromptHub/issues) · [Request Feature](https://github.com/Niruth4405/PromptHub/issues)

</div>

---

## 📖 About

PromptHub is a community-driven platform where creators can publish, discover, and remix AI prompts across tools like Midjourney, GPT-4, Claude, Stable Diffusion, and more. Think of it as GitHub for AI prompts — with a social layer.

Users can follow creators, like and save prompts, leave comments, and filter by category, output type, or AI tool. Every prompt page tracks views, likes, and saves in real time.

---

## ✨ Features

- 🔐 **Authentication** — Email/password, Google OAuth, and GitHub OAuth via Auth.js v5
- 📝 **Prompt sharing** — Rich prompt editor with title, description, tags, output type, AI tool, and image upload
- 🗂️ **Explore & For You** — Browse all prompts or get a personalised feed based on who you follow
- 🔍 **Live user search** — Debounced search in the navbar with instant results
- ❤️ **Likes & Saves** — Optimistic UI updates with rollback on failure
- 💬 **Comments** — Threaded comments with delete for owners
- 👤 **User profiles** — Public profile pages with follower/following counts, bio, expertise, and tools
- 📊 **Stats panel** — Per-prompt view, like, and save counts
- ☁️ **Image uploads** — Cloudinary integration for prompt output previews
- 🔔 **Toast notifications** — Feedback for every user action (login, save, like, publish, logout, etc.)
- 📱 **Fully responsive** — Mobile-first design with a collapsible nav
- 🌑 **Draft support** — Save prompts as drafts before publishing

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + clsx |
| Database | MongoDB Atlas |
| ORM | Prisma |
| Auth | Auth.js v5 (NextAuth) with Prisma Adapter |
| File Storage | Cloudinary |
| Animations | Framer Motion |
| Toasts | react-hot-toast |
| Icons | Lucide React + React Icons |

---

## 📁 Project Structure

```
PromptHub/
├── app/
│   ├── (pages)/           # Route pages
│   │   ├── explore/       # Browse all prompts
│   │   ├── forYou/        # Personalised feed
│   │   ├── login/         # Sign in page
│   │   ├── signup/        # Register page
│   │   ├── prompt/[id]/   # Individual prompt view
│   │   └── shareOrEditPrompt/  # Create / edit prompt
│   ├── api/               # API route handlers
│   │   ├── auth/          # Auth.js callbacks
│   │   ├── comments/      # Comment CRUD
│   │   ├── follow/        # Follow / unfollow
│   │   ├── profile/       # Profile read & update
│   │   ├── prompts/       # Prompt CRUD + forYou feed
│   │   ├── search/users   # Live user search
│   │   └── signup/        # Credentials registration
│   ├── components/        # Shared UI components
│   │   ├── (auth)/        # Login & Signup forms
│   │   ├── explore/       # Explore filters
│   │   ├── landingPage/   # Hero, Features, Categories
│   │   ├── profile/       # Follow list
│   │   └── prompt/        # All prompt-page components
│   └── profile/           # Profile & edit pages
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   └── cloudinary.ts      # Cloudinary config
├── prisma/
│   └── schema.prisma      # Database schema
└── auth.ts                # Auth.js config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster
- A [Cloudinary](https://cloudinary.com) account
- Google and/or GitHub OAuth app credentials

### 1. Clone the repo

```bash
git clone https://github.com/Niruth4405/PromptHub.git
cd PromptHub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/prompthub"

# Auth.js
AUTH_SECRET="your-random-secret-here"
AUTH_TRUST_HOST=true

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Push the Prisma schema

```bash
npx prisma db push
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

| Model | Description |
|---|---|
| `User` | Auth identity + profile fields (bio, role, links, expertise, tools) |
| `Prompt` | Core prompt entity with tags, output type, visibility, image, stats |
| `PromptLike` | Many-to-many join between User and Prompt for likes |
| `PromptSave` | Many-to-many join between User and Prompt for saves |
| `Comment` | Prompt comments with author reference |
| `Follow` | Follower/following relationship between users |
| `Account` / `Session` | Auth.js adapter tables |

---

## 🔑 Authentication Flow

PromptHub supports three sign-in methods:

- **Email + Password** — Credentials provider with bcrypt password hashing
- **Google OAuth** — One-click sign-in via Google
- **GitHub OAuth** — One-click sign-in via GitHub

All OAuth users are automatically assigned a unique username derived from their email. Sessions are managed via the Prisma adapter and JWT strategy.

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🗺️ Roadmap

- [ ] Paid prompt support (visibility gating)
- [ ] Admin dashboard
- [ ] AI-powered prompt enhancement suggestions
- [ ] Auto-generate tags from prompt text
- [ ] Notifications system
- [ ] Prompt collections / folders

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
Made with ☕ and late nights by <a href="https://github.com/Niruth4405">Niruth Ananth</a>
</div>
