// Base path for internal images
const IMAGES_BASE_PATH = "/images/internal-images";

/**
 * Available background images
 * Use these constants to easily switch between different backgrounds
 */
export const BACKGROUND_IMAGES = {
  hero: `${IMAGES_BASE_PATH}/tests/4.png`,
  about: `${IMAGES_BASE_PATH}/tests/5.jpg`,
  skills: `${IMAGES_BASE_PATH}/tests/2.jpg`,
  featuredProjects: `${IMAGES_BASE_PATH}/tests/3.jpg`,
  featuredFeedback: `${IMAGES_BASE_PATH}/tests/7.jpg`,
  feedback: `${IMAGES_BASE_PATH}/tests/1.jpg`,
  contact: `${IMAGES_BASE_PATH}/tests/5.jpg`,
} as const;


export const SECTION_BACKGROUNDS = {
  // Hero section - the main landing section
  hero: BACKGROUND_IMAGES.hero,
  
  // About section - narrative and experience timeline
  about: BACKGROUND_IMAGES.about,
  
  // Skills section - technology skills grid
  skills: BACKGROUND_IMAGES.skills,
  
  // Featured projects section - project showcase
  featuredProjects: BACKGROUND_IMAGES.featuredProjects,
  
  // Featured feedback section - user testimonials
  featuredFeedback: BACKGROUND_IMAGES.featuredFeedback,
  
  // Feedback submission section - feedback form
  feedback: BACKGROUND_IMAGES.feedback,
  
  // Contact section - contact form and info
  contact: BACKGROUND_IMAGES.contact,
} as const;

// Type for section keys
export type SectionKey = keyof typeof SECTION_BACKGROUNDS;

// Type for available background images
export type BackgroundImageKey = keyof typeof BACKGROUND_IMAGES;
