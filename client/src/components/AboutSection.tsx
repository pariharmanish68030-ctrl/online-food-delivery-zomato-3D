import React from 'react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';

export const AboutSection: React.FC = () => {
  const aboutText = "With years of culinary excellence and state-of-the-art 3D interactive ordering, Zomato connects food lovers with top chefs and artisan kitchens. Experience ultra-fast zone dispatch, live GPS order tracking, and hand-picked gourmet dining at your doorstep!";

  return (
    <section 
      id="about" 
      className="relative w-full min-h-screen bg-[#0C0C0C] flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden"
    >
      {/* Corner Decorative 3D Elements */}
      {/* Top-Left Moon / 3D Icon */}
      <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none z-10">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="3D Floating Element"
            className="w-full h-auto object-contain"
          />
        </FadeIn>
      </div>

      {/* Bottom-Left 3D Object */}
      <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] pointer-events-none z-10">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="3D Culinary Element"
            className="w-full h-auto object-contain"
          />
        </FadeIn>
      </div>

      {/* Top-Right Lego / 3D Icon */}
      <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none z-10">
        <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="3D Spice Icon"
            className="w-full h-auto object-contain"
          />
        </FadeIn>
      </div>

      {/* Bottom-Right 3D Group */}
      <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] pointer-events-none z-10">
        <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt="3D Dining Group"
            className="w-full h-auto object-contain"
          />
        </FadeIn>
      </div>

      {/* Center Content Container */}
      <div className="flex flex-col items-center max-w-4xl z-20 text-center">
        {/* Heading */}
        <FadeIn delay={0} y={40} className="w-full text-center">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)]">
            About Zomato
          </h2>
        </FadeIn>

        {/* Character opacity reveal text */}
        <div className="mt-10 sm:mt-14 md:mt-16 mb-16 sm:mb-20 md:mb-24 flex justify-center w-full">
          <AnimatedText text={aboutText} />
        </div>

        {/* Action Button */}
        <FadeIn delay={0.2} y={30}>
          <ContactButton
            label="Explore Menu"
            onClick={() => {
              const el = document.getElementById('menu');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </FadeIn>
      </div>
    </section>
  );
};
