# Implementation Plan: Lexa AI Landing Page

## Overview

This implementation plan breaks down the Lexa AI Landing Page into discrete coding tasks. The landing page is a modern, animated single-page application built with React, TypeScript, Vite, and Tailwind CSS. The implementation follows a bottom-up approach, starting with foundational utilities and building up to complete sections.

## Tasks

- [ ] 1. Project setup and configuration
  - [-] 1.1 Install required dependencies
    - Install shaders/react (2.5.128), lucide-react (1.16.0), and react-router-dom (7.15.1)
    - Verify React (19.2.6), TypeScript (6.0.2), Vite (8.0.12), and Tailwind CSS (4.3.0) are already installed
    - _Requirements: All requirements depend on proper project setup_
  
  - [-] 1.2 Configure Tailwind CSS with custom theme
    - Add custom colors (lexa-orange: #F26522, lexa-gray: #EFEFEF)
    - Add custom animations (slide-up, slide-down, text-roll)
    - Add custom keyframes for animations
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 14.1, 14.3, 14.4_

- [ ] 2. Create constants and type definitions
  - [~] 2.1 Create shader configuration constants
    - Define SHADER_CONFIG with Swirl, ChromaFlow, FlutedGlass, and FilmGrain settings
    - Export as const for type safety
    - _Requirements: 2.2, 2.3_
  
  - [~] 2.2 Create navigation constants
    - Define NAV_LINKS array with Features, Workflow, Security, Contact
    - Export as const for type safety
    - _Requirements: 3.3_
  
  - [~] 2.3 Create image constants
    - Define ABOUT_IMAGES with URLs, aspect ratios, and alt text
    - Export as const for type safety
    - _Requirements: 9.1, 9.2, 9.3, 9.5_
  
  - [~] 2.4 Create video constants
    - Define CASE_STUDY_VIDEOS array with id, title, description, and videoUrl
    - Export as const for type safety
    - _Requirements: 12.1, 12.4_
  
  - [~] 2.5 Create TypeScript type definitions
    - Define BaseComponentProps, NavLink, VideoData, ImageData interfaces
    - Export all types from types/index.ts
    - _Requirements: All requirements benefit from type safety_

- [ ] 3. Implement custom hooks
  - [~] 3.1 Create useLondonTime hook
    - Use Intl.DateTimeFormat with Europe/London timezone
    - Update time every 1000ms using setInterval
    - Return time string in HH:MM:SS format and error state
    - Clean up interval on unmount
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  
  - [~] 3.2 Create useMediaQuery hook
    - Accept media query string as parameter
    - Use window.matchMedia to check matches
    - Add event listener for media query changes
    - Return boolean indicating if query matches
    - Clean up event listener on unmount
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [~] 3.3 Create useFocusTrap hook
    - Accept ref to container element and isActive boolean
    - Save previous focus on activation
    - Focus first focusable element on activation
    - Trap Tab key navigation within container
    - Handle Escape key to deactivate
    - Restore previous focus on deactivation
    - _Requirements: 5.6, 15.1, 15.6_

- [ ] 4. Create base UI components
  - [~] 4.1 Implement PillLabel component
    - Accept children and className props
    - Apply rounded-full, padding, and text styling
    - Use uppercase and tracking-wide for text
    - _Requirements: 8.3, 11.3_
  
  - [~] 4.2 Implement NumberedBadge component
    - Accept number string and className props
    - Render circular badge with border
    - Center number text with bold styling
    - Make responsive (w-12 h-12 on mobile, w-14 h-14 on desktop)
    - _Requirements: 8.2, 11.2_
  
  - [~] 4.3 Implement CTAButton component with TextRollAnimation
    - Accept children, variant, className, and onClick props
    - Create two identical text spans for roll effect
    - Apply overflow hidden and relative positioning
    - Implement hover state with transform transitions
    - Support primary (orange) and secondary (white) variants
    - Use cubic-bezier(0.4, 0, 0.2, 1) easing with 300ms duration
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 10.2, 14.3_
  
  - [ ]* 4.4 Write unit tests for base UI components
    - Test PillLabel renders with correct styling
    - Test NumberedBadge displays number correctly
    - Test CTAButton text roll animation structure
    - Test CTAButton variant styling
    - _Requirements: 6.1, 6.2, 6.3, 8.2, 8.3, 10.2, 11.2, 11.3_

- [ ] 5. Implement ShaderOverlay component
  - [~] 5.1 Create ShaderOverlay with layered shader effects
    - Import Swirl, ChromaFlow, FlutedGlass, FilmGrain from shaders/react
    - Layer shaders with absolute positioning and z-index management
    - Apply pointer-events-none to prevent interaction blocking
    - Use SHADER_CONFIG constants for configuration
    - Implement error boundary with fallback to static background
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ]* 5.2 Write unit tests for ShaderOverlay
    - Test component renders without crashing
    - Test fallback background on shader error
    - Test pointer-events-none is applied
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 6. Create navigation components
  - [~] 6.1 Implement Logo component
    - Create circular container with gray-900 background
    - Center "LX" text in white
    - Make responsive (w-9 h-9 on mobile, w-10 h-10 on desktop)
    - _Requirements: 3.2_
  
  - [~] 6.2 Implement NavLinks component
    - Accept links array and className props
    - Map over NAV_LINKS to render anchor elements
    - Apply hover states and transitions
    - Hide on mobile (hidden md:flex)
    - _Requirements: 3.3, 3.7_
  
  - [~] 6.3 Implement LondonClock component
    - Use useLondonTime hook to get current time
    - Display clock icon from lucide-react
    - Show "London Time" label
    - Display time in HH:MM:SS format
    - Show fallback "--:--:--" on error
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [~] 6.4 Implement MobileMenu component
    - Accept isOpen and onClose props
    - Use useFocusTrap hook for focus management
    - Implement slide-up animation from bottom
    - Add semi-transparent backdrop
    - Display NavLinks vertically
    - Add close button with X icon
    - Apply role="dialog" and aria-modal="true"
    - Handle Escape key to close
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 14.4, 15.1, 15.6_
  
  - [~] 6.5 Implement Navbar component
    - Create pill-shaped container with white background and shadow
    - Position Logo on left
    - Position NavLinks in center
    - Position LondonClock and CTAButton on right
    - Add mobile menu button (visible only on mobile)
    - Make navbar fixed at top with proper z-index
    - Apply max-width 1440px with centered layout
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 8.7_
  
  - [ ]* 6.6 Write unit tests for navigation components
    - Test Logo renders with correct styling
    - Test NavLinks renders all navigation items
    - Test LondonClock displays time format correctly
    - Test MobileMenu opens and closes
    - Test MobileMenu focus trap behavior
    - Test Navbar layout and responsive behavior
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [~] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement VideoCard component
  - [~] 8.1 Create VideoCard with autoplay video
    - Accept title, description, videoUrl, and className props
    - Render video element with autoPlay, muted, loop, playsInline attributes
    - Disable controls for cleaner UI
    - Add video error handling with fallback UI
    - _Requirements: 12.1, 12.2, 12.3, 12.9_
  
  - [~] 8.2 Add expandable button with hover animation
    - Create button with arrow icon from lucide-react (ArrowUpRight)
    - Initially show compact button with arrow at -45deg
    - On hover, expand button to show full description
    - Rotate arrow from -45deg to 0deg on hover
    - Use cubic-bezier easing with 300ms duration
    - _Requirements: 12.5, 12.6, 12.7, 12.8, 14.5_
  
  - [~] 8.3 Add accessibility attributes to VideoCard
    - Add aria-label to video element
    - Add alt text for fallback content
    - Ensure button is keyboard accessible
    - _Requirements: 15.1, 15.3, 15.5_
  
  - [ ]* 8.4 Write unit tests for VideoCard
    - Test video element has correct attributes
    - Test expandable button shows/hides description
    - Test arrow icon rotation on hover
    - Test video error fallback
    - _Requirements: 12.1, 12.2, 12.3, 12.5, 12.6, 12.7, 12.8, 12.9_

- [ ] 9. Create section components
  - [~] 9.1 Implement HeroContent component
    - Create label "Lexa AI" with small text and tracking
    - Create multi-line headline with responsive font sizing using clamp()
    - Add primary CTAButton "Start Reviewing" with orange background
    - Add partner badge with AI Verified icon and "Secure Platform" text
    - Center content horizontally and vertically
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [~] 9.2 Implement HeroSection component
    - Create full viewport height container
    - Add light gray background (#EFEFEF)
    - Layer ShaderOverlay on top of background
    - Add Navbar at the top
    - Add HeroContent in center
    - Manage mobile menu state with useState
    - Apply max-width 1440px to content
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [~] 9.3 Implement AboutSection component
    - Create white background container
    - Add NumberedBadge with "02"
    - Add PillLabel with section identifier
    - Add responsive heading with line breaks
    - Create 3-column grid layout (stacks on mobile)
    - Add two images with proper aspect ratios
    - Add CTAButton in grid
    - Implement image error handling with fallback
    - Apply max-width 1440px to content
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4_
  
  - [~] 9.4 Implement CaseStudiesSection component
    - Create light gray background (#EFEFEF) container
    - Add NumberedBadge with "03"
    - Add PillLabel with section identifier
    - Add large heading
    - Create 2-column grid of VideoCards (stacks on mobile)
    - Map over CASE_STUDY_VIDEOS to render VideoCards
    - Apply max-width 1440px to content
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_
  
  - [ ]* 9.5 Write unit tests for section components
    - Test HeroContent renders all elements
    - Test HeroSection layout and structure
    - Test AboutSection responsive grid layout
    - Test AboutSection image error handling
    - Test CaseStudiesSection renders video cards
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [ ] 10. Integrate LandingPage component
  - [~] 10.1 Create main LandingPage component
    - Import and compose HeroSection, AboutSection, CaseStudiesSection
    - Ensure proper stacking order
    - Add smooth scroll behavior for navigation links
    - _Requirements: All section requirements_
  
  - [~] 10.2 Update App.tsx to render LandingPage
    - Import LandingPage component
    - Replace existing content with LandingPage
    - Ensure proper routing setup if needed
    - _Requirements: All requirements_
  
  - [ ]* 10.3 Write integration tests for LandingPage
    - Test all sections render together
    - Test navigation link clicks scroll to sections
    - Test mobile menu opens and closes
    - Test CTA button interactions
    - _Requirements: All requirements_

- [~] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Styling and responsive design refinement
  - [~] 12.1 Verify responsive breakpoints
    - Test mobile layout (<640px)
    - Test tablet layout (640px-1024px)
    - Test desktop layout (>1024px)
    - Verify all sections maintain max-width 1440px
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [~] 12.2 Verify touch device interactions
    - Test all interactive elements on touch devices
    - Verify hover states work with touch
    - Test mobile menu on touch devices
    - _Requirements: 13.6_
  
  - [~] 12.3 Optimize animation performance
    - Verify all animations use cubic-bezier easing
    - Test shader animations maintain 60fps
    - Verify text roll animation completes in 300ms
    - Verify mobile menu animation completes in 400ms
    - Verify arrow rotation completes in 300ms
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [ ] 13. Accessibility compliance
  - [~] 13.1 Implement keyboard navigation
    - Verify all interactive elements are keyboard accessible
    - Test Tab key navigation order
    - Verify focus trap in mobile menu
    - Test Escape key closes mobile menu
    - _Requirements: 15.1, 15.6_
  
  - [~] 13.2 Add ARIA attributes and semantic HTML
    - Add alt text to all images
    - Add aria-label to all videos
    - Verify semantic HTML structure
    - Add ARIA attributes to mobile menu (role, aria-modal, aria-labelledby)
    - _Requirements: 15.2, 15.3, 15.7_
  
  - [~] 13.3 Verify color contrast and focus states
    - Test color contrast meets WCAG AA standards
    - Verify focus states are clearly visible
    - Test with keyboard navigation
    - _Requirements: 15.4, 15.5_
  
  - [ ]* 13.4 Run accessibility audit
    - Use axe-core or similar tool to check for violations
    - Fix any accessibility issues found
    - Document any known limitations
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

- [ ] 14. Final polish and optimization
  - [~] 14.1 Optimize images and videos
    - Add loading="lazy" to images below the fold
    - Add preload="metadata" to videos
    - Verify responsive image srcset if needed
    - _Requirements: 9.4, 12.9_
  
  - [~] 14.2 Code splitting and lazy loading
    - Lazy load AboutSection and CaseStudiesSection
    - Add Suspense boundaries with loading states
    - Verify bundle size is optimized
    - _Requirements: 14.2_
  
  - [~] 14.3 Final testing and bug fixes
    - Test complete user flow from landing to CTA
    - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
    - Test on multiple devices (mobile, tablet, desktop)
    - Fix any remaining bugs or issues
    - _Requirements: All requirements_

- [~] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The implementation follows a bottom-up approach: utilities → components → sections → integration
- All animations use cubic-bezier easing for smooth, professional feel
- Accessibility is built in from the start, not added as an afterthought
- The design uses TypeScript for type safety throughout
- Tailwind CSS provides utility-first styling with custom theme extensions
- The shaders package creates the animated background effects
- All components are modular and reusable

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3", "5.1"] },
    { "id": 4, "tasks": ["4.4", "5.2", "6.1", "6.2", "6.3"] },
    { "id": 5, "tasks": ["6.4", "6.5", "8.1"] },
    { "id": 6, "tasks": ["6.6", "8.2", "8.3"] },
    { "id": 7, "tasks": ["8.4", "9.1"] },
    { "id": 8, "tasks": ["9.2", "9.3", "9.4"] },
    { "id": 9, "tasks": ["9.5", "10.1"] },
    { "id": 10, "tasks": ["10.2"] },
    { "id": 11, "tasks": ["10.3", "12.1", "12.2", "12.3"] },
    { "id": 12, "tasks": ["13.1", "13.2", "13.3"] },
    { "id": 13, "tasks": ["13.4", "14.1", "14.2"] },
    { "id": 14, "tasks": ["14.3"] }
  ]
}
```
