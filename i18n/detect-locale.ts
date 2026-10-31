import { routing } from './routing';
import { matchSupportedLocale } from './locale-matcher';
import { useLocaleStore } from '@/stores/locale-store';

/**
 * Fork (NikNikolaenkov/webmail): locales automatic detection may switch to.
 * NEXT_PUBLIC_DETECT_LOCALES="uk,en" keeps a Russian browser on the default
 * (Ukrainian) instead of switching to ru; empty means every supported locale.
 */
export function detectableLocales(raw: string | undefined = process.env.NEXT_PUBLIC_DETECT_LOCALES): readonly string[] {
  const wanted = (raw ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const picked = routing.locales.filter((l) => wanted.includes(l));
  return picked.length > 0 ? picked : routing.locales;
}

/**
 * Pick the best supported locale for a first-time visitor from their browser
 * language preferences. Returns `fallback` (English default) when the browser
 * prefers English, prefers nothing we support, or is unavailable (SSR) — so we
 * only auto-switch AWAY from English when the browser clearly prefers another
 * language we ship. A user's explicit choice is persisted separately and is
 * never overridden by this.
 */
export function detectBrowserLocale(fallback: string, candidates: readonly string[] = detectableLocales()): string {
  if (typeof navigator === 'undefined') return fallback;
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of prefs) {
    if (!tag) continue;
    const locale = matchSupportedLocale(tag, candidates);
    if (locale === 'en') return fallback; // English is the top preference -> keep default
    if (locale) return locale;             // first supported non-English preference wins
  }
  return fallback;
}

/**
 * The locale to actually use for Intl/formatting and the provider: the user's
 * stored choice when it's a real locale, otherwise (empty or 'auto') the
 * resolved UI locale — never the 'auto' sentinel, which is not a valid BCP-47
 * tag and throws in Intl.* APIs.
 */
export function getEffectiveLocale(): string {
  const choice = useLocaleStore.getState().locale;
  if (choice && choice !== 'auto') return choice;
  if (typeof document !== 'undefined' && document.documentElement.lang) {
    return document.documentElement.lang;
  }
  return detectBrowserLocale('en');
}
