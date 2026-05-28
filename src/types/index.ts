import type { ReactNode } from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
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
