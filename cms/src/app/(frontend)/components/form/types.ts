import React from 'react';

export interface TanStackFieldApi {
  name: string;
  state: {
    value: any;
    meta?: {
      errors?: any[];
      isTouched?: boolean;
    };
  };
  handleChange: (val: any) => void;
  handleBlur?: () => void;
}

export interface BaseFieldCompositionProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  field?: TanStackFieldApi;
  containerClassName?: string;
  id?: string;
}
