// Homepage roadmap data and utility functions
export const ROADMAP = {
  firstYear: [
    {
      semester: 1,
      title: "Foundation & Exploration",
      items: [
        "Join TinkerHub and explore peer-to-peer learning opportunities",
        "Onboard to MuLearn platform for skill development",
        "Attend foundation workshops on innovation and entrepreneurship",
        "Network with seniors and learn about IEDC initiatives",
        "Participate in ideation sessions and brainstorming workshops",
      ],
    },
    {
      semester: 2,
      title: "Hands-on Learning",
      items: [
        "FabLab visits and hands-on prototyping experience",
        "Attend IEDC dashboard events and community meetings",
        "Network with innovators and industry professionals",
        "Join technical communities (FOSS, GDG, etc.)",
        "Start building your first simple projects",
      ],
    },
  ],
  secondYear: [
    {
      semester: 3,
      title: "Project Development",
      items: [
        "Work on mini projects and side projects",
        "Build mentorship connections with faculty and seniors",
        "Document your portfolio and showcase your work",
        "Participate in YIP (Young Innovators Programme)",
        "Join specialized technical teams and communities",
      ],
    },
    {
      semester: 4,
      title: "Innovation & Competition",
      items: [
        "Participate in hackathons and ideathons",
        "Take up external challenges and competitions",
        "Pitch your ideas and solutions to panels",
        "Apply for innovation grants and funding",
        "Consider starting your own startup or initiative",
      ],
    },
  ],
};

/**
 * Get roadmap for user based on their year of joining
 * @param {string} yearOfJoining - Year when user joined (e.g., "2024")
 * @param {number} currentYear - Current year (default: current calendar year)
 * @returns {Array} Array of semester roadmap items
 */
export const getRoadmapForUser = (
  yearOfJoining,
  currentYear = new Date().getFullYear()
) => {
  if (!yearOfJoining) {
    return [];
  }

  const joinYear = parseInt(yearOfJoining);
  const yearDifference = currentYear - joinYear;

  // Determine which roadmap to show based on academic year
  if (yearDifference === 0) {
    // Current year joiners - show first year roadmap
    return ROADMAP.firstYear;
  } else if (yearDifference === 1) {
    // Second year students - show second year roadmap
    return ROADMAP.secondYear;
  } else if (yearDifference >= 2) {
    // Third year and above - show advanced roadmap or empty
    return [
      {
        semester: "Advanced",
        title: "Leadership & Innovation",
        items: [
          "Take leadership roles in technical communities",
          "Mentor junior students and guide their projects",
          "Work on advanced research or industry projects",
          "Consider applying for Execom positions",
          "Focus on placement preparation and career development",
        ],
      },
    ];
  }

  return [];
};

/**
 * Get current semester information for display
 * @param {string} yearOfJoining - Year when user joined
 * @param {number} currentYear - Current year
 * @param {number} currentMonth - Current month (1-12)
 * @returns {Object} Current semester information
 */
export const getCurrentSemesterInfo = (
  yearOfJoining,
  currentYear = new Date().getFullYear(),
  currentMonth = new Date().getMonth() + 1
) => {
  const joinYear = parseInt(yearOfJoining);
  const yearDifference = currentYear - joinYear;

  // Determine semester based on month (rough approximation)
  // January-May: Even semester, June-December: Odd semester
  const isEvenSemester = currentMonth >= 1 && currentMonth <= 5;

  let currentSemester = 1;
  if (yearDifference === 0) {
    currentSemester = isEvenSemester ? 2 : 1;
  } else if (yearDifference === 1) {
    currentSemester = isEvenSemester ? 4 : 3;
  } else if (yearDifference === 2) {
    currentSemester = isEvenSemester ? 6 : 5;
  } else if (yearDifference === 3) {
    currentSemester = isEvenSemester ? 8 : 7;
  }

  return {
    currentSemester,
    academicYear: yearDifference + 1,
    yearLabel:
      ["First Year", "Second Year", "Third Year", "Fourth Year"][
        yearDifference
      ] || "Advanced",
  };
};

/**
 * Get user's roadmap with current semester highlighting
 * @param {Object} user - User object with registration data
 * @returns {Object} Roadmap data with current semester info
 */
export const getUserRoadmapData = (user) => {
  if (!user || !user.registration || !user.registration.yearOfJoining) {
    return {
      roadmap: [],
      currentSemester: null,
      yearLabel: "Unknown",
    };
  }

  const roadmap = getRoadmapForUser(user.registration.yearOfJoining);
  const semesterInfo = getCurrentSemesterInfo(user.registration.yearOfJoining);

  return {
    roadmap,
    currentSemester: semesterInfo.currentSemester,
    academicYear: semesterInfo.academicYear,
    yearLabel: semesterInfo.yearLabel,
  };
};
