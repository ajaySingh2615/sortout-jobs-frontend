/**
 * Experience Level Constants
 * Maps backend enum values to display names
 * Keep in sync with: sortout-job-backend/.../onboarding/entity/ExperienceLevel.java
 */

export const EXPERIENCE_LEVELS = {
  FRESHER: "Fresher",
  MONTHS_1_6: "1-6 Months",
  YEAR_1: "1 Year",
  YEARS_2: "2 Years",
  YEARS_3: "3 Years",
  YEARS_4: "4 Years",
  YEARS_5_PLUS: "5+ Years",
};

/**
 * Format experience level enum value to display name
 * @param {string} level - Enum value (e.g., "YEARS_3")
 * @returns {string} Display name (e.g., "3 Years")
 */
export const formatExperienceLevel = (level) => {
  if (!level) return "Fresher";
  return EXPERIENCE_LEVELS[level] || "Fresher";
};
