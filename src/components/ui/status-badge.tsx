import { cn } from "../../lib/utils";
import { Status } from "../../store/types";


const STATUS_COLORS = {
  draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  writing: 'bg-blue-100 text-blue-800 border-blue-200',
  reviewing: 'bg-purple-100 text-purple-800 border-purple-200',
  published: 'bg-state-success-light text-state-success border-state-success',
  archived: 'bg-gray-100 text-gray-800 border-gray-200',
  error: 'bg-state-error-light text-state-error border-state-error'
} as const;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
      STATUS_COLORS[status],
      className
    )}>
      {status}
    </span>
  );
}