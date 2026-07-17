import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Page Not Found');
  return (
    <>
      <PageHeader
        icon={Compass}
        eyebrow="404"
        title="You've wandered off the map"
        subtitle="We couldn't find that page."
      />
      <div className="mx-auto max-w-xl px-6 pb-24 text-center lg:px-10">
        <Link
          to="/"
          className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)]"
        >
          Back home
        </Link>
      </div>
    </>
  );
}
