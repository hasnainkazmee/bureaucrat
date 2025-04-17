export const mockUser = {
  id: "user1",
  name: "John Doe",
  email: "john@example.com",
  examDate: "2025-06-01",
  goals: "Pass the CSS exam with flying colors. Focus on grid and flexbox.",
  createdAt: new Date().toISOString(),
}

export const mockNotes = [
  {
    id: "note1",
    title: "CSS Grid Layout",
    content:
      "# CSS Grid Layout\n\nCSS Grid Layout is a two-dimensional layout system designed for the web. It lets you layout items in rows and columns.\n\n## Basic Terminology\n\n- **Grid Container**: The element on which `display: grid` is applied.\n- **Grid Item**: The children of the grid container.\n- **Grid Line**: The dividing lines that make up the structure of the grid.\n\n## Basic Example\n\n```css\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 10px;\n}\n```",
    updatedAt: new Date().toISOString(),
    tags: ["css", "layout", "grid"],
  },
  {
    id: "note2",
    title: "CSS Flexbox",
    content:
      "# CSS Flexbox\n\nThe Flexbox Layout aims at providing a more efficient way to lay out, align and distribute space among items in a container, even when their size is unknown or dynamic.\n\n## Basic Terminology\n\n- **Flex Container**: The element on which `display: flex` is applied.\n- **Flex Item**: The children of the flex container.\n- **Main Axis**: The primary axis along which flex items are laid out.\n\n## Basic Example\n\n```css\n.flex-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n```",
    updatedAt: "2023-11-10T15:30:00Z",
    tags: ["css", "layout", "flexbox"],
  },
  {
    id: "note3",
    title: "CSS Animations",
    content:
      "# CSS Animations\n\nCSS animations make it possible to animate transitions from one CSS style configuration to another.\n\n## Animation Properties\n\n- **animation-name**: Specifies the name of the @keyframes rule.\n- **animation-duration**: Specifies how long the animation should take to complete one cycle.\n- **animation-timing-function**: Specifies the speed curve of the animation.\n\n## Basic Example\n\n```css\n@keyframes slide-in {\n  from { transform: translateX(-100%); }\n  to { transform: translateX(0); }\n}\n\n.animated-element {\n  animation: slide-in 0.5s ease-out;\n}\n```",
    updatedAt: "2023-11-05T09:15:00Z",
    tags: ["css", "animation"],
  },
]

export const mockSyllabus = [
  {
    id: "section1",
    title: "CSS Basics",
    progress: 90,
    topics: [
      { id: "topic1", title: "Selectors", completed: true },
      { id: "topic2", title: "Box Model", completed: true },
      { id: "topic3", title: "Typography", completed: true },
      { id: "topic4", title: "Colors and Backgrounds", completed: false },
    ],
  },
  {
    id: "section2",
    title: "CSS Layout",
    progress: 75,
    topics: [
      { id: "topic5", title: "Flexbox", completed: true },
      { id: "topic6", title: "Grid", completed: true },
      { id: "topic7", title: "Positioning", completed: false },
      { id: "topic8", title: "Float and Clear", completed: false },
    ],
  },
  {
    id: "section3",
    title: "CSS Advanced",
    progress: 40,
    topics: [
      { id: "topic9", title: "Animations", completed: true },
      { id: "topic10", title: "Transitions", completed: false },
      { id: "topic11", title: "Transforms", completed: false },
      { id: "topic12", title: "Variables", completed: false },
    ],
  },
  {
    id: "section4",
    title: "CSS Architecture",
    progress: 10,
    topics: [
      { id: "topic13", title: "BEM Methodology", completed: false },
      { id: "topic14", title: "OOCSS", completed: false },
      { id: "topic15", title: "SMACSS", completed: false },
      { id: "topic16", title: "CSS-in-JS", completed: false },
    ],
  },
]

export const mockTasks = [
  { id: "task1", title: "Review CSS Flexbox", dueDate: "2023-12-01", completed: false },
  { id: "task2", title: "Practice Grid Layouts", dueDate: "2023-12-03", completed: false },
  { id: "task3", title: "Complete Animation Quiz", dueDate: "2023-12-05", completed: false },
  { id: "task4", title: "Study Positioning", dueDate: "2023-12-08", completed: false },
]

export const mockProgress = {
  overall: 65,
  topics: [
    { name: "CSS Basics", progress: 90 },
    { name: "CSS Layout", progress: 75 },
    { name: "CSS Advanced", progress: 40 },
    { name: "CSS Architecture", progress: 10 },
  ],
}
