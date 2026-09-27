#!/bin/bash
# Git Commands for Phase 3 - Teacher & Admin Dashboard
# Run these commands from the project root (D:\bythursday)

# ============================================================================
# SETUP: Create new branch for Phase 3
# ============================================================================

echo "Creating Phase 3 branch..."
git checkout -b phase/3-teacher-dashboard

# ============================================================================
# STAGE: Add all Phase 3 files
# ============================================================================

echo "Staging Phase 3 files..."

# Context
git add src/context/TeacherContext.tsx

# Teacher pages
git add src/app/teacher/login/page.tsx
git add src/app/teacher/dashboard/page.tsx
git add src/app/teacher/dashboard/create-quiz/page.tsx
git add "src/app/teacher/dashboard/results/\[quizId\]/page.tsx"

# Updated layout
git add src/app/layout.tsx

# Documentation
git add PHASE_3_SUMMARY.md
git add GIT_PHASE3_COMMANDS.txt

# ============================================================================
# COMMIT: Detailed commit message
# ============================================================================

echo "Committing Phase 3 implementation..."

git commit -m "feat: Phase 3 - Teacher & Admin dashboard with quiz analytics

ADD NEW FEATURES:
- TeacherContext: Global React Context for teacher state management
- Teacher Login: Teacher selection with quick-pick and ID search
- Dashboard Overview: Quiz performance by class with analytics
- Student Results Table: Detailed submissions with filtering/sorting
- Quiz Creation Form: Full quiz builder with dynamic questions

IMPLEMENT CORE FEATURES:
✓ Dashboard showing performance metrics by class (10A, 10B, 11A):
  - Student count per class
  - Total submissions and attempt rate
  - Average score and percentage
  - Pass rate with progress bar
✓ Student Results Table with:
  - Student name, ID, score, percentage
  - Pass/Fail status with color coding
  - Submission time and time taken
  - Filtering by status (pass/fail/pending)
  - Sorting by score, name, or time taken
  - CSV export button (ready for implementation)
✓ Quiz Creation Form allowing teachers to:
  - Set quiz title, description, subject
  - Choose target class (10A, 10B, 11A)
  - Select language (English/Arabic)
  - Configure duration and date range
  - Toggle negative marking with custom points
  - Add/remove questions dynamically
  - Set points per question
  - Define 4 options with correct answer selection
  - Form validation before submission

PAGES CREATED:
- /teacher/login: Teacher authentication
- /teacher/dashboard: Overview and analytics
- /teacher/dashboard/results/[quizId]: Student submissions table
- /teacher/dashboard/create-quiz: Quiz builder form

COMPONENTS:
- TeacherProvider: React Context for teacher state
- Teacher Login: Account selection UI
- Dashboard: Performance cards and recent quizzes
- Results Table: Sortable/filterable submissions
- Quiz Form: Dynamic question builder

DATA VISUALIZATION:
- Class performance cards with pass rates
- Quick stats grid (quizzes, submissions, classes, completion)
- Recent quizzes list with submission counts
- Student results table with status indicators
- Average score and pass rate calculations

FORM VALIDATION:
- Required field checking
- Date range validation
- Question text and option validation
- Correct answer requirement per question
- Minimum question count (1)

STATE MANAGEMENT:
- TeacherContext stores current teacher
- Quiz creation adds to allQuizzes state
- Attempt tracking in allAttempts state
- Form state management for dynamic questions

FEATURES:
✓ Responsive design for desktop and tablet
✓ Color-coded performance indicators (green/red/yellow)
✓ Quick teacher selection from roster
✓ Manual teacher ID search
✓ Real-time form validation
✓ Dynamic question addition/removal
✓ Option sorting by points/name/time
✓ Pass/fail calculation (60% threshold)
✓ Time duration formatting (MM:SS)
✓ Export CSV ready (button present)

STYLING:
- Consistent with Phase 2 design
- Blue/purple gradient headers
- Card-based layout
- Responsive tables
- Touch-friendly controls
- Status color coding (green/red/yellow)

CALCULATIONS:
- Average score per class
- Average percentage (0-100)
- Pass rate percentage
- Time taken per submission
- Total submission count
- Completion rate

NAVIGATION:
- Back buttons to dashboard
- Create quiz button in header
- Results link from dashboard
- Logout in header

ACCESSIBILITY:
- Semantic HTML tables
- Form labels with proper associations
- Keyboard navigation support
- High contrast status indicators
- Screen reader friendly"

# ============================================================================
# SECTION: PUSH TO REMOTE
# ============================================================================

echo "Pushing Phase 3 branch to remote..."
git push -u origin phase/3-teacher-dashboard

# ============================================================================
# OPTIONAL: Create Pull Request (GitHub CLI)
# ============================================================================

echo ""
echo "✅ Phase 3 committed and pushed successfully!"
echo ""
echo "Optional: Create a Pull Request on GitHub:"
echo ""
echo "  gh pr create --title \"Phase 3: Teacher Dashboard & Quiz Analytics\" \\"
echo "    --body \"Teacher dashboard with quiz performance analytics and quiz creation\""
echo ""
echo "Or merge to main:"
echo ""
echo "  git checkout main"
echo "  git merge phase/3-teacher-dashboard"
echo "  git push origin main"
