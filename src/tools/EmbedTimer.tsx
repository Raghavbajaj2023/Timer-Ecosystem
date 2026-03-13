import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TimerEngine } from '../App';

const EmbedTimer = () => {
  const [searchParams] = useSearchParams();
  const duration = parseInt(searchParams.get('duration') || '300');
  const activity = searchParams.get('activity') || 'Timer';

  return (
    <div className="w-full h-full flex items-center justify-center bg-navy-900 text-white">
      <TimerEngine 
        initialSeconds={duration} 
        title={activity}
        type="timer"
      />
    </div>
  );
};

export default EmbedTimer;
