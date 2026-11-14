import React from 'react';

export type IconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'chevron-down'
  | 'menu'
  | 'close'
  | 'calendar'
  | 'search'
  | 'heart'
  | 'users'
  | 'user'
  | 'flask'
  | 'video'
  | 'shield'
  | 'layers'
  | 'leaf'
  | 'clock'
  | 'file'
  | 'file-text'
  | 'lock'
  | 'message'
  | 'chat'
  | 'phone'
  | 'star'
  | 'heartbeat'
  | 'stethoscope'
  | 'building'
  | 'bed'
  | 'plus'
  | 'settings'
  | 'map-pin'
  | 'check';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const iconPaths: Record<IconName, { viewBox: string; content: React.ReactNode }> = {
  'arrow-right': {
    viewBox: '0 0 24 24',
    content: <path d="M5 12h14m-6-6 6 6-6 6" />,
  },
  'arrow-left': {
    viewBox: '0 0 24 24',
    content: <path d="M19 12H5m6-6-6 6 6 6" />,
  },
  'chevron-down': {
    viewBox: '0 0 24 24',
    content: <path d="m6 9 6 6 6-6" />,
  },
  menu: {
    viewBox: '0 0 24 24',
    content: <path d="M4 7h16M4 12h16M4 17h16" />,
  },
  close: {
    viewBox: '0 0 24 24',
    content: <path d="M5 5 19 19M19 5 5 19" />,
  },
  calendar: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
  },
  search: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
  },
  heart: {
    viewBox: '0 0 24 24',
    content: (
      <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z" />
    ),
  },
  users: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m15-10a4 4 0 1 0 0-8m5 18v-2a4 4 0 0 0-3-3.87" />
        <circle cx="9" cy="6" r="4" />
      </>
    ),
  },
  flask: {
    viewBox: '0 0 24 24',
    content: <path d="M9 2h6m-4 0v7L5 19.5A2 2 0 0 0 6.7 22h10.6a2 2 0 0 0 1.7-2.5L13 9V2M8 16h8" />,
  },
  video: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <rect x="2" y="5" width="14" height="14" rx="3" />
        <path d="m16 10 6-4v12l-6-4" />
      </>
    ),
  },
  shield: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path d="m12 2 9 4v6c0 5.2-3.5 8.1-9 10-5.5-1.9-9-4.8-9-10V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
  },
  layers: {
    viewBox: '0 0 24 24',
    content: <path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5" />,
  },
  leaf: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path d="M12 22c-4-3-7-7-7-12V5c6 0 10 3 10 9 0 4-1 6-3 8Zm0 0c4-3 7-7 7-12V5c-6 0-10 3-10 9" />
      </>
    ),
  },
  clock: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  file: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h8m-8 4h5" />
      </>
    ),
  },
  lock: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
  message: {
    viewBox: '0 0 24 24',
    content: <path d="M20 11a8 8 0 0 1-8 8 9 9 0 0 1-4-.9L3 20l1.9-5A8 8 0 1 1 20 11Z" />,
  },
  star: {
    viewBox: '0 0 24 24',
    content: (
      <path d="m12 2 3.1 6.5 7.1 1-5.1 5 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5.1-5 7.1-1L12 2Z" />
    ),
  },
  heartbeat: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path d="M20.3 5.1a5.6 5.6 0 0 0-7.8 0L12 5.7l-.6-.6a5.6 5.6 0 0 0-7.8 8L12 21l8.3-7.9a5.6 5.6 0 0 0 0-8Z" />
        <path d="M3.6 12h5l2-3 2.4 6 2-3h5.4" />
      </>
    ),
  },
  stethoscope: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path d="M6 3v6a5 5 0 0 0 10 0V3M4 3h4m6 0h4M11 14v2a5 5 0 0 0 10 0v-2" />
        <circle cx="21" cy="12" r="2" />
      </>
    ),
  },
  building: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <rect x="4" y="4" width="16" height="17" rx="2" />
        <path d="M9 9h6M12 6v6M8 21v-5h8v5" />
      </>
    ),
  },
  bed: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path d="M3 4v17m0-4h18M6 13v-3a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11M6 13h15" />
      </>
    ),
  },
  user: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </>
    ),
  },
  'file-text': {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </>
    ),
  },
  phone: {
    viewBox: '0 0 24 24',
    content: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
  },
  chat: {
    viewBox: '0 0 24 24',
    content: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
  },
  plus: {
    viewBox: '0 0 24 24',
    content: <path d="M12 4v16M4 12h16" />,
  },
  check: {
    viewBox: '0 0 24 24',
    content: <path d="m4 12 5 5L20 6" />,
  },
  settings: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  },
  'map-pin': {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
};

export const Icon: React.FC<IconProps> = ({
  name,
  className = '',
  size,
  ...props
}) => {
  const icon = iconPaths[name];
  if (!icon) return null;

  const sizeClass =
    size === 'xs'
      ? 'icon-xs'
      : size === 'sm'
      ? 'icon-sm'
      : '';

  return (
    <svg
      viewBox={icon.viewBox}
      className={`icon ${sizeClass} ${className}`.trim()}
      aria-hidden="true"
      {...props}
    >
      {icon.content}
    </svg>
  );
};
