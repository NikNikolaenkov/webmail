import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectBrowserLocale, detectableLocales } from '../detect-locale';

function setLanguages(languages: string[]) {
  vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(languages);
}

afterEach(() => vi.restoreAllMocks());

describe('detectableLocales (fork: NEXT_PUBLIC_DETECT_LOCALES)', () => {
  it('limits detection to the listed supported locales', () => {
    expect(detectableLocales('uk,en')).toEqual(['en', 'uk']);
  });

  it('ignores unknown tags and falls back to every supported locale when empty', () => {
    expect(detectableLocales('xx')).toContain('ru');
    expect(detectableLocales('')).toContain('ru');
    expect(detectableLocales(undefined)).toContain('ru');
  });
});

describe('detectBrowserLocale with a restricted set', () => {
  it('keeps the default for a Russian browser when only uk,en are detectable', () => {
    setLanguages(['ru-RU', 'ru']);
    expect(detectBrowserLocale('uk', detectableLocales('uk,en'))).toBe('uk');
  });

  it('keeps the default for an English browser', () => {
    setLanguages(['en-US', 'en']);
    expect(detectBrowserLocale('uk', detectableLocales('uk,en'))).toBe('uk');
  });

  it('still auto-switches to Russian without a restriction (upstream behaviour)', () => {
    setLanguages(['ru-RU', 'ru']);
    expect(detectBrowserLocale('uk', detectableLocales(undefined))).toBe('ru');
  });
});
