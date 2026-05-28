# Requirements Document

## Introduction

This document specifies the requirements for the Lexa AI Landing Page, an AI-powered legal review platform landing page. The landing page will showcase the platform's capabilities through three main sections: Hero, About, and Case Studies. The implementation will use React, TypeScript, Vite, and Tailwind CSS with animated shader backgrounds and interactive UI components.

## Glossary

- **Landing_Page**: The main entry page for the Lexa AI platform
- **Hero_Section**: The full-viewport first section with animated background and navigation
- **About_Section**: The second section describing the platform with images and content
- **Case_Studies_Section**: The third section showcasing video demonstrations of platform features
- **Navbar**: The pill-shaped navigation bar containing logo, links, clock, and CTA button
- **Mobile_Menu**: The overlay menu displayed on mobile devices
- **Shader_Overlay**: Animated background effects using the shaders package
- **Text_Roll_Animation**: Hover animation effect where text rolls upward revealing new text
- **London_Clock**: Real-time clock display showing current London time
- **Video_Card**: Interactive card component containing autoplay video and expandable description
- **CTA_Button**: Call-to-action button with hover animations
- **Numbered_Badge**: Circular badge displaying section number
- **Pill_Label**: Rounded label component for section identifiers

## Requirements

### Requirement 1: Hero Section Layout and Structure

**User Story:** As a visitor, I want to see an engaging hero section when I land on the page, so that I understand the platform's value proposition immediately.

#### Acceptance Criteria

1. THE Hero_Section SHALL occupy the full viewport height
2. THE Hero_Section SHALL have a light gray background color (#EFEFEF)
3. THE Hero_Section SHALL contain a Navbar at the top
4. THE Hero_Section SHALL contain centered hero content with headline, label, and CTA buttons
5. THE Hero_Section SHALL have a maximum content width of 1440px

### Requirement 2: Animated Shader Background

**User Story:** As a visitor, I want to see a visually appealing animated background, so that the landing page feels modern and engaging.

#### Acceptance Criteria

1. THE Shader_Overlay SHALL render on top of the Hero_Section background
2. THE Shader_Overlay SHALL use Swirl, ChromaFlow, FlutedGlass, and FilmGrain effects from shaders/react package
3. THE Shader_Overlay SHALL maintain the light gray base color (#EFEFEF)
4. THE Shader_Overlay SHALL animate continuously without user interaction
5. THE Shader_Overlay SHALL not interfere with content readability

### Requirement 3: Navigation Bar

**User Story:** As a visitor, I want to navigate the landing page easily, so that I can access different sections and take action.

#### Acceptance Criteria

1. THE Navbar SHALL have a pill-shaped white background
2. THE Navbar SHALL contain a logo on the left side
3. THE Navbar SHALL contain navigation links in the center (Home, About, Case Studies)
4. THE Navbar SHALL display a live London_Clock showing current London time
5. THE Navbar SHALL contain a CTA_Button on the right side with text "Get Started"
6. THE Navbar SHALL be fixed at the top of the viewport
7. WHEN the viewport width is below tablet breakpoint, THE Navbar SHALL display a mobile menu icon instead of navigation links

### Requirement 4: Live London Time Clock

**User Story:** As a visitor, I want to see the current London time, so that I know when the team is available.

#### Acceptance Criteria

1. THE London_Clock SHALL display the current time in London timezone
2. THE London_Clock SHALL update every second
3. THE London_Clock SHALL display time in HH:MM:SS format
4. THE London_Clock SHALL include a label "London Time"
5. WHEN the component mounts, THE London_Clock SHALL initialize with the correct London time

### Requirement 5: Mobile Menu

**User Story:** As a mobile visitor, I want to access navigation options easily, so that I can navigate the site on my device.

#### Acceptance Criteria

1. WHEN the viewport width is below tablet breakpoint, THE Mobile_Menu icon SHALL be visible in the Navbar
2. WHEN a user clicks the mobile menu icon, THE Mobile_Menu overlay SHALL slide up from the bottom
3. THE Mobile_Menu SHALL display all navigation links vertically
4. THE Mobile_Menu SHALL include a close button
5. WHEN a user clicks a navigation link or close button, THE Mobile_Menu SHALL slide down and close
6. THE Mobile_Menu SHALL use cubic-bezier easing for slide animations

### Requirement 6: Text Roll Hover Animation

**User Story:** As a visitor, I want interactive feedback when hovering over buttons, so that I know they are clickable.

#### Acceptance Criteria

1. WHEN a user hovers over a CTA_Button, THE button text SHALL roll upward
2. THE text roll animation SHALL reveal identical text below
3. THE text roll animation SHALL use cubic-bezier(0.4, 0, 0.2, 1) easing
4. THE text roll animation SHALL complete within 300ms
5. WHEN the user moves the cursor away, THE button text SHALL roll back to original position

### Requirement 7: Hero Content

**User Story:** As a visitor, I want to understand what Lexa AI offers, so that I can decide if it's relevant to my needs.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a headline describing the platform
2. THE Hero_Section SHALL display a label above the headline
3. THE Hero_Section SHALL contain a primary CTA_Button with orange background
4. THE Hero_Section SHALL contain a secondary partner badge with "AI Verified" icon
5. THE hero content SHALL be centered horizontally and vertically within the Hero_Section

### Requirement 8: About Section Layout

**User Story:** As a visitor, I want to learn more about the platform's capabilities, so that I can understand its features.

#### Acceptance Criteria

1. THE About_Section SHALL have a white background
2. THE About_Section SHALL contain a Numbered_Badge displaying "02"
3. THE About_Section SHALL contain a Pill_Label with section identifier
4. THE About_Section SHALL contain a responsive heading with line breaks
5. WHEN the viewport width is below tablet breakpoint, THE About_Section content SHALL stack vertically
6. WHEN the viewport width is at or above tablet breakpoint, THE About_Section SHALL display a 3-column grid layout
7. THE About_Section SHALL have a maximum content width of 1440px

### Requirement 9: About Section Images

**User Story:** As a visitor, I want to see visual representations of the platform, so that I can better understand its interface.

#### Acceptance Criteria

1. THE About_Section SHALL display two images
2. THE first image SHALL have a 16:9 aspect ratio
3. THE second image SHALL have a 4:3 aspect ratio
4. THE images SHALL be responsive and scale with viewport width
5. THE images SHALL load from provided URLs

### Requirement 10: About Section CTA

**User Story:** As a visitor, I want to take action after learning about the platform, so that I can proceed to the next step.

#### Acceptance Criteria

1. THE About_Section SHALL contain an orange CTA_Button
2. THE CTA_Button SHALL use the Text_Roll_Animation on hover
3. THE CTA_Button SHALL be positioned within the About_Section layout
4. THE CTA_Button SHALL have accessible hover states

### Requirement 11: Case Studies Section Layout

**User Story:** As a visitor, I want to see real examples of the platform in action, so that I can understand its practical applications.

#### Acceptance Criteria

1. THE Case_Studies_Section SHALL have a light gray background (#EFEFEF)
2. THE Case_Studies_Section SHALL contain a Numbered_Badge displaying "03"
3. THE Case_Studies_Section SHALL contain a Pill_Label with section identifier
4. THE Case_Studies_Section SHALL contain a large heading
5. THE Case_Studies_Section SHALL display a 2-column grid of Video_Cards
6. WHEN the viewport width is below tablet breakpoint, THE Video_Cards SHALL stack vertically
7. THE Case_Studies_Section SHALL have a maximum content width of 1440px

### Requirement 12: Video Card Component

**User Story:** As a visitor, I want to watch demonstration videos, so that I can see the platform's features in action.

#### Acceptance Criteria

1. EACH Video_Card SHALL contain an autoplay video
2. THE videos SHALL be muted by default
3. THE videos SHALL loop continuously
4. EACH Video_Card SHALL have a title (Risk Detection or Smart Redlining)
5. EACH Video_Card SHALL contain a hover-expandable button with description
6. WHEN a user hovers over the expandable button, THE button SHALL expand to show full description
7. WHEN a user hovers over the expandable button, THE arrow icon SHALL rotate from -45 degrees to 0 degrees
8. THE icon rotation SHALL use cubic-bezier easing
9. THE Video_Card SHALL maintain proper aspect ratio for videos

### Requirement 13: Responsive Design

**User Story:** As a visitor on any device, I want the landing page to display correctly, so that I have a good experience regardless of screen size.

#### Acceptance Criteria

1. THE Landing_Page SHALL use Tailwind CSS default breakpoints for responsive behavior
2. WHEN the viewport width is below 640px, THE Landing_Page SHALL display mobile layout
3. WHEN the viewport width is between 640px and 1024px, THE Landing_Page SHALL display tablet layout
4. WHEN the viewport width is above 1024px, THE Landing_Page SHALL display desktop layout
5. ALL sections SHALL maintain maximum content width of 1440px on large screens
6. ALL interactive elements SHALL be accessible on touch devices

### Requirement 14: Animation Performance

**User Story:** As a visitor, I want smooth animations, so that the page feels responsive and professional.

#### Acceptance Criteria

1. ALL animations SHALL use cubic-bezier easing functions
2. THE Shader_Overlay animations SHALL maintain 60fps performance
3. THE Text_Roll_Animation SHALL complete within 300ms
4. THE Mobile_Menu slide animation SHALL complete within 400ms
5. THE arrow icon rotation SHALL complete within 300ms
6. ALL animations SHALL not block user interaction

### Requirement 15: Accessibility

**User Story:** As a visitor using assistive technology, I want to access all content and functionality, so that I can use the landing page effectively.

#### Acceptance Criteria

1. ALL interactive elements SHALL be keyboard accessible
2. ALL images SHALL have appropriate alt text
3. ALL videos SHALL have appropriate aria labels
4. THE color contrast SHALL meet WCAG AA standards
5. THE focus states SHALL be clearly visible for all interactive elements
6. THE Mobile_Menu SHALL trap focus when open
7. THE page structure SHALL use semantic HTML elements
