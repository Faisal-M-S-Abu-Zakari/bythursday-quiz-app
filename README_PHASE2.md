# byThursday - Quiz Assessment Platform

Mobile-first quiz platform for Nour tutoring centre in Amman, built with Next.js 15, TypeScript, Tailwind CSS, and full Arabic/RTL support.

## Project Overview

**Vision**: Production-ready practical assessment platform supporting 3 distinct user roles (Student, Teacher, Admin) with realistic Jordanian tutoring data across classes 10A, 10B, 11A.

**Tech Stack**:
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS (mobile-first)
- Lucide React (icons)
- React Context (state management)

## Phase Breakdown

### Phase 1: Core Schemas & Mock Data ✅
- User types (Student, Teacher, Admin) with role-based permissions
- Quiz types with configurable scoring (positive/negative marking)
- Scoring engine with negative marking support
- Mock data: 4 teachers, 62 students (Arabic names), 2 quizzes

### Phase 2: Student Quiz Taking Experience ✅
- Login page with class selection and student search
- Quiz listing showing availability, duration, points
- Interactive quiz interface with live timer, RTL support, mobile-responsive
- Instant results screen with score breakdown

### Phase 3: Teacher Dashboard (Planned)
- Quiz creation and management
- Student submissions view
- Analytics and reports

## Getting Started

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

**Demo Login**: Select any student from Class 10A, 10B, or 11A

## Git Commands for Phase 2

```bash
# Stage all Phase 2 files
git add src/context/ src/components/QuizTimer.tsx src/lib/utils.ts
git add src/app/layout.tsx src/app/page.tsx src/app/quizzes/ src/app/results/
git add src/app/globals.css tailwind.config.js postcss.config.js tsconfig.json package.json

# Commit with detailed message
git commit -m "feat: Phase 2 - Student quiz taking experience (mobile-first, RTL-ready)

- Add StudentContext for global student state management
- Implement login page with class selection and student search
- Create quiz listing page with time remaining display
- Build interactive quiz interface with features:
  * Live countdown timer (auto-submit when expired)
  * Full Arabic/RTL support for all content
  * Mobile-responsive layout optimized for phones
  * Single-submission enforcement
  * Progress tracking across questions
- Design instant results screen with score breakdown:
  * Total score and percentage
  * Correct vs wrong answer counts
  * Negative marking deductions display
  * Performance level indicator (excellent/good/fair/poor)
- Add QuizTimer component with warning states
- Add utility functions for RTL, time formatting, validation
- Configure Tailwind CSS with custom colors
- Set up TypeScript with path aliases (@/*)
- Update package.json with Next.js 15, React 19, Tailwind, Lucide

UX Features:
- Mobile-first design with touch-friendly buttons (48px+)
- Full RTL support for Arabic with automatic direction detection
- Sticky timer header during quiz taking
- Question number indicator with answered/unanswered states
- Smooth transitions and animations
- Clear visual feedback for selection and validation"

# Push to remote with new branch
git push -u origin phase/2-student-experience
```

## Key Features

✅ **Mobile-First Design** - Touch-friendly, 320px+ screens  
✅ **Arabic/RTL Support** - Full right-to-left layout  
✅ **Live Timer** - Auto-submit when time expires  
✅ **Scoring Engine** - Configurable points & negative marking  
✅ **Single Submission** - Prevent retakes  
✅ **Results Analytics** - Instant score breakdown  
✅ **TypeScript Strict** - 100% type-safe code  

---

**Version**: 0.2.0 | **Status**: Phase 2 Complete | **Updated**: Sep 2026
