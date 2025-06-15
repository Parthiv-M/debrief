import { GET_SITE_DATA_ACTION } from './constants';
import { SiteData } from './types';

export const getSearchURL = (): string => {
	return document.location.href.trim();
};

export const getSiteData = async (
	url: string | undefined
): Promise<SiteData | null> => {
	try {
		const response = await chrome.runtime.sendMessage({
			action: GET_SITE_DATA_ACTION,
			url: url,
		});
		return response;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error('Error:', error);
		return null;
	}
};

export const cacheResponse = async (response: SiteData): Promise<void> => {
	await chrome.storage.local.set({ [response.site_url]: response });
};

export const getCachedSiteData = async (
	url: string | undefined
): Promise<SiteData | null> => {
	if (!url) return null;
	const data = await chrome.storage.local.get(url);
	return data[url] || null;
};

export const getCleanURL = (url: string) => {
	return new URL(url).hostname;
};
