/**
 * Directus schema types
 */

export interface FormData {
  id?: string | number;
  name: string;
  phone: string;
  form_type: string; // Changed from form_id to form_type to store the form type as a string
  useragent: string;
  date_created?: string;
  user_created?: string;
}

export interface Theme {
  header?: string;
  body?: string;
  [key: string]: any; // For any additional theme properties
}

export interface Page {
  id?: string;
  // Other page fields
  title?: string;
  status?: string;
  // Form is a many-to-many relationship field
  form?: FormData[] | { create: FormData[] };
  theme?: Theme;
}

declare module '@directus/sdk' {
  interface DirectusSchema {
    pages: Page;
    form_data: FormData;
  }
}
