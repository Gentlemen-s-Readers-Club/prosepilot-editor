import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ id, checked, onChange, disabled = false, className }: CheckboxProps) {
  return (
    <div className="relative top-[2px]">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={cn(
          "flex items-center justify-center w-4 h-4 border-2 rounded cursor-pointer transition-all duration-200",
          checked
            ? "bg-accent border-accent"
            : "bg-white border-gray-300 hover:border-accent",
          disabled && "opacity-50 cursor-not-allowed",
          "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-1",
          className
        )}
      >
        {checked && (
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        )}
      </label>
    </div>
  );
}