import Hero from '../components/Hero';
import FeatureShowcase from '../components/FeatureShowcase';
import Destinations from '../components/Destinations';
import AccountBenefits from '../components/AccountBenefits';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Home() {
  usePageTitle(null);
  return (
    <>
      <Hero />
      <FeatureShowcase />
      <Destinations />
      <AccountBenefits />
    </>
  );
}
