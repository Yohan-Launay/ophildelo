import fr from '../i18n/fr.json';
import en from '../i18n/en.json';

type Locale = 'fr' | 'en';

const translations = { fr, en } as const;
const STORAGE_KEY = 'ophildelo-locale';

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
	const value = path.split('.').reduce<unknown>((current, key) => {
		if (current && typeof current === 'object' && key in (current as object)) {
			return (current as Record<string, unknown>)[key];
		}
		return undefined;
	}, obj);

	return typeof value === 'string' ? value : undefined;
}

function t(locale: Locale, key: string): string {
	return getNestedValue(translations[locale], key) ?? getNestedValue(translations.fr, key) ?? key;
}

function applyLocale(locale: Locale) {
	document.documentElement.lang = locale;

	document.querySelectorAll('[data-i18n]').forEach((el) => {
		const key = el.getAttribute('data-i18n');
		if (key) el.textContent = t(locale, key);
	});

	document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
		const key = el.getAttribute('data-i18n-alt');
		if (key && el instanceof HTMLImageElement) el.alt = t(locale, key);
	});

	const toggle = document.getElementById('lang-toggle-label');
	if (toggle) {
		toggle.textContent = locale === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN';
	}
}

export function initI18n() {
	const stored = localStorage.getItem(STORAGE_KEY);
	const locale: Locale = stored === 'en' ? 'en' : 'fr';
	applyLocale(locale);

	document.getElementById('lang-toggle')?.addEventListener('click', () => {
		const current = document.documentElement.lang as Locale;
		const next: Locale = current === 'fr' ? 'en' : 'fr';
		localStorage.setItem(STORAGE_KEY, next);
		applyLocale(next);
	});
}
