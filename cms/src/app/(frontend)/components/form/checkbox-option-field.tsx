import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { BaseFieldCompositionProps } from './types';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../ui/field';

export interface CheckboxFieldProps
  extends Omit<React.ComponentProps<typeof Checkbox>, 'checked' | 'onCheckedChange'>,
  BaseFieldCompositionProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const CheckboxOptionField = React.forwardRef<HTMLButtonElement, CheckboxFieldProps>(
  (
    {
      label,
      description,
      error,
      required,
      field,
      containerClassName,
      className,
      id,
      checked,
      onCheckedChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (field ? `field-${field.name}` : undefined);
    const isChecked = field ? Boolean(field.state.value) : Boolean(checked);

    const handleCheckedChange = (val: boolean) => {
      if (field) {
        field.handleChange(val);
      }
      if (onCheckedChange) {
        onCheckedChange(val);
      }
    };

    return (
      <Field className={cn('space-y-2', containerClassName)}>
        <Checkbox
          ref={ref}
          id={inputId}
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          className={className}
          {...props}
        />
        <FieldContent>
          {label && (
            <FieldLabel htmlFor={field.name}>
              {label}
            </FieldLabel>
          )}
          {description && <FieldDescription>{description}</FieldDescription>}

        </FieldContent>
      </Field>
    );
  }
);

CheckboxOptionField.displayName = 'CheckboxOptionField';
