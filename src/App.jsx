import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PageLoader from './components/PageLoader';

// Everything except the landing page is code-split: each route's JS only
// downloads when someone actually navigates there, and Suspense shows a
// small spinner during that (usually sub-second) fetch instead of a blank
// screen. This is real, user-visible async behavior today via network
// chunk loading, and the same Suspense boundary will cover future data
// fetching (auth, AI Guide, etc.) without any extra wiring.
const Explore = lazy(() => import('./pages/Explore'));
const DestinationsPage = lazy(() => import('./pages/DestinationsPage'));
const Compare = lazy(() => import('./pages/Compare'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const TripPlanner = lazy(() => import('./pages/TripPlanner'));
const AIGuide = lazy(() => import('./pages/AIGuide'));
const TravelBlog = lazy(() => import('./pages/TravelBlog'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const WriteBlogPost = lazy(() => import('./pages/WriteBlogPost'));
const ExploreCountries = lazy(() => import('./pages/ExploreCountries'));
const SavedDestinations = lazy(() => import('./pages/SavedDestinations'));
const MyVoyora = lazy(() => import('./pages/MyVoyora'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="destinations" element={<DestinationsPage />} />
          <Route path="compare" element={<Compare />} />
          <Route path="destinations/:slug" element={<DestinationDetail />} />
          <Route path="trip-planner" element={<TripPlanner />} />
          <Route path="ai-guide" element={<AIGuide />} />
          <Route path="travel-blog" element={<TravelBlog />} />
          <Route path="travel-blog/write" element={<WriteBlogPost />} />
          <Route path="travel-blog/:slug" element={<BlogPostDetail />} />
          <Route path="explore-countries" element={<ExploreCountries />} />
          <Route path="plan-my-trip" element={<Navigate to="/trip-planner" replace />} />
          <Route path="saved" element={<SavedDestinations />} />
          <Route path="my-voyora" element={<MyVoyora />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
