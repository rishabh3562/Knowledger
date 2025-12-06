<div align="center">

# 📚 Knowledger

**Your Personal Knowledge Hub**

Organize everything you learn into unified, searchable chapters with rich content blocks and visual knowledge mapping.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Demo](https://knowledger.vercel.app) • [Report Bug](https://github.com/rishabh3562/Knowledger/issues) • [Request Feature](https://github.com/rishabh3562/Knowledger/issues)

</div>

---

## ✨ Features

### 📖 Chapter Management
- Create unlimited chapters to organize your knowledge
- Add titles, summaries, and tags for easy categorization
- Search across all chapters in real-time

### 🧩 Rich Content Blocks
- **📝 Text Blocks**: Write notes, explanations, or documentation
- **💻 Code Blocks**: Add syntax-highlighted code snippets with copy functionality
- **🖼️ Image Blocks**: Upload images or handwritten notes (up to 10MB)
- **📄 PDF Blocks**: Attach PDF documents (up to 50MB)
- **🔗 Link Blocks**: Reference external resources (docs, GitHub, videos)

### 🔄 Drag & Drop Interface
- Reorder content blocks with smooth drag-and-drop
- Real-time position updates
- Intuitive block management

### 🕸️ Knowledge Graph
- Visualize connections between chapters
- Interactive graph with React Flow
- Click nodes to navigate between chapters
- Create links by dragging between nodes

### 🔐 Secure & Personal
- Email/password authentication via Supabase Auth
- Row Level Security (RLS) ensures your data is private
- User-specific file storage

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **File Storage** | Supabase Storage |
| **UI Library** | Shadcn UI + Tailwind CSS |
| **Drag & Drop** | @dnd-kit |
| **Graph Visualization** | React Flow |
| **State Management** | TanStack Query |
| **Deployment** | Vercel |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rishabh3562/Knowledger.git
   cd Knowledger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the migration:
     - Copy contents from `supabase/migrations/20240101000000_initial_schema.sql`
     - Paste and execute in Supabase SQL Editor

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

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

## 📖 Usage

1. **Sign up** at `/auth` with your email and password
2. **Create a chapter** by clicking "Create Chapter"
3. **Add content blocks** - text, code, images, PDFs, or links
4. **Organize with tags** for easy searching
5. **Link chapters** together in the Knowledge Graph
6. **Search** across all your content instantly

## 🗂️ Project Structure

```
Knowledger/
├── src/
│   ├── app/
│   │   ├── api/              # API routes (chapters, blocks, links, upload)
│   │   ├── auth/             # Authentication page
│   │   ├── chapters/         # Chapter pages (list, create, [id])
│   │   ├── graph/            # Knowledge graph visualization
│   │   └── layout.tsx        # Root layout with providers
│   ├── components/
│   │   ├── editor/           # Block components (Text, Code, Image, PDF, Link)
│   │   ├── ui/               # Shadcn UI components
│   │   ├── FileUpload.tsx    # File upload component
│   │   └── KnowledgeGraph.tsx # React Flow graph
│   └── lib/
│       ├── auth.ts           # Server-side auth utilities
│       ├── supabase.ts       # Supabase client & types
│       └── utils.ts          # Helper functions
├── supabase/
│   └── migrations/           # Database schema
└── public/                   # Static assets
```

## 🌟 Roadmap

- [ ] Rich text editor (WYSIWYG)
- [ ] Markdown support
- [ ] Export chapters as PDF/Markdown
- [ ] Mobile app
- [ ] Collaboration features
- [ ] AI-powered summaries
- [ ] OCR for handwritten notes
- [ ] Browser extension

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Rishabh Dubey**

- GitHub: [@rishabh3562](https://github.com/rishabh3562)

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

<div align="center">
Made with ❤️ by Rishabh Dubey
</div>
