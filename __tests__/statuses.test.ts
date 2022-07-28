import {
  isSuccessful,
  isClientError,
  isServerError,
  isAuthError,
  isRedirection,
} from '../src/statuses';

describe('Http Statuses', () => {
  test('isSuccessful', () => {
    expect(isSuccessful(200)).toBe(true);
  });

  test('isClientError', () => {
    expect(isClientError(400)).toBe(true);
  });

  test('isServerError', () => {
    expect(isServerError(500)).toBe(true);
  });

  test('isAuthError', () => {
    expect(isAuthError(403)).toBe(true);
    expect(isAuthError(401)).toBe(true);
  });

  test('isRedirection', () => {
    expect(isRedirection(301)).toBe(true);
  });
});