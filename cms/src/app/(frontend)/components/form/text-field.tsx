import React from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { BaseFieldCompositionProps } from './types';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

export interface TextFieldProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'onBlur'>,
  BaseFieldCompositionProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
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
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const inputId = id || (field ? `field-${field.name}` : undefined);
    const fieldValue = field ? (field.state.value ?? '') : (value ?? '');
    const fieldError = error || (field?.state.meta?.errors?.[0] ? String(field.state.meta.errors[0]) : undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field) {
        field.handleChange(e.target.value);
      }
      if (onChange) {
        onChange(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (field) {
        field.handleBlur?.();
      }
      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <Field className={cn('space-y-2', containerClassName)}>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-destructive">*</span>}
          </FieldLabel>
        )}
        <Input
          ref={ref}
          id={inputId}
          name={field?.name || props.name}
          value={fieldValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(fieldError && 'border-destructive focus-visible:ring-destructive/20', className)}
          {...props}
        />
        {description && <FieldDescription>{description}</FieldDescription>}

        {fieldError && <FieldError>{fieldError}</FieldError>}
      </Field>
    );
  }
);

TextField.displayName = 'TextField';
