import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const GlobeIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>
  </svg>
);

export const LayersIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M12 3l9 5-9 5-9-5 9-5z"/>
    <path d="M3 13l9 5 9-5M3 18l9 5 9-5"/>
  </svg>
);

export const AlertIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M12 3l10 18H2L12 3z"/>
    <path d="M12 10v5M12 18.5v.5"/>
  </svg>
);

export const PulseIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M3 12h4l2-7 4 14 2-7h6"/>
  </svg>
);

export const SatelliteIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M5 10l4-4 9 9-4 4-9-9z"/>
    <path d="M14 5l5 5M9 14l-3 3 1 4 4 1 3-3M2 22l4-4"/>
  </svg>
);

export const ArchiveIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <rect x="3" y="4" width="18" height="4"/>
    <path d="M5 8v12h14V8M10 12h4"/>
  </svg>
);

export const TeamIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <circle cx="9" cy="8" r="3"/>
    <path d="M3 20a6 6 0 0112 0M16 4a3 3 0 010 6M16 14a6 6 0 015 6"/>
  </svg>
);

export const SettingsIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 00-2.1-1.2L14 3h-4l-.5 2.6a7 7 0 00-2.1 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 005 12a7 7 0 00.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 002.1 1.2L10 21h4l.5-2.6a7 7 0 002.1-1.2l2.3.9 2-3.4-2-1.5c.07-.39.1-.79.1-1.2z"/>
  </svg>
);

export const FireIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M12 2c1 4 5 5 5 10a5 5 0 11-10 0c0-2 1-3 2-4-1 4 3 3 3 6"/>
  </svg>
);

export const CycloneIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M12 3a9 9 0 019 9M12 21a9 9 0 01-9-9"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 8a4 4 0 014 4M12 16a4 4 0 01-4-4"/>
  </svg>
);

export const FloodIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M3 14c2 0 2-2 4.5-2S10 14 12 14s2-2 4.5-2S19 14 21 14M3 19c2 0 2-2 4.5-2S10 19 12 19s2-2 4.5-2S19 19 21 19M3 9c2 0 2-2 4.5-2S10 9 12 9s2-2 4.5-2S19 9 21 9"/>
  </svg>
);

export const QuakeIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M2 12h3l2-6 3 14 3-10 3 6 2-4h4"/>
  </svg>
);

export const DroughtIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <circle cx="12" cy="6" r="3"/>
    <path d="M12 2v1M12 9v1M5 6h1M18 6h1M7 4l.7.7M16.3 4l-.7.7M7 8l.7-.7M16.3 8l-.7-.7"/>
    <path d="M3 18h18M5 21h14"/>
  </svg>
);

export const PlayIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6 4l14 8-14 8z"/></svg>
);

export const PauseIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>
);

export const RewindIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M11 5l-9 7 9 7zM22 5l-9 7 9 7z"/></svg>
);

export const ForwardIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13 5l9 7-9 7zM2 5l9 7-9 7z"/></svg>
);

export const ExpandIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>
  </svg>
);

export const DownloadIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M12 3v12M6 11l6 6 6-6M4 21h16"/>
  </svg>
);

import type { EventKind } from '../../types';

export const kindIconComponent = (k: EventKind): React.FC<IconProps> => ({
  wildfire: FireIcon,
  cyclone:  CycloneIcon,
  flood:    FloodIcon,
  quake:    QuakeIcon,
  drought:  DroughtIcon,
}[k]);
