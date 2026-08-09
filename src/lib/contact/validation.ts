export const CONTACT_TOPICS = [
  'general',
  'consulting',
  'collaboration',
  'speaking',
  'other',
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const MIN_MESSAGE_LENGTH = 20;

export interface ContactFormInput {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
}

export interface ContactFormValidationResult {
  valid: boolean;
  errors: ContactFormErrors;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(input: ContactFormInput): ContactFormValidationResult {
  const errors: ContactFormErrors = {};

  if (!input.name.trim()) {
    errors.name = 'Please enter your name.';
  }

  if (!input.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!CONTACT_TOPICS.includes(input.topic as ContactTopic)) {
    errors.topic = 'Please choose a topic.';
  }

  if (input.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `Please enter at least ${MIN_MESSAGE_LENGTH} characters.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
