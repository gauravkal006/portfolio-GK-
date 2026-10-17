/** A certificate scan stored in public/images/certificates/. */
export type CertificateImage = {
  title: string;
  issuer: string;
  date?: string;
  image: string;
};

export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  place?: string;
  detail?: string;
  points?: string[];
  /** Certificate or letter that backs this entry; shown with a "View certificate" button. */
  certificate?: CertificateImage;
};

const cert = (file: string) => `images/certificates/${file}.webp`;

// Dates and details below are taken from the certificates themselves.
export const experience: TimelineItem[] = [
  {
    period: "Apr – Jun 2025",
    title: "Virtual Intern, Networking Cloud",
    org: "AICTE · EduSkills",
    place: "Supported by Juniper Networks",
    detail: "10-week virtual internship through the National Internship Portal. Grade A.",
    certificate: {
      title: "Networking Cloud Virtual Internship",
      issuer: "AICTE · EduSkills · Juniper Networks",
      date: "April – June 2025",
      image: cert("eduskills-networking-cloud"),
    },
  },
  {
    period: "Jun – Jul 2023",
    title: "Intern, Advanced Java",
    org: "Compilers Technologies",
    detail: "6-week internship in Advanced Java: Swing, JDBC, HTML, CSS, Servlets and JSP.",
    certificate: {
      title: "Internship completion letter",
      issuer: "Compilers Technologies",
      date: "19 June – 31 July 2023",
      image: cert("compilers-internship"),
    },
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

export type Certificate = CertificateImage & {
  /** Short supporting line, e.g. the score. */
  detail?: string;
  /** Optional link to verify the credential online. */
  url?: string;
};

// Course certificates, newest first.
export const certifications: Certificate[] = [
  {
    title: "Python for Data Science",
    issuer: "NPTEL · IIT Madras",
    date: "Jan – Feb 2026",
    detail: "Elite · 72% consolidated score",
    image: cert("nptel-python-data-science"),
  },
  {
    title: "Fundamentals of Deep Learning",
    issuer: "NVIDIA",
    date: "October 2025",
    detail: "Certificate of Competency",
    image: cert("nvidia-deep-learning"),
  },
  {
    title: "Prompt Engineering",
    issuer: "Infosys Springboard",
    date: "January 2025",
    detail: "Course completion",
    image: cert("infosys-prompt-engineering"),
  },
  {
    title: "Cloud Computing Fundamentals",
    issuer: "Infosys Springboard",
    date: "January 2024",
    detail: "Course completion",
    image: cert("infosys-cloud-computing"),
  },
];

export const activities: TimelineItem[] = [
  {
    period: "2026",
    title: "Hackathon participant",
    org: "Navonmesh'26 · SSGMCE, Shegaon",
    detail: "Took part in 24-hour hackathons, building real-world prototype solutions in team environments.",
    certificate: {
      title: "Certificate of participation",
      issuer: "Navonmesh'26 · Shri Sant Gajanan Maharaj College of Engineering",
      date: "2026",
      image: cert("navonmesh-hackathon"),
    },
  },
];
