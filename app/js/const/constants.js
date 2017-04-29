const isChromeExtension = /chrome-extension\:/.test(window.location.protocol);

const feedsQuantity = 10;

const address = {
	local: 'http://localhost:4444',
	targetQuery: 'http://mta.ua/index.php?route=product/product&path=2&product_id=',
	targetSearch: 'http://mta.ua/search?description=true&search=',
	lastChekout: '/data/dir.txt',
	allPositionList: '/data/all.txt',
	defaultPathsUrl: '/data/defaultPaths.json',
    history: '/data/historyLog.json',
};

const actionTypes = {
	findPosition: 'positions',
	findFeedbacks: 'feedbacks'
};

const DOMSelectors = {
	
	feedbackTab: 'ul.nav-tabs>li:last',
	positionNumber: 'u',
	avalibilityClass: '.najavniste',
	positionNameClass: '.b1c-name',
	firstPositionName: '.b1c-name:first'
	
	
};

export {address, actionTypes, DOMSelectors, isChromeExtension, feedsQuantity};