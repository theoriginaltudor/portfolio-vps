

# Portfolio Website (Next.js App)

This is my personal portfolio site built with Next.js, TypeScript, React, Tailwind CSS, and Supabase. It features an AI-powered chat, project gallery, and a modern, responsive design. The site showcases my work, skills, and contact info, using Supabase for data and image storage.

## 🚀 Live Site

[View the live site](https://portfolio-nextjs-w9v34.sevalla.app/)

---

## Features

- **AI-powered chat**: Ask questions and get answers or links to relevant projects/articles using LLMs and retrieval-augmented generation (Vercel AI SDK, Google Gemini).
- **Project gallery**: Browse projects with image carousels, detail pages, and associated skills.
- **Contact page**: View contact info and send messages.
- **Responsive design**: Mobile, tablet, and desktop support.
- **Dark mode**: Theme switching with next-themes.
- **Supabase integration**: Data/image storage, authentication (WIP), and vector search for article retrieval.

---

## Tech Stack

- [Next.js](https://nextjs.org/) – App directory, routing, SSR
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) – Database, storage, vector search
- [Vercel AI SDK](https://sdk.vercel.ai/) – LLM integration (Google Gemini)
- [Radix UI](https://www.radix-ui.com/) – Accessible UI primitives
- [Embla Carousel](https://www.embla-carousel.com/) – Project image carousels
- [Lucide Icons](https://lucide.dev/) – Icon set

---

## Getting Started

1. **Clone the repository:**
   ```zsh
   git clone https://github.com/theoriginaltudor/portfolio-nextjs.git
   cd portfolio-nextjs/nextjs-app
   ```
2. **Install dependencies:**
   ```zsh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env.local` file in the root directory.
   - Add your Supabase project keys:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
4. **Run the development server:**
   ```zsh
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view locally.

---

## Folder Structure (nextjs-app)

- `app/` – Next.js app directory (routing, pages, layouts)
- `components/` – Reusable UI components (navigation, avatar, UI primitives)
- `feature-components/` – Feature modules (chat, contact, work, carousels)
- `lib/` – Utility functions and Supabase clients
- `public/` – Static assets and images
- `types/` – TypeScript types (database schema, swagger, etc.)

---

## Notable Functionality

- **Chat with AI**: Homepage chat box powered by Google Gemini (Vercel AI SDK), using retrieval-augmented generation to answer questions and link to relevant projects/articles.
- **Project Gallery**: `/work/project` and `/work/projects` display carousels of projects, each with images and skills. Clicking a project opens a detail page with more info, images, and related skills.
- **Contact**: `/contact` shows contact info and an avatar. Messages and errors are displayed contextually.
- **Supabase**: Used for storing project/article data, images, and (WIP) authentication.

---

## Work in Progress

- Authenticated edit mode
- Improved chat and project linking
- More project themes and article enhancements

---

Feel free to fork or reach out for questions!
