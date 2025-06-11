import React from 'react';
import Select, { GroupBase, Props as ReactSelectProps, StylesConfig, Theme } from 'react-select';

export interface SelectOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

interface CustomSelectProps extends Omit<ReactSelectProps<SelectOption, boolean, GroupBase<SelectOption>>, 'options'> {
  options: SelectOption[];
  error?: string;
}

const customStyles: StylesConfig = {
  control: (styles) => ({ 
    ...styles, 
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
    '&:hover': {
      borderColor: '#2D5F6E'
    }
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? '#2D5F6E'
        : isFocused
        ? '#E3F5F9'
        : undefined,
      color: isDisabled
        ? '#4E4E4E'
        : isSelected
        ? 'white'
        : '#4E4E4E',
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? '#2D5F6E'
            : '#2D5F6E'
          : undefined,
        color: isDisabled
          ? '#4E4E4E'
          : 'white'
      },
    };
  },
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: '#4F9EBC',
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: '#FFFFFF',
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: '#2D5F6E',
    ':hover': {
      backgroundColor: '#2D5F6E',
      color: '#FFFFFF',
    },
  }),
};

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
        className="react-select-container text-base-paragraph"
        classNamePrefix="react-select"
        styles={customStyles}
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