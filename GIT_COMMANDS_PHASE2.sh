#!/bin/bash
# Git Commands for Phase 2 - Student Quiz Taking Experience
# Run these commands from the project root (D:\bythursday)

# ============================================================================
# SETUP: Create new branch for Phase 2
# ============================================================================

echo "Creating Phase 2 branch..."
git checkout -b phase/2-student-experience

# ============================================================================
# STAGE: Add all Phase 2 files
# ============================================================================

echo "Staging Phase 2 files..."

# Context and state management
git add src/context/StudentContext.tsx

# Components
git add src/components/QuizTimer.tsx

# Utility functions
git add src/lib/utils.ts

# App pages and layout
git add src/app/layout.tsx
git add src/app/page.tsx
git add src/app/quizzes/page.tsx
git add src/app/quizzes/\[id\]/page.tsx
git add src/app/results/\[attemptId\]/page.tsx

# Styles
git add src/app/globals.css

# Configuration files
git add tailwind.config.js
git add postcss.config.js
git add tsconfig.json

# Package files
git add package.json

# Documentation
git add PHASE_2_SUMMARY.md
git add README_PHASE2.md

# ============================================================================
# COMMIT: Detailed commit message
# ============================================================================

echo "Committing Phase 2 implementation..."

git commit -m "feat: Phase 2 - Student quiz taking experience (mobile-first, RTL-ready)

FEATURES:
- Add StudentContext for global student state management across app
- Implement comprehensive login page with:
  * Class-based student filtering (10A, 10B, 11A)
  * Quick-select from class roster
  * Manual student ID search with validation
- Create quiz listing page showing:
  * Available quizzes filtered by student's class
  * Quiz metadata (title, questions, duration, points)
  * Time remaining until quiz closes
  * Negative marking warnings
  * Availability status and date ranges
- Build interactive quiz taking interface featuring:
  * Live countdown timer with auto-submit on expiry
  * Full Arabic/RTL support for questions and answers
  * Mobile-responsive layout optimized for phones
  * Single-submission enforcement (no retakes)
  * Question-by-question navigation
  * Progress tracking with visual indicator
  * Answer selection with visual feedback
- Design instant results screen with complete score breakdown:
  * Total score and percentage calculation
  * Correct vs wrong answer counts with progress bars
  * Negative marking deductions display
  * Performance level indicator (excellent/good/fair/poor)
  * Detailed statistics grid
  * Quiz metadata review

COMPONENTS:
- QuizTimer: Live countdown with warning states (red when < 5 min)
- StudentProvider: React Context for student state
- Login Page: Class/ID selection with mock data integration
- Quiz Listing: Available quizzes with date/time display
- Quiz Interface: Full question/answer UI with RTL support
- Results Page: Score breakdown with analytics

UTILITIES:
- getTextDirection(): Determine RTL vs LTR
- getRTLClasses(): Generate RTL-compatible Tailwind classes
- isQuizAvailable(): Check quiz availability window
- getQuizTimeRemaining(): Calculate days until deadline
- formatTimeRemaining(): Format MM:SS display
- hasStudentSubmitted(): Prevent retakes
- getStudentById(): Mock data lookup
- generateAttemptId(): Unique attempt identifier
- isValidStudentId(): Student ID format validation

STYLING:
- Configure Tailwind CSS with custom indigo palette
- Mobile-first responsive breakpoints
- RTL-aware flexbox and spacing utilities
- PostCSS for vendor prefixes
- Smooth animations and transitions
- Accessibility support (reduced motion, high contrast)
- Touch-friendly buttons (48px minimum)

TYPE SAFETY:
- TypeScript strict mode enabled
- Path aliases configured (@/*)
- All functions fully typed
- StudentQuizAttempt and Quiz types from Phase 1
- React Context typed with proper interfaces

ACCESSIBILITY:
- Semantic HTML elements
- ARIA labels for dynamic content
- Keyboard navigation support
- Screen reader friendly
- High contrast color combinations
- Reduced motion support

UX IMPROVEMENTS:
- Sticky timer visible during quiz taking
- Question number grid for quick navigation (mobile)
- Visual distinction for answered/unanswered questions
- Clear navigation buttons with icons
- Performance-based congratulatory messaging
- Error states and validation feedback
- Loading states during transitions

DEPENDENCIES UPDATED:
- next@15.0.0
- react@19.0.0
- tailwindcss@3.3.6
- lucide-react@0.294.0

DATA FLOW:
1. Student logs in via page.tsx (class selection or ID entry)
2. StudentContext stores current student globally
3. Quiz listing loaded from mockData filtered by class
4. Quiz attempt created with unique ID
5. Answers collected via state management
6. Timer triggers auto-submit on expiry
7. Scoring engine calculates score with negative marks
8. Attempt stored in sessionStorage
9. Results page displays comprehensive breakdown

CONFIGURATION:
- tsconfig.json: Strict TypeScript with @ path alias
- tailwind.config.js: Custom color palette
- postcss.config.js: Tailwind + Autoprefixer
- globals.css: RTL support and animations

MOBILE OPTIMIZATION:
- Responsive from 320px mobile screens
- Touch-friendly 48px+ minimum buttons
- Optimized font sizes for readability
- Single column layout on mobile
- Sticky headers and footers
- Efficient asset loading

TESTING NOTES:
- Demo students available across all classes
- Mock data includes 2 quizzes (Arabic with negative marking, English without)
- Time limits enforced (20 min per quiz)
- Single submission per student enforced
- Results persist in sessionStorage during session"

# ============================================================================
# PUSH: Send to remote repository
# ============================================================================

echo "Pushing Phase 2 branch to remote..."
git push -u origin phase/2-student-experience

# ============================================================================
# OPTIONAL: Create Pull Request (GitHub CLI)
# ============================================================================

echo ""
echo "✅ Phase 2 committed and pushed successfully!"
echo ""
echo "Optional: Create a Pull Request on GitHub:"
echo ""
echo "  gh pr create --title \"Phase 2: Student Quiz Taking Experience\" \\"
echo "    --body \"Mobile-first, RTL-ready quiz interface\""
echo ""
echo "Or merge to main:"
echo ""
echo "  git checkout main"
echo "  git merge phase/2-student-experience"
echo "  git push origin main"
