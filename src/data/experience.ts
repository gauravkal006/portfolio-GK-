export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  place?: string;
  detail?: string;
  points?: string[];
};

export const experience: TimelineItem[] = [
  {
    period: "2023 – 2024",
    title: "Intern",
    org: "Compilers Technologies",
    detail: "Java full-stack development and Java software development.",
  },
];

export const education: TimelineItem[] = [
  {
    period: "Aug 2024 – Present",
    title: "B.Tech in Computer Science Engineering",
    org: "Prof. Ram Meghe Institute of Technology and Research (Autonomous)",
    place: "Amravati, Maharashtra",
    detail: "CGPA: 8.1 / 10.0",
  },
  {
    period: "Aug 2021 – June 2024",
    title: "Diploma in Information Technology",
    org: "Government Polytechnic, Amravati",
    place: "Autonomous",
    detail: "Percentage: 88.84%",
  },
  {
    period: "June 2015 – March 2021",
    title: "Secondary School Certificate (10th Grade)",
    org: "Bhagyshree Vidyalya, Amravati",
    place: "Maharashtra State Board",
    detail: "Percentage: 94.80%",
  },
];

export const certifications = [
  { name: "Fundamentals of Deep Learning", issuer: "NVIDIA" },
  { name: "Python for Data Science", issuer: "NPTEL" },
];

export const activities = [
  {
    period: "2026",
    title: "Hackathon participant",
    org: "SSGMCE",
    detail: "Took part in 24-hour hackathons, building real-world prototype solutions in team environments.",
  },
];
