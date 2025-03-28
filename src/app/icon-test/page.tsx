'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    FontAwesome?: any;
  }
}

export default function IconTestPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Font Awesome is loaded
    const checkFontAwesome = () => {
      if (typeof window !== 'undefined' && window.FontAwesome) {
        setIsLoaded(true);
      } else {
        setTimeout(checkFontAwesome, 100);
      }
    };

    checkFontAwesome();
  }, []);

  // Array of popular Font Awesome icons with metadata
  const icons = [
    { name: 'user', type: 'solid', description: 'User profile' },
    { name: 'heart', type: 'solid', description: 'Like or favorite' },
    { name: 'home', type: 'solid', description: 'Home page' },
    { name: 'search', type: 'solid', description: 'Search functionality' },
    { name: 'cog', type: 'solid', description: 'Settings' },
    { name: 'envelope', type: 'solid', description: 'Email or messages' },
    { name: 'bell', type: 'solid', description: 'Notifications' },
    { name: 'calendar', type: 'solid', description: 'Date and events' },
    { name: 'camera', type: 'solid', description: 'Photos or media' },
    { name: 'lock', type: 'solid', description: 'Security or privacy' },
    { name: 'star', type: 'solid', description: 'Favorite or rating' },
    { name: 'trash', type: 'solid', description: 'Delete' },
    { name: 'download', type: 'solid', description: 'Download files' },
    { name: 'upload', type: 'solid', description: 'Upload files' },
    { name: 'check', type: 'solid', description: 'Success or completion' },
    { name: 'times', type: 'solid', description: 'Close or cancel' },
    { name: 'plus', type: 'solid', description: 'Add new' },
    { name: 'minus', type: 'solid', description: 'Remove or collapse' },
    { name: 'edit', type: 'solid', description: 'Edit or modify' },
    { name: 'save', type: 'solid', description: 'Save changes' },
    // Social Media Icons
    { name: 'github', type: 'brands', description: 'GitHub' },
    { name: 'twitter', type: 'brands', description: 'Twitter/X' },
    { name: 'facebook', type: 'brands', description: 'Facebook' },
    { name: 'linkedin', type: 'brands', description: 'LinkedIn' },
    { name: 'instagram', type: 'brands', description: 'Instagram' },
    // More UI Icons
    { name: 'chart-bar', type: 'solid', description: 'Analytics' },
    { name: 'users', type: 'solid', description: 'Users or group' },
    { name: 'clock', type: 'solid', description: 'Time' },
    { name: 'map-marker', type: 'solid', description: 'Location' },
    { name: 'phone', type: 'solid', description: 'Contact' },
    { name: 'print', type: 'solid', description: 'Print' },
    { name: 'refresh', type: 'solid', description: 'Refresh or reload' },
    { name: 'link', type: 'solid', description: 'Link or URL' },
    { name: 'share', type: 'solid', description: 'Share content' },
    { name: 'filter', type: 'solid', description: 'Filter results' },
    // And so on... up to 100 icons
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Font Awesome Icon Test</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {icons.map((icon, index) => (
          <div 
            key={index}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            {isLoaded ? (
              <i className={`fa-${icon.type} fa-${icon.name} text-3xl mb-2`} aria-hidden="true"></i>
            ) : (
              <div className="w-8 h-8 mb-2 bg-gray-200 rounded-full animate-pulse"></div>
            )}
            <div className="text-sm font-semibold mb-1">fa-{icon.name}</div>
            <div className="text-xs text-gray-600">{icon.description}</div>
            <div className="text-xs text-gray-400 mt-1">Type: {icon.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 