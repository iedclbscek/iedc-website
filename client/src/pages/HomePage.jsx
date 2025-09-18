// Import home sections
import HeroSection from '../components/home/HeroSection';
import WhatWeDoSection from '../components/home/WhatWeDoSection';
import RoadmapSection from '../components/home/RoadmapSection';
import EventsSection from '../components/home/EventsSection';
import ImpactSection from '../components/home/ImpactSection';
import TeamPreviewSection from '../components/home/TeamPreviewSection';
import CommunitiesSection from '../components/home/CommunitiesSection';
import CtaSection from '../components/home/CtaSection';
import ScrollProgress from '../components/ui/ScrollProgress';

const HomePage = () => {
  return (
    <>
      <ScrollProgress />
      <HeroSection />
      <WhatWeDoSection />
      <RoadmapSection />
      <EventsSection />
      <CommunitiesSection />
      <ImpactSection />
      <TeamPreviewSection />
      <CtaSection />
    </>
  );
};

export default HomePage;
