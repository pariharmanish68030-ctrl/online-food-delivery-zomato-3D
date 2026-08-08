import React from 'react';
import { FadeIn } from './FadeIn';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
}

const servicesData: ServiceItem[] = [
  {
    id: '01',
    name: 'Ultra-Fast Delivery',
    description: 'Hyperlocal rider network dispatching warm meals within 25 minutes across registered city coverage zones.',
  },
  {
    id: '02',
    name: 'Chef Specials',
    description: 'Handcrafted gourmet signature dishes prepared by top-rated city chefs using fresh organic ingredients.',
  },
  {
    id: '03',
    name: 'Live Order Tracking',
    description: 'Real-time visual stepper tracking from kitchen prep, rider pickup, route navigation, to doorstep delivery.',
  },
  {
    id: '04',
    name: 'Zone Coverage',
    description: 'Multi-city coverage system allowing admins to easily manage operational delivery zones, fees, and ETAs.',
  },
  {
    id: '05',
    name: 'Gourmet Catering',
    description: 'Custom bulk orders and party catering menus tailored for office celebrations, events, and family gatherings.',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section 
      id="services" 
      className="w-full bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-0"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Section Heading */}
        <FadeIn delay={0} y={40} className="w-full text-center">
          <h2 className="font-black uppercase tracking-tight leading-none text-[#0C0C0C] text-[clamp(3rem,12vw,160px)] mb-16 sm:mb-20 md:mb-28">
            Services
          </h2>
        </FadeIn>

        {/* Services List */}
        <div className="w-full flex flex-col border-t border-[rgba(12,12,12,0.15)]">
          {servicesData.map((service, index) => (
            <FadeIn key={service.id} delay={index * 0.1} y={30} className="w-full">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.15)] gap-4 md:gap-8 group transition-colors duration-300">
                {/* Service Number */}
                <span className="font-black text-[#0C0C0C] text-[clamp(3rem,10vw,140px)] leading-none select-none min-w-[120px] sm:min-w-[160px] md:min-w-[200px]">
                  {service.id}
                </span>

                {/* Name and Description */}
                <div className="flex flex-col gap-2 max-w-2xl">
                  <h3 className="font-medium uppercase text-[#0C0C0C] text-[clamp(1rem,2.2vw,2.1rem)]">
                    {service.name}
                  </h3>
                  <p className="font-light text-[#0C0C0C] opacity-60 leading-relaxed text-[clamp(0.85rem,1.6vw,1.25rem)]">
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
