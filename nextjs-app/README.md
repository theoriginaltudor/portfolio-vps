
# Portfolio Website

This is my personal portfolio website built with Next.js, TypeScript, React, Tailwind CSS, and Supabase. It features an AI-powered chat, a project gallery with carousels, and a modern, responsive design. The site showcases my projects, skills, and contact information, and uses Supabase for data and image storage.


## 🚀 Live Site

[View the live site here](https://portfolio-nextjs-w9v34.sevalla.app/)


## Features

- **AI-powered chat**: Ask questions and get answers or links to relevant projects/articles using LLMs and retrieval-augmented generation.
- **Project gallery**: Browse projects with image carousels, project detail pages, and associated skills.
- **Contact page**: View contact information and send messages.
- **Responsive design**: Works on mobile, tablet, and desktop.
- **Dark mode**: Theme switching with next-themes.
- **Supabase integration**: Data and image storage, authentication (WIP), and vector search for article retrieval.


## Tech Stack

- [Next.js](https://nextjs.org/) – App directory, routing, SSR
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) – Database, storage, and vector search
- [AI SDK](https://sdk.vercel.ai/) – LLM integration (Google Gemini)
- [Radix UI](https://www.radix-ui.com/) – Accessible UI primitives
- [Embla Carousel](https://www.embla-carousel.com/) – Carousels for project images
- [Lucide Icons](https://lucide.dev/) – Icon set


## Getting Started

1. **Clone the repository:**
   ```zsh
   git clone https://github.com/theoriginaltudor/portfolio-nextjs.git
   cd portfolio-nextjs
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


## Folder Structure

- `components/` – General reusable UI components (navigation, avatar, UI primitives)
- `features/` – Feature-specific modules (chat, contact, work description, carousels)
- `app/` – Next.js app directory (routing, pages, layouts)
- `public/` – Static assets and images
- `lib/` – Utility functions and Supabase clients
- `types/` – TypeScript types (database schema, etc.)

## Notable Functionality

- **Chat with AI**: The homepage features a chat box powered by Google Gemini via Vercel AI SDK. It uses retrieval-augmented generation to answer questions and link to relevant projects or articles.
- **Project Gallery**: `/project` displays a carousel of projects, each with images and skills. Clicking a project opens a detail page with more info, images, and related skills.
- **Contact**: `/contact` shows contact info and an avatar. Messages and errors are displayed contextually.
- **Supabase**: Used for storing project/article data, images, and (WIP) authentication.

---
**Work in progress:**
- Authenticated edit mode
- Improved chat and project linking
- More project themes and article enhancements

---
Feel free to fork or reach out for questions!
