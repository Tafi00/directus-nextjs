import { createFormSubmission } from './fetchers';

/**
 * Submits form data to the pages collection in Directus
 * This creates a new entry in the pages.form field (many-to-many relationship)
 */
export const submitForm = async (data: {
  name: string;
  phone: string;
  form_id: string; // We'll keep this parameter name for backward compatibility
  useragent: string;
  permalink: string;
}) => {
  try {
    const result = await createFormSubmission({
      name: data.name,
      phone: data.phone,
      form_id: data.form_id, // This will be stored as form_type in the database
      useragent: data.useragent,
      permalink: data.permalink
    });
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error submitting form to pages collection:', error);
    return { success: false, error };
  }
};
