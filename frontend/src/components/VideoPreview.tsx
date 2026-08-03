import React from 'react';
import api from '../api/api';

interface VideoPreviewProps {
  url: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ url }) => {
  if (!url) return null;

  let processedUrl = url;
  if (!url.startsWith('http') && url.trim().length > 0) {
    processedUrl = `${api.defaults.baseURL}/client/stream?path=${encodeURIComponent(url)}`;
  }

  const isYouTube = url.includes('youtube.com/watch') || url.includes('youtu.be/');

  return (
    <div className="mt-2 w-full max-w-sm aspect-video bg-black rounded overflow-hidden border border-gray-700 shadow-md">
      {isYouTube ? (() => {
        let ytId = '';
        if (url.includes('youtube.com/watch')) {
          try {
            const urlObj = new URL(url);
            ytId = urlObj.searchParams.get('v') || '';
          } catch(e) {}
        } else if (url.includes('youtu.be/')) {
          ytId = url.split('youtu.be/')[1].split('?')[0];
        }
        return (
          <iframe 
            src={`https://www.youtube.com/embed/${ytId}?rel=0&showinfo=0`} 
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        );
      })() : (
        <video 
          src={processedUrl} 
          controls 
          className="w-full h-full object-contain bg-black"
        />
      )}
    </div>
  );
};
