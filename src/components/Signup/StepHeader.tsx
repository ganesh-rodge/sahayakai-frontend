import React from 'react';

interface StepHeaderProps {
  title: string;
  subtitle: string;
  current: number; // 1-indexed
  total: number;
}

export default function StepHeader({ title, subtitle, current, total }: StepHeaderProps) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="text-center mb-8">
      <div className="flex items-center gap-2 justify-center mb-4">
        <img src="/Sahayak%20AI%20logo.png" alt="Sahayak AI" className="h-10 w-auto" />
      </div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-400">{subtitle}</p>
      <div className="flex items-center justify-center mt-6">
        <div className="flex items-center gap-2">
          {steps.map((s, idx) => {
            const isActive = s === current;
            const isDone = s < current;
            const last = idx === steps.length - 1;
            return (
              <React.Fragment key={s}>
                <div
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                    isActive ? 'bg-accent text-dark-primary' : isDone ? 'bg-accent/30 text-white' : 'bg-gray-700 text-gray-400',
                  ].join(' ')}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? '✓' : s}
                </div>
                {!last && (
                  <div className={['h-1 w-16 sm:w-20', isDone ? 'bg-accent' : 'bg-gray-700'].join(' ')} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
