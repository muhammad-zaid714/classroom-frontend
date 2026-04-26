import { Subject } from "@/types";
export const SUBJECTS_MOCK_DATA:Subject[] = [
  {
    id: 1,
    code: "CS101",
    department: "CS",
    name: "Introduction to Computer Science",
    description:
      "Foundational course covering algorithms, problem-solving, and basic software development practices.",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    code: "MATH201",
    department: "Math",
    name: "Linear Algebra",
    description:
      "Studies vectors, matrices, and linear transformations with applications in data science and engineering.",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    code: "PHYS150",
    department: "Physics",
    name: "Classical Mechanics",
    description:
      "Introduces motion, force, and energy through analytical models and practical problem-solving.",
    created_at: new Date().toISOString()
  },
];
