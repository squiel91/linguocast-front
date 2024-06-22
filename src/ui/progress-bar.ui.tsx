import { useEffect, useRef } from 'react';
import { cn } from "@/utils/styles.utils";
import { ClassValue } from "clsx";

interface Props {
  duration: number; // Duration in seconds
  className?: ClassValue;
}

export const ProgressBar = ({ duration, className }: Props) => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progressBar = progressRef.current;
    if (progressBar) {
      // Set initial width to 0
      progressBar.style.transitionDuration = '0';
      progressBar.style.width = '0%';
      
      // Trigger reflow to ensure the initial state is applied
      progressBar.offsetHeight;

      // Set final width to 100%
      setTimeout(() => {
        progressBar.style.transitionProperty = 'width';
        progressBar.style.transitionDuration = `${duration}s`;
        progressBar.style.transitionTimingFunction = 'ease-out';
        progressBar.style.width = '100%';
      }, 100)
    }
  }, [duration]);

  return (
    <div className={cn('bg-slate-200 flex-grow h-2 w-full overflow-hidden flex justify-end', className)}>
      <div
        ref={progressRef}
        className="h-full w-0 bg-white"
      />
    </div>
  );
};
