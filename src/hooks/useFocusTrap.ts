import { useEffect, useRef } from 'react';

export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isActive: boolean) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      // Save current focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus first focusable element
      const firstFocusable = containerRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();

      // Handle Tab key to trap focus
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab' && containerRef.current) {
          const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (focusableElements.length === 0) return;

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

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else if (!isActive && previousFocusRef.current) {
      // Restore previous focus
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isActive, containerRef]);
}
