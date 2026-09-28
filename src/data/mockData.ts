/**
 * Mock data for byThursday Quiz Platform
 * Contains 4 teachers, ~60 students with Arabic names across classes 10A, 10B, 11A
 * Includes two 15-question quizzes (Arabic with negative marking, English without)
 */

import { Teacher, Student, Admin, ClassCode } from "../types/user";
import { Quiz, Question, QuizOption } from "../types/quiz";

// ============================================================================
// TEACHERS (4 teachers)
// ============================================================================

export const mockTeachers: Teacher[] = [
  {
    id: "teacher_001",
    name: "أ.د محمود علي",
    email: "mahmoud.ali@nourtutor.jo",
    role: "teacher",
    assignedClasses: ["10A", "10B"],
    subjects: ["Arabic", "Literature"],
    phoneNumber: "+962791234567",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "teacher_002",
    name: "أ.د فاطمة إسماعيل",
    email: "fatima.ismail@nourtutor.jo",
    role: "teacher",
    assignedClasses: ["10A", "11A"],
    subjects: ["English", "Grammar"],
    phoneNumber: "+962792234567",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "teacher_003",
    name: "أ.د خالد محمد",
    email: "khaled.mohammad@nourtutor.jo",
    role: "teacher",
    assignedClasses: ["10B", "11A"],
    subjects: ["Mathematics", "Science"],
    phoneNumber: "+962793234567",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "teacher_004",
    name: "أ.د ليلى أحمد",
    email: "layla.ahmad@nourtutor.jo",
    role: "teacher",
    assignedClasses: ["11A"],
    subjects: ["History", "Social Studies"],
    phoneNumber: "+962794234567",
    createdAt: new Date("2024-01-20"),
  },
];

// ============================================================================
// ADMIN (Nour - center manager)
// ============================================================================

export const mockAdmin: Admin = {
  id: "admin_001",
  name: "نور",
  email: "nour@nourtutor.jo",
  role: "admin",
  permissions: [
    "manage_users",
    "manage_quizzes",
    "view_analytics",
    "manage_content",
    "manage_classes",
  ],
  createdAt: new Date("2024-01-01"),
};

// ============================================================================
// STUDENTS (~60 students with Arabic names)
// ============================================================================

const arabicFirstNames = [
  "محمد",
  "أحمد",
  "علي",
  "خالد",
  "أسامة",
  "عمر",
  "إبراهيم",
  "سارة",
  "فاطمة",
  "ليلى",
  "نور",
  "هند",
  "رائد",
  "طارق",
  "ياسر",
  "حسن",
  "إسلام",
  "عائشة",
  "منى",
  "جمال",
  "زيد",
  "دينا",
  "رامي",
  "مريم",
  "نايف",
  "هبة",
  "ناصر",
  "جنى",
  "إياد",
  "سلوى",
  "سامي",
  "شهد",
  "إبراهيم",
  "دعاء",
  "طاهر",
  "ريم",
  "معتز",
  "أمل",
  "واصل",
  "رحيق",
  "تيسير",
  "عزيزة",
  "مجدي",
  "لينة",
  "وليد",
  "جميلة",
  "فادي",
  "نسرين",
  "سليم",
  "دلال",
];

const arabicLastNames = [
  "الخطيب",
  "الدعيس",
  "الحديدي",
  "الزيبي",
  "الراوي",
  "الطويل",
  "الصغير",
  "الكبير",
  "النجار",
  "الحارثي",
  "القاضي",
  "الشريف",
  "الشمري",
  "الدويري",
  "الحسناوي",
  "الفايدي",
  "الزعبي",
  "الدعجاني",
  "الرشيدي",
  "المجالي",
  "البخاري",
  "الجهني",
  "العقيلي",
  "الزقي",
];

function generateStudents(): Student[] {
  const students: Student[] = [];
  const classes: ClassCode[] = ["10A", "10B", "11A"];
  let studentCount = 0;

  for (const classCode of classes) {
    const studentsPerClass =
      classCode === "10A" ? 22 : classCode === "10B" ? 19 : 21;

    for (let i = 0; i < studentsPerClass; i++) {
      const firstName =
        arabicFirstNames[(studentCount * 7 + i) % arabicFirstNames.length];
      const lastName =
        arabicLastNames[(studentCount * 11 + i * 3) % arabicLastNames.length];

      students.push({
        id: `student_${String(studentCount + 1).padStart(3, "0")}`,
        name: `${firstName} ${lastName}`,
        email: `student${studentCount + 1}@nourtutor.jo`,
        role: "student",
        classCode,
        enrollmentDate: new Date(
          `2024-0${classCode.charAt(2) === "A" ? 1 : classCode.charAt(2) === "B" ? 2 : 3}-01`,
        ),
        createdAt: new Date(
          `2024-0${classCode.charAt(2) === "A" ? 1 : classCode.charAt(2) === "B" ? 2 : 3}-01`,
        ),
      });
      studentCount++;
    }
  }

  return students;
}

export const mockStudents = generateStudents();

// ============================================================================
// QUIZ 1: ARABIC LITERATURE (15 questions with negative marking)
// ============================================================================

const arabicQuizOptions: { [key: string]: QuizOption[] } = {
  q1: [
    { id: "opt_1_1", text: "الشاعر الجاهلي", isCorrect: true },
    { id: "opt_1_2", text: "الشاعر الإسلامي", isCorrect: false },
    { id: "opt_1_3", text: "الشاعر الأموي", isCorrect: false },
    { id: "opt_1_4", text: "الشاعر العباسي", isCorrect: false },
  ],
  q2: [
    { id: "opt_2_1", text: "ديوان الشعر", isCorrect: false },
    { id: "opt_2_2", text: "النثر", isCorrect: false },
    { id: "opt_2_3", text: "المقامة", isCorrect: true },
    { id: "opt_2_4", text: "القصيدة", isCorrect: false },
  ],
  q3: [
    { id: "opt_3_1", text: "الشعر الحديث", isCorrect: false },
    { id: "opt_3_2", text: "الشعر الكلاسيكي", isCorrect: false },
    { id: "opt_3_3", text: "الشعر الجاهلي", isCorrect: true },
    { id: "opt_3_4", text: "الشعر العمودي", isCorrect: false },
  ],
  q4: [
    { id: "opt_4_1", text: "الحب والغزل", isCorrect: false },
    { id: "opt_4_2", text: "المدح والهجاء", isCorrect: false },
    { id: "opt_4_3", text: "الفخر والحماسة", isCorrect: true },
    { id: "opt_4_4", text: "الزهد والتأمل", isCorrect: false },
  ],
  q5: [
    { id: "opt_5_1", text: "اثنا عشر بحراً", isCorrect: false },
    { id: "opt_5_2", text: "خمسة عشر بحراً", isCorrect: false },
    { id: "opt_5_3", text: "ستة عشر بحراً", isCorrect: true },
    { id: "opt_5_4", text: "ثمانية عشر بحراً", isCorrect: false },
  ],
  q6: [
    { id: "opt_6_1", text: "التشبيه والكناية", isCorrect: true },
    { id: "opt_6_2", text: "السجع والفاصلة", isCorrect: false },
    { id: "opt_6_3", text: "الجناس والطباق", isCorrect: false },
    { id: "opt_6_4", text: "الاستعارة والتورية", isCorrect: false },
  ],
  q7: [
    { id: "opt_7_1", text: "امرؤ القيس", isCorrect: true },
    { id: "opt_7_2", text: "الأعشى", isCorrect: false },
    { id: "opt_7_3", text: "زهير بن أبي سلمى", isCorrect: false },
    { id: "opt_7_4", text: "طرفة بن العبد", isCorrect: false },
  ],
  q8: [
    { id: "opt_8_1", text: "النثر", isCorrect: false },
    { id: "opt_8_2", text: "الشعر", isCorrect: true },
    { id: "opt_8_3", text: "المسرح", isCorrect: false },
    { id: "opt_8_4", text: "الرواية", isCorrect: false },
  ],
  q9: [
    { id: "opt_9_1", text: "اثنا عشر قصيدة", isCorrect: true },
    { id: "opt_9_2", text: "عشرة قصائد", isCorrect: false },
    { id: "opt_9_3", text: "خمس عشرة قصيدة", isCorrect: false },
    { id: "opt_9_4", text: "عشرون قصيدة", isCorrect: false },
  ],
  q10: [
    { id: "opt_10_1", text: "الصورة الشعرية", isCorrect: true },
    { id: "opt_10_2", text: "الإيقاع الموسيقي", isCorrect: false },
    { id: "opt_10_3", text: "الوزن والقافية", isCorrect: false },
    { id: "opt_10_4", text: "التقسيم والتقطيع", isCorrect: false },
  ],
  q11: [
    { id: "opt_11_1", text: "ذو القرنين", isCorrect: false },
    { id: "opt_11_2", text: "الخنساء", isCorrect: true },
    { id: "opt_11_3", text: "هند بنت عتبة", isCorrect: false },
    { id: "opt_11_4", text: "ليلى الأخيلية", isCorrect: false },
  ],
  q12: [
    { id: "opt_12_1", text: "الأدب الجاهلي", isCorrect: false },
    { id: "opt_12_2", text: "الأدب الإسلامي", isCorrect: true },
    { id: "opt_12_3", text: "الأدب الأموي", isCorrect: false },
    { id: "opt_12_4", text: "الأدب العباسي", isCorrect: false },
  ],
  q13: [
    { id: "opt_13_1", text: "المقامة", isCorrect: true },
    { id: "opt_13_2", text: "الرسالة", isCorrect: false },
    { id: "opt_13_3", text: "الخطبة", isCorrect: false },
    { id: "opt_13_4", text: "الحديث", isCorrect: false },
  ],
  q14: [
    { id: "opt_14_1", text: "الوصية", isCorrect: true },
    { id: "opt_14_2", text: "القصيدة", isCorrect: false },
    { id: "opt_14_3", text: "المسرحية", isCorrect: false },
    { id: "opt_14_4", text: "الرواية", isCorrect: false },
  ],
  q15: [
    { id: "opt_15_1", text: "خمسة عشر سنة", isCorrect: false },
    { id: "opt_15_2", text: "عشرون سنة", isCorrect: true },
    { id: "opt_15_3", text: "ثلاثون سنة", isCorrect: false },
    { id: "opt_15_4", text: "أربعون سنة", isCorrect: false },
  ],
};

const arabicQuestions: Question[] = [
  {
    id: "ar_q1",
    text: "إلى أي فترة زمنية ينتسب عنترة بن شداد؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q1,
    correctOptionId: "opt_1_1",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q2",
    text: "ما هي المقامة؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q2,
    correctOptionId: "opt_2_3",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q3",
    text: "أي من الأنواع الأدبية التالية ازدهرت في العصر الجاهلي؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q3,
    correctOptionId: "opt_3_3",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q4",
    text: "ما هو الموضوع الرئيسي لشعر المعلقات؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q4,
    correctOptionId: "opt_4_3",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q5",
    text: "كم عدد بحور الشعر العربي التقليدية؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q5,
    correctOptionId: "opt_5_3",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q6",
    text: "اذكر أساليب من البلاغة العربية:",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q6,
    correctOptionId: "opt_6_1",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q7",
    text: "أي الشعراء الجاهليين يُعتبر صاحب أشهر معلقة؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q7,
    correctOptionId: "opt_7_1",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q8",
    text: "ما هو النوع الأدبي الأكثر ازدهاراً في الجاهلية؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q8,
    correctOptionId: "opt_8_2",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q9",
    text: "كم عدد المعلقات المشهورة؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q9,
    correctOptionId: "opt_9_1",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q10",
    text: "ما أهم عنصر في القصيدة العربية القديمة؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q10,
    correctOptionId: "opt_10_1",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q11",
    text: "من الشاعرة التي تعتبر من أبرز شواعر الجاهلية؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q11,
    correctOptionId: "opt_11_2",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q12",
    text: "في أي عصر ازدهر فن الخطابة العربية؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q12,
    correctOptionId: "opt_12_2",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q13",
    text: "ما هي المقامة كفن نثري؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q13,
    correctOptionId: "opt_13_1",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q14",
    text: "ما هي أهم أنواع النثر العربي القديم؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q14,
    correctOptionId: "opt_14_1",
    points: 5,
    negativeMarks: 1,
  },
  {
    id: "ar_q15",
    text: "كم استغرقت رحلة الشاعر الجاهلي؟",
    language: "ar",
    type: "multiple_choice",
    options: arabicQuizOptions.q15,
    correctOptionId: "opt_15_2",
    points: 5,
    negativeMarks: 1,
  },
];

export const mockArabicQuiz: Quiz = {
  id: "quiz_ar_001",
  title: "أدب الجاهلية - اختبار شامل",
  description: "اختبار شامل عن الأدب الجاهلي والعصر الجاهلي",
  subject: "Arabic Literature",
  language: "ar",
  classCode: "10A",
  questions: arabicQuestions,
  config: {
    durationMinutes: 20,
    negativeMarking: true,
    negativeMarksPerQuestion: 1,
    singleSubmission: true,
  },
  createdBy: "teacher_001",
  createdAt: new Date("2024-09-01"),
  openDate: new Date(),
  closeDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  totalPoints: 75,
  isActive: true,
};

// ============================================================================
// QUIZ 2: ENGLISH GRAMMAR (15 questions without negative marking)
// ============================================================================

const englishQuizOptions: { [key: string]: QuizOption[] } = {
  q1: [
    { id: "en_opt_1_1", text: "Present Simple", isCorrect: true },
    { id: "en_opt_1_2", text: "Present Continuous", isCorrect: false },
    { id: "en_opt_1_3", text: "Past Simple", isCorrect: false },
    { id: "en_opt_1_4", text: "Future Simple", isCorrect: false },
  ],
  q2: [
    { id: "en_opt_2_1", text: "Noun", isCorrect: false },
    { id: "en_opt_2_2", text: "Verb", isCorrect: false },
    { id: "en_opt_2_3", text: "Adjective", isCorrect: true },
    { id: "en_opt_2_4", text: "Adverb", isCorrect: false },
  ],
  q3: [
    { id: "en_opt_3_1", text: "Singular", isCorrect: false },
    { id: "en_opt_3_2", text: "Plural", isCorrect: true },
    { id: "en_opt_3_3", text: "Collective", isCorrect: false },
    { id: "en_opt_3_4", text: "Abstract", isCorrect: false },
  ],
  q4: [
    { id: "en_opt_4_1", text: "Subject", isCorrect: true },
    { id: "en_opt_4_2", text: "Object", isCorrect: false },
    { id: "en_opt_4_3", text: "Predicate", isCorrect: false },
    { id: "en_opt_4_4", text: "Complement", isCorrect: false },
  ],
  q5: [
    { id: "en_opt_5_1", text: "Verb phrase", isCorrect: false },
    { id: "en_opt_5_2", text: "Noun phrase", isCorrect: true },
    { id: "en_opt_5_3", text: "Adjectival phrase", isCorrect: false },
    { id: "en_opt_5_4", text: "Prepositional phrase", isCorrect: false },
  ],
  q6: [
    { id: "en_opt_6_1", text: "Coordinating", isCorrect: true },
    { id: "en_opt_6_2", text: "Subordinating", isCorrect: false },
    { id: "en_opt_6_3", text: "Correlative", isCorrect: false },
    { id: "en_opt_6_4", text: "Interjective", isCorrect: false },
  ],
  q7: [
    { id: "en_opt_7_1", text: "Transitive", isCorrect: true },
    { id: "en_opt_7_2", text: "Intransitive", isCorrect: false },
    { id: "en_opt_7_3", text: "Linking", isCorrect: false },
    { id: "en_opt_7_4", text: "Auxiliary", isCorrect: false },
  ],
  q8: [
    { id: "en_opt_8_1", text: "Modifies nouns", isCorrect: true },
    { id: "en_opt_8_2", text: "Modifies verbs", isCorrect: false },
    { id: "en_opt_8_3", text: "Connects words", isCorrect: false },
    { id: "en_opt_8_4", text: "Expresses action", isCorrect: false },
  ],
  q9: [
    { id: "en_opt_9_1", text: "First person", isCorrect: false },
    { id: "en_opt_9_2", text: "Second person", isCorrect: false },
    { id: "en_opt_9_3", text: "Third person", isCorrect: true },
    { id: "en_opt_9_4", text: "Fourth person", isCorrect: false },
  ],
  q10: [
    { id: "en_opt_10_1", text: "Relative", isCorrect: true },
    { id: "en_opt_10_2", text: "Personal", isCorrect: false },
    { id: "en_opt_10_3", text: "Possessive", isCorrect: false },
    { id: "en_opt_10_4", text: "Demonstrative", isCorrect: false },
  ],
  q11: [
    { id: "en_opt_11_1", text: "Declarative", isCorrect: false },
    { id: "en_opt_11_2", text: "Interrogative", isCorrect: true },
    { id: "en_opt_11_3", text: "Imperative", isCorrect: false },
    { id: "en_opt_11_4", text: "Exclamatory", isCorrect: false },
  ],
  q12: [
    { id: "en_opt_12_1", text: "Hyperbole", isCorrect: false },
    { id: "en_opt_12_2", text: "Metaphor", isCorrect: true },
    { id: "en_opt_12_3", text: "Oxymoron", isCorrect: false },
    { id: "en_opt_12_4", text: "Alliteration", isCorrect: false },
  ],
  q13: [
    { id: "en_opt_13_1", text: "Conditional", isCorrect: true },
    { id: "en_opt_13_2", text: "Temporal", isCorrect: false },
    { id: "en_opt_13_3", text: "Causal", isCorrect: false },
    { id: "en_opt_13_4", text: "Concessive", isCorrect: false },
  ],
  q14: [
    { id: "en_opt_14_1", text: "Present participle", isCorrect: false },
    { id: "en_opt_14_2", text: "Gerund", isCorrect: true },
    { id: "en_opt_14_3", text: "Infinitive", isCorrect: false },
    { id: "en_opt_14_4", text: "Past participle", isCorrect: false },
  ],
  q15: [
    { id: "en_opt_15_1", text: "Four", isCorrect: false },
    { id: "en_opt_15_2", text: "Five", isCorrect: true },
    { id: "en_opt_15_3", text: "Six", isCorrect: false },
    { id: "en_opt_15_4", text: "Seven", isCorrect: false },
  ],
};

const englishQuestions: Question[] = [
  {
    id: "en_q1",
    text: "Which tense is used for habitual actions?",
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q1,
    correctOptionId: "en_opt_1_1",
    points: 5,
  },
  {
    id: "en_q2",
    text: "What part of speech describes a noun?",
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q2,
    correctOptionId: "en_opt_2_3",
    points: 5,
  },
  {
    id: "en_q3",
    text: 'The word "children" is an example of which number?',
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q3,
    correctOptionId: "en_opt_3_2",
    points: 5,
  },
  {
    id: "en_q4",
    text: 'In the sentence "She plays tennis", what is "she"?',
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q4,
    correctOptionId: "en_opt_4_1",
    points: 5,
  },
  {
    id: "en_q5",
    text: 'What is "the tall building" an example of?',
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q5,
    correctOptionId: "en_opt_5_2",
    points: 5,
  },
  {
    id: "en_q6",
    text: 'What type of conjunction is "and"?',
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q6,
    correctOptionId: "en_opt_6_1",
    points: 5,
  },
  {
    id: "en_q7",
    text: 'The verb "ate" in "She ate an apple" is:',
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q7,
    correctOptionId: "en_opt_7_1",
    points: 5,
  },
  {
    id: "en_q8",
    text: "What does an adjective do?",
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q8,
    correctOptionId: "en_opt_8_1",
    points: 5,
  },
  {
    id: "en_q9",
    text: 'In "He went to the store", "he" is which person?',
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q9,
    correctOptionId: "en_opt_9_3",
    points: 5,
  },
  {
    id: "en_q10",
    text: 'Which pronoun is used in "The book that I read was good"?',
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q10,
    correctOptionId: "en_opt_10_1",
    points: 5,
  },
  {
    id: "en_q11",
    text: 'What type of sentence is "What time is it?"?',
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q11,
    correctOptionId: "en_opt_11_2",
    points: 5,
  },
  {
    id: "en_q12",
    text: 'What figure of speech is "The world is a stage"?',
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q12,
    correctOptionId: "en_opt_12_2",
    points: 5,
  },
  {
    id: "en_q13",
    text: 'What type of clause is "If you study hard"?',
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q13,
    correctOptionId: "en_opt_13_1",
    points: 5,
  },
  {
    id: "en_q14",
    text: '"Reading is fun" - what is "reading" in this sentence?',
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q14,
    correctOptionId: "en_opt_14_2",
    points: 5,
  },
  {
    id: "en_q15",
    text: "How many basic tenses are there in English?",
    language: "en",
    type: "multiple_choice",
    options: englishQuizOptions.q15,
    correctOptionId: "en_opt_15_2",
    points: 5,
  },
];

export const mockEnglishQuiz: Quiz = {
  id: "quiz_en_001",
  title: "English Grammar Fundamentals",
  description:
    "Comprehensive test on English grammar basics and sentence structure",
  subject: "English Grammar",
  language: "en",
  classCode: "10B",
  questions: englishQuestions,
  config: {
    durationMinutes: 20,
    negativeMarking: false,
    negativeMarksPerQuestion: 0,
    singleSubmission: true,
  },
  createdBy: "teacher_002",
  createdAt: new Date("2024-09-05"),
  openDate: new Date(),
  closeDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  totalPoints: 75,
  isActive: true,
};

// ============================================================================
// EXPORT ALL MOCK DATA
// ============================================================================

export const mockData = {
  teachers: mockTeachers,
  admin: mockAdmin,
  students: mockStudents,
  quizzes: [mockArabicQuiz, mockEnglishQuiz],
};
