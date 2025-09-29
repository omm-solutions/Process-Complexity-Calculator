// types.ts

export type Rating = 'Niedrig' | 'Mittel' | 'Hoch' | 'Sehr Hoch';
export type InputType = 'number' | 'select';

export interface Option {
  value: string;
  label: string;
  detailedDescription?: string;
}

export interface Criterion {
  id: number;
  name: string;
  description: string;
  inputType: InputType;
  value: string | number;
  options?: Option[];
  getRating: (value: string | number) => Rating;
}
