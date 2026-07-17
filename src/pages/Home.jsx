import Hero from '../components/Hero';
import Destinations from '../components/Destinations';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Home() {
  usePageTitle(null);
  return (
    <>
      <Hero />
      <Destinations />
    </>
  );
}
