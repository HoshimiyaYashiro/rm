import { FieldApi } from '@tanstack/react-form'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { BaseFieldCompositionProps } from './types'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface NumberFieldProps
  extends
  Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'onBlur' | 'type'>,
  BaseFieldCompositionProps {
  value?: number | string
  onChange?: (value: string | number) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

// interface NumberFieldProps {
//   field: FieldApi<any, any, number, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
//   label: string
//   placeholder?: string
//   description?: string
//   min?: number
//   max?: number
//   step?: number
//   disabled?: boolean
//   className?: string
//   inputClassName?: string
// }

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
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
    const inputId = id || (field ? `field-${field.name}` : undefined)
    const fieldValue = field ? (field.state.value ?? '') : (value ?? '')
    const fieldError = error || (field?.state.meta?.errors?.[0] ? String(field.state.meta.errors[0]) : undefined)
    const handleChange = (e) => {
      const val = e.target.value
      if (field) {
        field.handleChange(val)
      }
      if (onChange) {
        onChange(val)
      }
    }

    const handleBlur = (e) => {
      if (field) {
        field.handleBlur?.()
      }
      if (onBlur) {
        onBlur(e)
      }
    }
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
          type="number"
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
    )
  }
)

NumberField.displayName = 'NumberField';