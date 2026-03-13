import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ScalableTimerPage from './ScalableTimerPage';
import ScalableHubPage from './ScalableHubPage';

const SlugResolver = () => {
  const { slug } = useParams();

  if (!slug) return <Navigate to="/" />;

  if (slug.endsWith('-timers')) {
    return <ScalableHubPage />;
  } else if (slug.endsWith('-timer')) {
    return <ScalableTimerPage />;
  }

  // Fallback
  return <Navigate to="/timers" />;
};

export default SlugResolver;
