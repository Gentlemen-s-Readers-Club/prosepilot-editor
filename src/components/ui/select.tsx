import React from 'react';
import Select, { GroupBase, Props as ReactSelectProps, Theme } from 'react-select';

export interface SelectOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

interface CustomSelectProps extends Omit<ReactSelectProps<SelectOption, boolean, GroupBase<SelectOption>>, 'options'> {
  options: SelectOption[];
  error?: string;
}

const customTheme = (theme: Theme): Theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#EBFAFD',
    primary50: '#EBFAFD',
    primary75: '#EBFAFD',
    neutral10: '#4F9EBC',
    neutral20: '#E0E0E0',
    neutral50: '#4E4E4E',
    neutral60: '#4F9EBC',
    neutral80: '#ffffff',
  },
});

export function CustomSelect({ 
  options,
  error,
  className,
  ...props 
}: CustomSelectProps) {
  return (
    <div className={className}>
      <Select
        options={options}
        className="react-select-container text-white"
        classNamePrefix="react-select"
        theme={customTheme}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Helper function to map items to select options
export function mapToSelectOptions<T extends { id: string; name: string }>(
  items: T[],
  type: string
): SelectOption[] {
  return items.map(item => ({
    value: item.id,
    label: item.name,
    [type]: item
  }));
} 