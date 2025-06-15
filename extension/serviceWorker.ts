import { GET_SITE_DATA_ACTION, SERVER_URL } from '@utils/constants';
import { cacheResponse } from '@utils/helpers';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === GET_SITE_DATA_ACTION) {
		if (!request.url) return;
		getSiteData(sendResponse, request.url);
		return true;
	}
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSiteData(sendResponse: any, url: string) {
	try {
		// encode twice because FastAPI expects it that way
		// https://stackoverflow.com/a/72815364 -> Option 2
		const response = await fetch(
			SERVER_URL + '/site/' + encodeURIComponent(encodeURIComponent(url))
		);
		const data = await response.json();
		cacheResponse(data);
		sendResponse(data);
	} catch (error) {
		sendResponse({ error: error?.toString() });
	}
}
