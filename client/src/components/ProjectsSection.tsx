import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { LiveProjectButton } from './LiveProjectButton';

interface FeaturedCard {
  id: string;
  title: string;
  category: string;
  col1Img1: string;
  col1Img2: string;
  col2Img: string;
}

const featuredData: FeaturedCard[] = [
  {
    id: '01',
    title: 'Royal Indian Feast',
    category: 'Signature Cuisines',
    col1Img1: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    col1Img2: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    col2Img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '02',
    title: 'Artisan Italian & Pizza',
    category: 'Gourmet Kitchens',
    col1Img1: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    col1Img2: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    col2Img: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '03',
    title: 'Asian Fusion & Sushi',
    category: 'Premium Selection',
    col1Img1: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    col1Img2: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
    col2Img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
  },
];

interface CardProps {
  card: FeaturedCard;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
}

const FeaturedCardItem: React.FC<CardProps> = ({ card, index, totalCards, progress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / totalCards, 1], [1, targetScale]);

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="h-[85vh] flex items-start justify-center sticky top-24 md:top-32"
    >
      <motion.div
        style={{
          scale,
          top: `${index * 28}px`,
        }}
        className="w-full max-w-6xl relative rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA]/30 bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col gap-6 shadow-2xl overflow-hidden"
      >
        {/* Card Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 w-full border-b border-[#D7E2EA]/20 pb-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hero-heading font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight">
              {card.id}
            </span>
            <div className="flex flex-col">
              <span className="text-[#E23744] uppercase font-light text-xs sm:text-sm tracking-widest">
                {card.category}
              </span>
              <h3 className="text-[#D7E2EA] font-medium text-lg sm:text-2xl md:text-3xl uppercase tracking-wide">
                {card.title}
              </h3>
            </div>
          </div>

          <LiveProjectButton label="Order Collection" onClick={scrollToMenu} />
        </div>

        {/* Card Images Grid (2 columns: 40% left, 60% right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full items-stretch flex-1">
          {/* Left Column (40% / 5 cols) - 2 Stacked Images */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="w-full h-[clamp(130px,16vw,230px)] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#18181A]">
              <img
                src={card.col1Img1}
                alt={`${card.title} Detail 1`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="w-full h-[clamp(160px,22vw,340px)] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#18181A]">
              <img
                src={card.col1Img2}
                alt={`${card.title} Detail 2`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column (60% / 7 cols) - 1 Tall Image */}
          <div className="md:col-span-7 rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#18181A] min-h-[280px]">
            <img
              src={card.col2Img}
              alt={`${card.title} Main Preview`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="featured"
      ref={targetRef}
      className="w-full bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-20 pb-32 px-5 sm:px-8 md:px-10 relative z-10"
    >
      {/* Section Heading */}
      <FadeIn delay={0} y={40} className="w-full text-center mb-16 sm:mb-20 md:mb-28">
        <h2 className="hero-heading font-black uppercase tracking-tight leading-none text-[clamp(3rem,12vw,160px)]">
          Featured
        </h2>
      </FadeIn>

      {/* Sticky Stacking Cards Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col">
        {featuredData.map((card, index) => (
          <FeaturedCardItem
            key={card.id}
            card={card}
            index={index}
            totalCards={featuredData.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
};
