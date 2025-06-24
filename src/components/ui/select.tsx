import React from 'react';
import Select, { GroupBase, Props as ReactSelectProps, StylesConfig } from 'react-select';

export interface SelectOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

interface CustomSelectProps extends Omit<ReactSelectProps<SelectOption, boolean, GroupBase<SelectOption>>, 'options'> {
  options: SelectOption[];
  error?: string;
}

export function CustomSelect({ 
  options,
  error,
  className,
  ...props 
}: CustomSelectProps) {

  const customStyles: StylesConfig<SelectOption, boolean, GroupBase<SelectOption>> = {
    control: (styles) => ({ 
      ...styles, 
      backgroundColor: 'white',
      borderColor: error ? '#C53030' : '#E3E7ED',
      '&:hover': {
        borderColor: '#3E4C59'
      }
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? '#3E4C59'
          : isFocused
          ? '#DCE2E9'
          : undefined,
        color: isDisabled
          ? '#4A5568'
          : isSelected
          ? 'white'
          : '#4A5568',
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? '#3E4C59'
              : '#3E4C59'
            : undefined,
          color: isDisabled
            ? '#4A5568'
            : 'white'
        },
      };
    },
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#3E4C59',
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: '#FFFFFF',
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: '#FFFFFF',
      ':hover': {
        backgroundColor: '#C53030',
        color: '#FFFFFF',
      },
    }),
    menu: (styles) => ({
      ...styles,
      zIndex: 10,
    }),
  } as StylesConfig<SelectOption, boolean, GroupBase<SelectOption>>;

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
        <p className="mt-1 text-sm text-state-error font-copy">{error}</p>
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