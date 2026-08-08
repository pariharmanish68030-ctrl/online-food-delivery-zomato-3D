import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Character: React.FC<CharProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="opacity-20">{children}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0 text-[#D7E2EA]">
        {children}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const elementRef = useRef<HTMLParagraphElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: elementRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const characters = text.split('');
  const amount = characters.length;

  return (
    <p
      ref={elementRef}
      className={`text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[640px] text-[clamp(1rem,2vw,1.35rem)] flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.1em] ${className}`}
    >
      {characters.map((char, i) => {
        if (char === ' ') {
          return <span key={i}>&nbsp;</span>;
        }
        const start = i / amount;
        const end = (i + 1) / amount;
        return (
          <Character key={i} progress={scrollYProgress} range={[start, end]}>
            {char}
          </Character>
        );
      })}
    </p>
  );
};
