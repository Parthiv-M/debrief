import { getCachedSiteData, getCleanURL, getSiteData } from './helpers';

const getDebriefIcon = (url: string | undefined): HTMLDivElement => {
	const iconWrapper = document.createElement('div');
	const icon = document.createElement('img') as HTMLImageElement;
	iconWrapper.classList.add('db-icon-wrapper');
	icon.classList.add('db-action-icon');
	icon.src = chrome.runtime.getURL('images/debrief.png');
	iconWrapper.appendChild(icon);
	if (url) {
		icon.setAttribute('data-url', url);
		icon.onclick = async () => {
			populateDebriefPopupForResultWithURL(url);
		};
	}
	return iconWrapper;
};

const getDebriefPopup = (url: string | undefined): HTMLDivElement | null => {
	const popup = document.createElement('div') as HTMLDivElement;
	const popupSiteTitle = document.createElement('h4') as HTMLHeadingElement;
	const popupSiteURL = document.createElement('a') as HTMLAnchorElement;
	const popupColorsSection = document.createElement('div') as HTMLDivElement;
	const popupSiteDescription = document.createElement(
		'p'
	) as HTMLParagraphElement;
	const popupSiteSummary = document.createElement(
		'p'
	) as HTMLParagraphElement;
	const popupDivider = document.createElement('div');
	popup.classList.add('db-popup', 'db-invisible');
	popupSiteDescription.classList.add('db-popup-site-description');
	popupColorsSection.classList.add('db-popup-colors-section');
	popupSiteSummary.classList.add('db-popup-site-summary');
	popupDivider.classList.add('db-divider');
	popup.appendChild(popupSiteTitle);
	popup.appendChild(popupSiteDescription);
	popup.appendChild(popupSiteURL);
	popup.appendChild(popupSiteSummary);
	popup.appendChild(popupDivider);
	popup.appendChild(popupColorsSection);
	if (!url) return null;
	popup.setAttribute('data-url', url);
	return popup;
};

const getPopupForResultWithURL = (url: string | undefined) => {
	const queryPopup = document.querySelector(
		".db-popup[data-url='" + url + "']"
	);
	if (!queryPopup) return null;
	return queryPopup;
};

const populateDebriefPopupForResultWithURL = async (
	url: string | undefined
) => {
	const queryPopup = getPopupForResultWithURL(url);
	const queryPopupIconWrapper = queryPopup?.parentElement?.querySelector(
		'.db-icon-wrapper'
	) as HTMLDivElement;
	const queryPopupSiteTitle = queryPopup?.querySelector(
		'h4'
	) as HTMLHeadElement;
	const queryPopupSiteDescription = queryPopup?.querySelector(
		'p'
	) as HTMLParagraphElement;
	const queryPopupSiteURL = queryPopup?.querySelector(
		'a'
	) as HTMLAnchorElement;
	const queryPopupColorsSection = queryPopup?.querySelector(
		'.db-popup-colors-section'
	) as HTMLDivElement;
	const queryPopupSiteSummary = queryPopup?.querySelector(
		'.db-popup-site-summary'
	) as HTMLParagraphElement;
	if (queryPopup?.classList.contains('db-invisible')) {
		queryPopupIconWrapper.classList.toggle('db-loader-animate');
		let response = await getCachedSiteData(url);
		if (!response) {
			response = await getSiteData(url);
		}
		if (!response) {
			queryPopupIconWrapper.classList.toggle('db-loader-animate');
			return;
		};
		const {
			site_title,
			site_description,
			site_summary,
			site_colors,
			site_url,
		} = response;
		queryPopupSiteTitle.innerHTML = site_title;
		queryPopupSiteURL.innerHTML = getCleanURL(site_url);
		queryPopupSiteURL.href = site_url;
		queryPopupSiteSummary.innerHTML = site_summary;
		queryPopupSiteDescription.innerHTML = site_description;
		if (queryPopupColorsSection?.children.length === 0) {
			const colorsMax: number =
				site_colors.length < 10 ? site_colors.length : 10;
			site_colors.slice(0, colorsMax).map((site_color: string) => {
				const colorDiv = document.createElement(
					'div'
				) as HTMLDivElement;
				colorDiv.classList.add('color-div');
				colorDiv.style.backgroundColor = site_color;
				queryPopupColorsSection.appendChild(colorDiv);
			});
		}
		queryPopup?.classList.remove('db-invisible');
		queryPopup?.classList.add('db-visible');
		queryPopupIconWrapper.classList.toggle('db-loader-animate');
	} else {
		queryPopup?.classList.remove('db-visible');
		queryPopup?.classList.add('db-invisible');
	}
	queryPopupIconWrapper.classList.toggle('db-icon-active');
};

export const getDebriefContainer = (
	url: string | undefined
): HTMLDivElement => {
	const debriefContainer = document.createElement('div') as HTMLDivElement;
	debriefContainer.classList.add('debrief-container');
	const icon: HTMLDivElement = getDebriefIcon(url);
	debriefContainer.appendChild(icon);
	const debriefPopup = getDebriefPopup(url);
	if (debriefPopup) {
		debriefContainer.appendChild(debriefPopup);
	}
	return debriefContainer;
};
