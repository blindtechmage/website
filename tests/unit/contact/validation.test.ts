import { describe, expect, it } from 'vitest';
import { validateContactForm, MIN_MESSAGE_LENGTH } from '../../../src/lib/contact/validation';

const validInput = {
  name: 'Jad',
  email: 'jad@example.com',
  topic: 'general',
  message: 'a'.repeat(MIN_MESSAGE_LENGTH),
};

describe('validateContactForm', () => {
  it('accepts fully valid input', () => {
    expect(validateContactForm(validInput).valid).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = validateContactForm({ ...validInput, name: '  ' });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('rejects a malformed email address', () => {
    const result = validateContactForm({ ...validInput, email: 'not-an-email' });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it('rejects an unknown topic', () => {
    const result = validateContactForm({ ...validInput, topic: 'not-a-real-topic' });
    expect(result.valid).toBe(false);
    expect(result.errors.topic).toBeDefined();
  });

  it('rejects a message shorter than the minimum length', () => {
    const result = validateContactForm({ ...validInput, message: 'too short' });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  it('accepts a message exactly at the minimum length', () => {
    const result = validateContactForm({
      ...validInput,
      message: 'a'.repeat(MIN_MESSAGE_LENGTH),
    });
    expect(result.valid).toBe(true);
  });
});
