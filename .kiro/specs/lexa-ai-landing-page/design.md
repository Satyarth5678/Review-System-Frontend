# Design Document: Lexa AI Landing Page

## Overview

The Lexa AI Landing Page is a modern, animated single-page application built with React, TypeScript, Vite, and Tailwind CSS. The landing page showcases an AI-powered legal review platform through three main sections: Hero, About, and Case Studies. The design emphasizes visual appeal through animated shader backgrounds, smooth interactions, and responsive layouts that work seamlessly across all device sizes.

### Key Design Principles

1. **Visual Excellence**: Animated shader backgrounds create a modern, premium feel
2. **Performance First**: Optimized animations maintain 60fps across all interactions
3. **Responsive Design**: Mobile-first approach with breakpoints at 640px (sm), 768px (md), and 1024px (lg)
4. **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
5. **Component Reusability**: Modular components that can be composed and reused

### Technology Stack

- **Framework**: React 19.2.6 with TypeScript 6.0.2
- **Build Tool**: Vite 8.0.12
- **Styling**: Tailwind CSS 4.3.0
- **Animations**: shaders/react 2.5.128 for background effects
- **Icons**: lucide-react 1.16.0
- **Routing**: react-router-dom 7.15.1

## Architecture

### Component Hierarchy

```
App
├── LandingPage
│   ├── HeroSection
│   │   ├── ShaderOverlay
│   │   ├── Navbar
│   │   │   ├── Logo
│   │   │   ├── NavLinks
│   │   │   ├── LondonClock
│   │   │   ├── CTAButton (with TextRollAnimation)
│   │   │   └── MobileMenuButton
│   │   ├── MobileMenu
│   │   │   ├── NavLinks
│   │   │   └── CloseButton
│   │   └── HeroContent
│   │       ├── PillLabel
│   │       ├── Headline
│   │       ├── CTAButton (with TextRollAnimation)
│   │       └── PartnerBadge
│   ├── AboutSection
│   │   ├── NumberedBadge
│   │   ├── PillLabel
│   │   ├── Heading
│   │   ├── ContentGrid
│   │   │   ├── Image (small)
│   │   │   ├── Image (large)
│   │   │   └── CTAButton
│   └── CaseStudiesSection
│       ├── NumberedBadge
│       ├── PillLabel
│       ├── Heading
│       └── VideoGrid
│           ├── VideoCard (Risk Detection)
│           │   ├── Video
│           │   ├── Title
│           │   └── ExpandableButton
│           └── VideoCard (Smart Redlining)
│               ├── Video
│               ├── Title
│               └── ExpandableButton
```

### Data Flow

The landing page is primarily a presentational application with minimal state management:

1. **Static Content**: Most content is hardcoded in components (headlines, labels, descriptions)
2. **Dynamic State**:
   - London Clock: Updates every second using `setInterval`
   - Mobile Menu: Open/closed state managed by `useState`
   - Hover States: Managed by CSS and inline event handlers
   - Video Playback: Autoplay controlled by HTML5 video attributes

3. **No External Data**: All content, images, and videos are referenced by URL or embedded directly

### State Management Strategy

Given the simplicity of the application, we'll use React's built-in state management:

- **Component-level state** (`useState`): For mobile menu toggle, hover states
- **No global state**: Not needed for this landing page
- **No context**: Component tree is shallow enough for prop drilling
- **Custom hooks**: `useLondonTime` for clock functionality

## Components and Interfaces

### Core Components

#### 1. ShaderOverlay

**Purpose**: Renders animated background effects using the shaders package

**Props**:
```typescript
interface ShaderOverlayProps {
  className?: string;
}
```

**Configuration**:
```typescript
const shaderConfig = {
  swirl: {
    colorA: '#ffffff',
    colorB: '#f0f0f0',
    detail: 1.7
  },
  chromaFlow: {
    baseColor: '#ffffff',
    downColor: '#ff5f03',
    leftColor: '#ff5f03',
    rightColor: '#ff5f03',
    upColor: '#ff5f03',
    momentum: 13,
    radius: 3.5
  },
  flutedGlass: {
    aberration: 0.61,
    angle: 31,
    frequency: 8,
    highlight: 0.12,
    highlightSoftness: 0,
    lightAngle: -90,
    refraction: 4,
    shape: 'rounded',
    softness: 1,
    speed: 0.15
  },
  filmGrain: {
    strength: 0.05
  }
};
```

**Implementation Notes**:
- Use `shaders/react` package components: `<Swirl>`, `<ChromaFlow>`, `<FlutedGlass>`, `<FilmGrain>`
- Layer shaders using absolute positioning with `z-index` management
- Ensure shaders don't block pointer events on content (`pointer-events: none`)

#### 2. Navbar

**Purpose**: Fixed navigation bar with logo, links, clock, and CTA

**Props**:
```typescript
interface NavbarProps {
  onMobileMenuToggle: () => void;
}
```

**Layout Structure**:
- Container: `max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8`
- Pill shape: `rounded-full bg-white shadow-lg`
- Flexbox layout: `flex items-center justify-between`
- Sections:
  - Left: Logo (dark circle with "LX" text)
  - Center: Nav links (hidden on mobile: `hidden md:flex`)
  - Right: Platform text, London clock, CTA button

**Responsive Behavior**:
- Desktop (≥768px): Show all elements
- Mobile (<768px): Hide nav links and platform text, show mobile menu button

#### 3. Logo

**Purpose**: Brand identifier in navbar

**Props**:
```typescript
interface LogoProps {
  className?: string;
}
```

**Styling**:
- Circle: `w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full`
- Text: "LX" in white, centered

#### 4. LondonClock

**Purpose**: Display real-time London time

**Props**:
```typescript
interface LondonClockProps {
  className?: string;
}
```

**State**:
```typescript
interface ClockState {
  time: string; // Format: "HH:MM:SS"
}
```

**Implementation**:
- Use `Intl.DateTimeFormat` with `timeZone: 'Europe/London'`
- Update every 1000ms using `setInterval`
- Clean up interval on unmount
- Display clock icon from lucide-react

#### 5. MobileMenu

**Purpose**: Overlay menu for mobile navigation

**Props**:
```typescript
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Animation**:
- Slide up from bottom: `transform: translateY(100%)` → `translateY(0)`
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Duration: 400ms
- Focus trap: Trap keyboard focus within menu when open
- Backdrop: Semi-transparent overlay behind menu

**Accessibility**:
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby="mobile-menu-title"`
- Focus first element on open
- Restore focus to trigger button on close

#### 6. CTAButton (with TextRollAnimation)

**Purpose**: Call-to-action button with hover animation

**Props**:
```typescript
interface CTAButtonProps {
  children: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}
```

**Text Roll Animation**:
- Structure: Two identical text spans stacked vertically
- Container: `overflow: hidden`, fixed height
- Initial state: First span visible, second span below viewport
- Hover state: Both spans translate up by 100%
- Transition: `transform 300ms cubic-bezier(0.4, 0, 0.2, 1)`

**Variants**:
- Primary: Orange background (#F26522), white text
- Secondary: White background, dark text

**Implementation**:
```typescript
<button className="relative overflow-hidden group">
  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
    {children}
  </span>
  <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
    {children}
  </span>
</button>
```

#### 7. PillLabel

**Purpose**: Rounded label for section identifiers

**Props**:
```typescript
interface PillLabelProps {
  children: string;
  className?: string;
}
```

**Styling**:
- `rounded-full px-4 py-1.5`
- `text-xs sm:text-sm tracking-wide uppercase`
- Background: White or light gray depending on section

#### 8. NumberedBadge

**Purpose**: Circular badge displaying section number

**Props**:
```typescript
interface NumberedBadgeProps {
  number: string; // "02", "03"
  className?: string;
}
```

**Styling**:
- Circle: `w-12 h-12 sm:w-14 sm:h-14`
- Border: `border-2 border-gray-900`
- Text: Centered, bold

#### 9. HeroContent

**Purpose**: Main hero section content with headline and CTAs

**Props**:
```typescript
interface HeroContentProps {
  className?: string;
}
```

**Content Structure**:
- Label: "Lexa AI" (13px/14px, tracking-wide)
- Headline: Multi-line with responsive font sizing using `clamp()`
  - "AI-powered contract review"
  - "and intelligent redlining"
  - "for modern legal workflows."
- Primary CTA: "Start Reviewing" (orange button)
- Partner Badge: White pill with AI Verified icon + "Secure Platform" text

**Responsive Typography**:
```css
font-size: clamp(2rem, 5vw, 4rem);
```

#### 10. VideoCard

**Purpose**: Interactive card with autoplay video and expandable description

**Props**:
```typescript
interface VideoCardProps {
  title: string;
  description: string;
  videoUrl: string;
  className?: string;
}
```

**State**:
```typescript
interface VideoCardState {
  isExpanded: boolean;
}
```

**Video Configuration**:
- Autoplay: `autoPlay={true}`
- Muted: `muted={true}`
- Loop: `loop={true}`
- Playsinline: `playsInline={true}`
- Controls: `controls={false}`

**Expandable Button Animation**:
- Initial state: Compact button with arrow icon at -45deg
- Hover state: Button expands to show full description, arrow rotates to 0deg
- Transition: `all 300ms cubic-bezier(0.4, 0, 0.2, 1)`
- Arrow icon: Use lucide-react `ArrowUpRight`

**Implementation**:
```typescript
<div className="group relative">
  <video autoPlay muted loop playsInline>
    <source src={videoUrl} type="video/mp4" />
  </video>
  <button className="transition-all duration-300 group-hover:w-full">
    <span className="hidden group-hover:inline">{description}</span>
    <ArrowUpRight className="transition-transform duration-300 -rotate-45 group-hover:rotate-0" />
  </button>
</div>
```

## Data Models

### Configuration Constants

```typescript
// Shader configuration
export const SHADER_CONFIG = {
  swirl: {
    colorA: '#ffffff',
    colorB: '#f0f0f0',
    detail: 1.7
  },
  chromaFlow: {
    baseColor: '#ffffff',
    downColor: '#ff5f03',
    leftColor: '#ff5f03',
    rightColor: '#ff5f03',
    upColor: '#ff5f03',
    momentum: 13,
    radius: 3.5
  },
  flutedGlass: {
    aberration: 0.61,
    angle: 31,
    frequency: 8,
    highlight: 0.12,
    highlightSoftness: 0,
    lightAngle: -90,
    refraction: 4,
    shape: 'rounded' as const,
    softness: 1,
    speed: 0.15
  },
  filmGrain: {
    strength: 0.05
  }
} as const;

// Navigation links
export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Security', href: '#security' },
  { label: 'Contact', href: '#contact' }
] as const;

// About section images
export const ABOUT_IMAGES = {
  small: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85',
    aspectRatio: '438/346',
    alt: 'Lexa AI platform interface preview'
  },
  large: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85',
    aspectRatio: '3/2',
    alt: 'Lexa AI contract review dashboard'
  }
} as const;

// Case study videos
export const CASE_STUDY_VIDEOS = [
  {
    id: 'risk-detection',
    title: 'Risk Detection',
    description: 'AI-powered risk analysis identifies potential issues in contracts automatically',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4'
  },
  {
    id: 'smart-redlining',
    title: 'Smart Redlining',
    description: 'Intelligent redlining suggestions streamline contract negotiation workflows',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4'
  }
] as const;
```

### Type Definitions

```typescript
// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface VideoData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface ImageData {
  url: string;
  aspectRatio: string;
  alt: string;
}
```

## Error Handling

### Video Loading Errors

**Strategy**: Graceful degradation with fallback UI

**Implementation**:
```typescript
const [videoError, setVideoError] = useState(false);

<video
  onError={() => setVideoError(true)}
  autoPlay
  muted
  loop
  playsInline
>
  <source src={videoUrl} type="video/mp4" />
</video>

{videoError && (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
    <p className="text-gray-600">Video unavailable</p>
  </div>
)}
```

### Image Loading Errors

**Strategy**: Show placeholder with error message

**Implementation**:
```typescript
const [imageError, setImageError] = useState(false);

<img
  src={imageUrl}
  alt={alt}
  onError={() => setImageError(true)}
  className={imageError ? 'hidden' : ''}
/>

{imageError && (
  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
    <p className="text-gray-500">Image unavailable</p>
  </div>
)}
```

### Shader Loading Errors

**Strategy**: Fallback to static background color

**Implementation**:
```typescript
try {
  return <ShaderOverlay config={SHADER_CONFIG} />;
} catch (error) {
  console.error('Shader initialization failed:', error);
  return <div className="absolute inset-0 bg-[#EFEFEF]" />;
}
```

### Clock Initialization Errors

**Strategy**: Show static placeholder time

**Implementation**:
```typescript
const [clockError, setClockError] = useState(false);

useEffect(() => {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    // ... rest of clock logic
  } catch (error) {
    console.error('Clock initialization failed:', error);
    setClockError(true);
  }
}, []);

{clockError ? '--:--:--' : time}
```

## Testing Strategy

This landing page is primarily a UI/presentation feature with rendering, layout, and interaction concerns. Property-based testing is not applicable here. Instead, we'll use:

### Unit Tests

**Focus**: Individual component behavior and rendering

**Test Framework**: Vitest + React Testing Library

**Test Cases**:

1. **Component Rendering**:
   - Verify each component renders without crashing
   - Check that required props are passed correctly
   - Validate default prop values

2. **Text Roll Animation**:
   - Verify button contains two text spans
   - Check hover class application
   - Validate animation timing

3. **London Clock**:
   - Verify clock initializes with valid time format
   - Check that time updates (mock setInterval)
   - Validate timezone handling

4. **Mobile Menu**:
   - Verify menu opens/closes on button click
   - Check animation classes are applied
   - Validate focus trap behavior

5. **Video Card**:
   - Verify video element has correct attributes (autoplay, muted, loop)
   - Check expandable button shows/hides description on hover
   - Validate arrow icon rotation

6. **Responsive Behavior**:
   - Test component visibility at different breakpoints
   - Verify layout changes (grid to stack)
   - Check mobile menu visibility

7. **Error Handling**:
   - Test video error fallback
   - Test image error fallback
   - Test clock initialization error

**Example Test**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CTAButton } from './CTAButton';

describe('CTAButton', () => {
  it('renders with text roll animation structure', () => {
    render(<CTAButton>Get Started</CTAButton>);
    const spans = screen.getAllByText('Get Started');
    expect(spans).toHaveLength(2);
  });

  it('applies hover classes on mouse enter', () => {
    const { container } = render(<CTAButton>Get Started</CTAButton>);
    const button = container.querySelector('button');
    fireEvent.mouseEnter(button!);
    expect(button).toHaveClass('group');
  });
});
```

### Integration Tests

**Focus**: Component interactions and user flows

**Test Cases**:

1. **Navigation Flow**:
   - Click nav link → verify scroll to section
   - Click mobile menu → verify menu opens → click link → verify menu closes

2. **Hero Section**:
   - Verify all hero elements render together
   - Check CTA button click behavior
   - Validate shader overlay doesn't block interactions

3. **About Section**:
   - Verify images load correctly
   - Check responsive grid layout
   - Validate CTA button in context

4. **Case Studies Section**:
   - Verify both video cards render
   - Check videos autoplay
   - Validate expandable buttons work independently

**Example Integration Test**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LandingPage } from './LandingPage';

describe('LandingPage Integration', () => {
  it('opens and closes mobile menu', () => {
    render(<LandingPage />);
    
    // Menu should be closed initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Click mobile menu button
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Menu should be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Click close button
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    
    // Menu should be closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

### Visual Regression Tests

**Focus**: UI appearance and layout consistency

**Tool**: Playwright with screenshot comparison

**Test Cases**:
1. Hero section desktop view
2. Hero section mobile view
3. About section responsive layouts
4. Case studies section with videos
5. Mobile menu open state
6. Hover states for buttons

### Accessibility Tests

**Focus**: WCAG AA compliance

**Tool**: axe-core with jest-axe or vitest-axe

**Test Cases**:
1. Color contrast ratios
2. Keyboard navigation
3. Focus indicators
4. ARIA labels and roles
5. Semantic HTML structure
6. Screen reader compatibility

**Example Accessibility Test**:
```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Navbar } from './Navbar';

expect.extend(toHaveNoViolations);

describe('Navbar Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Navbar onMobileMenuToggle={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Performance Tests

**Focus**: Animation performance and load times

**Metrics**:
1. First Contentful Paint (FCP) < 1.5s
2. Largest Contentful Paint (LCP) < 2.5s
3. Cumulative Layout Shift (CLS) < 0.1
4. Animation frame rate ≥ 60fps

**Tools**:
- Lighthouse CI for performance metrics
- Chrome DevTools Performance profiler
- React DevTools Profiler

## Implementation Notes

### Tailwind CSS Configuration

**Custom Colors**:
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        'lexa-orange': '#F26522',
        'lexa-gray': '#EFEFEF'
      }
    }
  }
}
```

### Animation Utilities

**Custom Tailwind Animations**:
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'text-roll': 'textRoll 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' }
        },
        textRoll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' }
        }
      }
    }
  }
}
```

### Custom Hooks

**useLondonTime**:
```typescript
import { useState, useEffect } from 'react';

export function useLondonTime() {
  const [time, setTime] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const updateTime = () => {
        setTime(formatter.format(new Date()));
      };

      updateTime(); // Initial call
      const interval = setInterval(updateTime, 1000);

      return () => clearInterval(interval);
    } catch (err) {
      console.error('Failed to initialize London time:', err);
      setError(true);
    }
  }, []);

  return { time: error ? '--:--:--' : time, error };
}
```

**useMediaQuery**:
```typescript
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
```

### Shader Integration

**Layering Strategy**:
```typescript
<div className="relative min-h-screen bg-[#EFEFEF]">
  {/* Base background */}
  <div className="absolute inset-0 bg-[#EFEFEF]" />
  
  {/* Shader layers */}
  <div className="absolute inset-0 pointer-events-none">
    <Swirl {...SHADER_CONFIG.swirl} />
  </div>
  <div className="absolute inset-0 pointer-events-none">
    <ChromaFlow {...SHADER_CONFIG.chromaFlow} />
  </div>
  <div className="absolute inset-0 pointer-events-none">
    <FlutedGlass {...SHADER_CONFIG.flutedGlass} />
  </div>
  <div className="absolute inset-0 pointer-events-none">
    <FilmGrain {...SHADER_CONFIG.filmGrain} />
  </div>
  
  {/* Content */}
  <div className="relative z-10">
    {/* Navbar, Hero content, etc. */}
  </div>
</div>
```

### Responsive Breakpoints

**Tailwind Default Breakpoints**:
- `sm`: 640px (small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (large desktops)

**Usage Strategy**:
- Mobile-first approach: Base styles for mobile, then add breakpoint modifiers
- Hide/show elements: `hidden md:flex` (hidden on mobile, flex on tablet+)
- Layout changes: `flex-col md:flex-row` (stack on mobile, row on tablet+)
- Grid columns: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### Video Optimization

**Best Practices**:
1. Use `playsInline` to prevent fullscreen on iOS
2. Set `muted` to allow autoplay (browser requirement)
3. Use `loop` for continuous playback
4. Disable `controls` for cleaner UI
5. Provide fallback content for unsupported browsers

**Loading Strategy**:
```typescript
<video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata" // Load metadata only, not full video
  poster={posterImage} // Show poster while loading
>
  <source src={videoUrl} type="video/mp4" />
  <p>Your browser does not support the video tag.</p>
</video>
```

### Accessibility Implementation

**Keyboard Navigation**:
- All interactive elements must be focusable
- Tab order must be logical
- Focus indicators must be visible
- Escape key closes mobile menu

**Screen Reader Support**:
```typescript
// Mobile menu button
<button
  aria-label="Open navigation menu"
  aria-expanded={isMenuOpen}
  aria-controls="mobile-menu"
>
  <Menu />
</button>

// Mobile menu
<div
  id="mobile-menu"
  role="dialog"
  aria-modal="true"
  aria-labelledby="mobile-menu-title"
>
  <h2 id="mobile-menu-title" className="sr-only">
    Navigation Menu
  </h2>
  {/* Menu content */}
</div>

// Video
<video aria-label="Risk detection demonstration video">
  <source src={videoUrl} type="video/mp4" />
</video>
```

**Focus Management**:
```typescript
// Focus trap for mobile menu
import { useEffect, useRef } from 'react';

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus first element in menu
      const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    } else {
      // Restore focus when menu closes
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Trap focus within menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    
    if (e.key === 'Tab') {
      const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements || focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  return (
    <div ref={menuRef} onKeyDown={handleKeyDown}>
      {/* Menu content */}
    </div>
  );
}
```

## File Structure

```
src/
├── components/
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── CaseStudiesSection.tsx
│   │   └── LandingPage.tsx
│   ├── navigation/
│   │   ├── Navbar.tsx
│   │   ├── Logo.tsx
│   │   ├── NavLinks.tsx
│   │   ├── MobileMenu.tsx
│   │   └── LondonClock.tsx
│   ├── ui/
│   │   ├── CTAButton.tsx
│   │   ├── PillLabel.tsx
│   │   ├── NumberedBadge.tsx
│   │   ├── VideoCard.tsx
│   │   └── ShaderOverlay.tsx
│   └── icons/
│       └── AIVerifiedIcon.tsx
├── hooks/
│   ├── useLondonTime.ts
│   ├── useMediaQuery.ts
│   └── useFocusTrap.ts
├── constants/
│   ├── shaderConfig.ts
│   ├── navigation.ts
│   ├── images.ts
│   └── videos.ts
├── types/
│   └── index.ts
├── utils/
│   └── animations.ts
└── App.tsx
```

## Performance Considerations

### Code Splitting

**Strategy**: Lazy load sections that are below the fold

```typescript
import { lazy, Suspense } from 'react';

const AboutSection = lazy(() => import('./components/landing/AboutSection'));
const CaseStudiesSection = lazy(() => import('./components/landing/CaseStudiesSection'));

function LandingPage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<div>Loading...</div>}>
        <AboutSection />
        <CaseStudiesSection />
      </Suspense>
    </>
  );
}
```

### Image Optimization

**Strategy**: Use responsive images with srcset

```typescript
<img
  src={imageUrl}
  srcSet={`
    ${imageUrl}&w=640 640w,
    ${imageUrl}&w=1024 1024w,
    ${imageUrl}&w=1280 1280w
  `}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt={alt}
  loading="lazy"
/>
```

### Video Optimization

**Strategy**: Lazy load videos below the fold

```typescript
<video
  autoPlay
  muted
  loop
  playsInline
  preload="none" // Don't preload until in viewport
  loading="lazy"
>
  <source src={videoUrl} type="video/mp4" />
</video>
```

### Shader Performance

**Considerations**:
- Shaders use WebGL, which can be GPU-intensive
- Monitor frame rate using Chrome DevTools
- Consider reducing shader complexity on low-end devices
- Provide fallback to static background if performance issues detected

**Performance Monitoring**:
```typescript
useEffect(() => {
  let frameCount = 0;
  let lastTime = performance.now();
  
  const checkFPS = () => {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      
      if (fps < 30) {
        console.warn('Low FPS detected, consider disabling shaders');
        // Optionally disable shaders
      }
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(checkFPS);
  };
  
  requestAnimationFrame(checkFPS);
}, []);
```

## Browser Compatibility

**Target Browsers**:
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: iOS 14+
- Chrome Android: Last 2 versions

**Polyfills Required**:
- None (modern browsers only)

**Feature Detection**:
```typescript
// Check for WebGL support (for shaders)
const hasWebGL = (() => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') || 
      canvas.getContext('experimental-webgl')
    );
  } catch (e) {
    return false;
  }
})();

// Fallback if WebGL not supported
{hasWebGL ? <ShaderOverlay /> : <div className="bg-[#EFEFEF]" />}
```

## Deployment Considerations

### Build Configuration

**Vite Configuration**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'shaders': ['shaders/react']
        }
      }
    }
  }
});
```

### Environment Variables

**Not required for this landing page** (all content is static)

### Asset Hosting

**Strategy**: 
- Images and videos are hosted on external CDN (d8j0ntlcm91z4.cloudfront.net)
- No local asset hosting required
- Ensure CORS headers are set on CDN

## Security Considerations

### Content Security Policy

**Recommended CSP Headers**:
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://images.higgs.ai https://d8j0ntlcm91z4.cloudfront.net;
  media-src 'self' https://d8j0ntlcm91z4.cloudfront.net;
  connect-src 'self';
```

### XSS Prevention

**Strategy**: React automatically escapes content, but ensure:
- No `dangerouslySetInnerHTML` usage
- All user input is sanitized (not applicable for static landing page)
- External content URLs are validated

## Future Enhancements

### Potential Additions

1. **Analytics Integration**: Add Google Analytics or similar
2. **A/B Testing**: Test different headlines and CTAs
3. **Contact Form**: Add form in contact section
4. **Blog Integration**: Link to blog posts
5. **Testimonials Section**: Add customer testimonials
6. **Pricing Section**: Add pricing tiers
7. **FAQ Section**: Add frequently asked questions
8. **Dark Mode**: Add dark mode toggle
9. **Internationalization**: Support multiple languages
10. **Animation Controls**: Allow users to reduce motion

### Technical Improvements

1. **Progressive Web App**: Add service worker for offline support
2. **Server-Side Rendering**: Use Next.js for better SEO
3. **Content Management**: Integrate with CMS for easy content updates
4. **Performance Monitoring**: Add real user monitoring (RUM)
5. **Error Tracking**: Integrate Sentry or similar
