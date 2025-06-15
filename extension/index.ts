import { getDebriefContainer } from '@utils/domhelpers';

const render = () => {
	const results = document.querySelectorAll('h3');
	results.forEach((item) => {
		const siteURL: string | undefined =
			item?.parentElement?.parentElement?.querySelector('a')?.href;
		const debriefContainer: HTMLDivElement = getDebriefContainer(siteURL);
		item?.parentElement?.parentElement?.parentElement?.append(
			debriefContainer
		);
	});
};

// Run the function to add icons when the page loads
window.addEventListener('load', render);
