import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetail from './pages/DestinationDetail';
import TripPlanner from './pages/TripPlanner';
import AIGuide from './pages/AIGuide';
import TravelBlog from './pages/TravelBlog';
import ExploreCountries from './pages/ExploreCountries';
import PlanMyTrip from './pages/PlanMyTrip';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="destinations/:slug" element={<DestinationDetail />} />
        <Route path="trip-planner" element={<TripPlanner />} />
        <Route path="ai-guide" element={<AIGuide />} />
        <Route path="travel-blog" element={<TravelBlog />} />
        <Route path="explore-countries" element={<ExploreCountries />} />
        <Route path="plan-my-trip" element={<PlanMyTrip />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
