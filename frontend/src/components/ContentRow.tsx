import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentCard } from './ContentCard';

interface ContentRowProps {
  title: string;
  items: any[];
  onOpenDetails: (item: any) => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({ title, items, onOpenDetails }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="group relative mb-8 lg:mb-12">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 md:px-12 drop-shadow-md">{title}</h2>
      
      {/* Seta Esquerda */}
      <div className="absolute top-0 bottom-0 left-0 w-12 bg-black/60 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hidden md:flex" onClick={() => handleScroll('left')}>
        <ChevronLeft size={40} className="text-white hover:scale-125 transition-transform" />
      </div>
      
      {/* Cards */}
      <div 
        ref={rowRef}
        className="flex overflow-x-auto gap-2 px-4 md:px-12 scrollbar-hide scroll-smooth py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map(item => (
          <div key={item.id} className="flex-none w-[110px] sm:w-[150px] md:w-[200px]">
            <ContentCard item={item} onOpenDetails={onOpenDetails} />
          </div>
        ))}
      </div>

      {/* Seta Direita */}
      <div className="absolute top-0 bottom-0 right-0 w-12 bg-black/60 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hidden md:flex" onClick={() => handleScroll('right')}>
        <ChevronRight size={40} className="text-white hover:scale-125 transition-transform" />
      </div>
    </div>
  );
};
