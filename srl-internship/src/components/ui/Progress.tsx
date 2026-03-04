import { cn } from '../../lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export function Progress({ className, value, ...props }: ProgressProps) {
  const progress = value || 0;
  return (
    <div
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-gray-200', className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-indigo-600 transition-all"
        style={{ transform: `translateX(-${100 - (progress || 0)}%)` }}
      />
    </div>
  );
}
