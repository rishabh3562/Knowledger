# Knowledger

Your Personal Knowledge Hub - Organize your learning into unified chapters.

## Features

- Create chapters to organize your knowledge
- Add multiple types of content blocks:
  - Text notes
  - Code snippets
  - Images and handwritten notes
  - PDF documents
  - External links
- Link chapters together to create a knowledge graph
- Search across all your content
- Visualize connections with React Flow

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **UI**: Shadcn UI + Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **Knowledge Graph**: React Flow
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the migration file in `supabase/migrations/20240101000000_initial_schema.sql` in the Supabase SQL editor

4. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── chapters/          # Chapter pages
│   │   ├── create/        # Create new chapter
│   │   └── [id]/          # View/edit chapter
│   ├── api/               # API routes
│   │   ├── chapters/      # Chapter CRUD
│   │   ├── blocks/        # Block CRUD
│   │   └── links/         # Link CRUD
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── editor/            # Block editor components
│   └── ui/                # Shadcn UI components
└── lib/
    ├── supabase.ts        # Supabase client
    ├── utils.ts           # Utility functions
    └── react-query.ts     # Query client config
```

## Database Schema

### Tables

- **chapters**: Main chapter data (title, summary, tags, cover image)
- **blocks**: Content blocks within chapters
- **links**: Connections between chapters for the knowledge graph

## Features Status

- [x] Project setup with Next.js 14 + TypeScript
- [x] Database schema with Supabase
- [x] Authentication with Supabase Auth
- [x] Chapter CRUD operations
- [x] Block management with drag-and-drop
- [x] File uploads (images and PDFs)
- [x] Search functionality
- [x] Knowledge graph visualization

## Usage Guide

### Creating Your First Chapter

1. Sign up at `/auth` with your email and password
2. Click "Create Chapter" on the dashboard
3. Fill in the title, summary, and tags
4. Start adding content blocks (text, code, images, PDFs, links)

### Adding Content Blocks

Chapters support 5 types of content blocks:

- **Text**: Write notes, explanations, or documentation
- **Code**: Add code snippets with syntax highlighting
- **Image**: Upload images or handwritten notes
- **PDF**: Attach PDF documents
- **Link**: Add external references (docs, GitHub, videos)

### Organizing with Tags

Use tags to categorize your chapters. Tags are searchable and help you find related content quickly.

### Knowledge Graph

Access the Knowledge Graph from the dashboard to visualize connections between your chapters. Click and drag between nodes to create links, and click on any node to navigate to that chapter.

### Search

Use the search bar on the dashboard to find chapters by title, summary, or tags.

## License

MIT
