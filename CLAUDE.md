Role & Objective:
Act as a Senior Full-Stack Engineer and Elite UI/UX Designer. Build a production-grade, highly responsive, and fully functional AI SaaS Web Application.

Tech Stack & Architecture:

- Framework: Next.js 14/15 (App Router, TypeScript)
- Styling: Tailwind CSS, Lucide-React icons, Framer Motion for smooth micro-interactions
- UI Components: Shadcn/ui (Cards, Dialog, Tabs, Dropdowns, Tooltips, Accordions, Sheet)
- State & Forms: React Hook Form + Zod, Zustand / React Context
- Syntax Highlighting: react-syntax-highlighter (with modern dark theme support like atom-dark or vsc-dark-plus)
- Notifications: Sonner (toast notifications)

Design & Aesthetics (Calm, Modern & Sleek):

- Tone: Clean, minimalist, modern dark/light balanced aesthetic.
- Color Palette:
  - Background: Soft neutral slate/zinc tones (`bg-[#0B0F17]` for dark mode, `bg-[#F8FAFC]` for light mode)
  - Surfaces/Cards: Subtle translucent glassmorphism (`backdrop-blur-md bg-white/5 border border-white/10`)
  - Accent/Primary: Soft Indigo / Electric Violet with subtle pastel gradients (`#6366F1` to `#8B5CF6`)
  - Secondary/Accents: Muted Teal / Cyan for active states (`#06B6D4` / `#10B981`)
  - Text: High contrast readable hierarchy (Slate-100 primary, Slate-400 secondary)
- Typography: Clean sans-serif (Inter / Geist Sans) with crisp line-heights and comfortable whitespace.

Key Functional Modules & User Flow:

1. Landing & Showcase:
   - Modern hero section with animated gradient badge ("AI Powered v2.0").
   - Interactive live preview/playground banner demonstrating real-time AI response.
   - Core feature cards with hover glow effects and icon accents.
   - Transparent pricing comparison matrix with monthly/annual toggle.

2. Authentication & Onboarding:
   - Mock/real auth flow (Sign in with Google / Email magic link).
   - User profile dropdown with usage tier, avatar, and settings modal.

3. AI Playground & Workspace (Core Functionality):
   - Left Sidebar:
     - Collapsible session history with active chat highlights, delete/rename actions.
     - Model selector dropdown (e.g., GPT-4o, Claude 3.5 Sonnet, Custom Fast Mode).
     - Live token and credit consumption meter.
   - Main Chat/Generation Stream:
     - Distinct, elegant chat bubbles for User and AI responses.
     - Realistic Token Streaming: Implement a robust Mock Streamer using ReadableStream or an async word-by-word generator with realistic delays so typing feels natural even without an active API key.
     - Rich Markdown & Code Blocks: Render code snippets using react-syntax-highlighter with language labels and an instant "Copy Code" button showing feedback toasts.
     - Quick Prompt Suggestion Chips (e.g., "Summarize article", "Code debugger", "Draft proposal").
     - Multi-modal Input Bar: Textarea with auto-resizing, file/image upload button, voice input trigger, and standard keyboard shortcuts (Enter to send, Shift+Enter for newline).
     - Response Toolbar: Action buttons to Copy, Regenerate, Thumbs up/down, and Share snippet.

4. Client-Side Persistence & Storage:
   - Automatic local synchronization: Save all active chats, thread history, and model parameters into `localStorage` (or IndexedDB) so data survives page refreshes and browser restarts.

5. Utility & Settings Dashboard:
   - API Key manager (allowing custom keys or default mock engine).
   - Parameter sliders drawer for Temperature, System Prompt, and Max Tokens.
   - Usage statistics panel showing request counts and token history.

Implementation Rules:

- Complete Code: Do not output placeholder comments like "// implement here". Write working state logic, mock streaming routines, and robust error handling.
- Mobile First & Accessible: Fully responsive navigation (mobile drawer), keyboard accessible, and RTL-ready layout.
- Production Polish: Include loading skeletons, empty states, and toast notifications for all user actions.
