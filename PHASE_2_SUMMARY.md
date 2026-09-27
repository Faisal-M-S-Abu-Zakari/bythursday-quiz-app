/**
 * Phase 2 - Student Quiz Taking Experience
 * 
 * This phase implements the complete student-facing quiz interface with:
 * - Login/user selection (by class or student ID)
 * - Quiz listing with availability and time remaining
 * - Interactive quiz interface with live timer
 * - Full Arabic/RTL support
 * - Mobile-first responsive design
 * - Instant results screen with score breakdown
 * - Single-submission enforcement
 * 
 * Files created:
 * - src/context/StudentContext.tsx: React Context for student state
 * - src/lib/utils.ts: Utility functions (RTL, formatting, validation)
 * - src/components/QuizTimer.tsx: Live countdown timer component
 * - src/app/layout.tsx: Root layout with StudentProvider
 * - src/app/page.tsx: Login/user selection page
 * - src/app/quizzes/page.tsx: Quiz listing page
 * - src/app/quizzes/[id]/page.tsx: Quiz taking interface
 * - src/app/results/[attemptId]/page.tsx: Results page
 * - src/app/globals.css: Global styles with Tailwind
 * - tailwind.config.js: Tailwind CSS configuration
 * - postcss.config.js: PostCSS configuration
 * - tsconfig.json: TypeScript configuration
 * 
 * Git commits:
 * 
 * 1. Create a new branch:
 *    git checkout -b phase/2-student-experience
 * 
 * 2. Stage all Phase 2 files:
 *    git add src/context/ src/components/QuizTimer.tsx src/lib/utils.ts
 *    git add src/app/layout.tsx src/app/page.tsx src/app/quizzes/ src/app/results/
 *    git add src/app/globals.css tailwind.config.js postcss.config.js tsconfig.json
 *    git add package.json
 * 
 * 3. Commit with detailed message:
 *    git commit -m "feat: Phase 2 - Student quiz taking experience (mobile-first, RTL-ready)
 * 
 * - Add StudentContext for global student state management
 * - Implement login page with class selection and student search
 * - Create quiz listing page showing available quizzes with time remaining
 * - Build interactive quiz interface with features:
 *   * Live countdown timer (auto-submit when expired)
 *   * Full Arabic/RTL support for all quiz content
 *   * Mobile-responsive layout optimized for phones
 *   * Single-submission enforcement
 *   * Progress tracking across questions
 * - Design instant results screen with score breakdown:
 *   * Total score and percentage
 *   * Correct vs wrong answer counts
 *   * Negative marking deductions display
 *   * Performance level indicator
 * - Add QuizTimer component with warning states
 * - Add utility functions for RTL, time formatting, student validation
 * - Configure Tailwind CSS with custom colors and responsive breakpoints
 * - Set up TypeScript with path aliases (@/*)
 * - Update package.json with Next.js 15, React 19, Tailwind, Lucide
 * 
 * UX Features:
 * - Mobile-first design with touch-friendly buttons (48px minimum)
 * - Full RTL support for Arabic with automatic direction detection
 * - Sticky timer header visible during quiz taking
 * - Question number indicator with answered/unanswered states
 * - Smooth transitions and animations
 * - Clear visual feedback for selection and validation
 * - Performance messaging (excellent/good/fair/poor)
 * - No retake option after submission
 * 
 * Data Flow:
 * 1. Student logs in via page.tsx (select class or enter ID)
 * 2. StudentContext stores current student
 * 3. Quiz listing loaded from mockData filtered by class
 * 4. Quiz attempt created and stored in sessionStorage
 * 5. Results calculated using scoring.ts functions
 * 6. Results page displays score breakdown and analytics"
 * 
 * 4. Push to remote:
 *    git push -u origin phase/2-student-experience
 * 
 * 5. Create Pull Request (if using GitHub):
 *    gh pr create --title "Phase 2: Student Quiz Taking Experience" \
 *      --body "Mobile-first, RTL-ready quiz interface for students"
 */
