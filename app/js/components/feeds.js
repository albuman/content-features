import $ from 'jquery';

function getAjaxSettings(data) {
    return {
        type: 'post',
        url: '//localhost:4444',
        data: data,
        dataType: 'text'
    }

}
const DOMSelectors = {

	feedbackTab: 'ul.nav-tabs>li:last',
	positionNumber: 'u',
	avalibilityClass: '.najavniste',
	positionNameClass: '.b1c-name',

};
function feeds(){
	var file = "/data/all.txt",
		settings = {
			query: 'http://mta.ua/index.php?route=product/product&path=2&product_id=',
		};
	
	return $.get(file)
		 .then(text=>{
		 	var positionArr = text.split('\n');

			function findPosition (feedsValue) {
				var id = Math.floor(Math.random() * positionArr.length),
					url = settings.query + positionArr[id];
				function getPositionObj(data){
					var feedback = $(data).find(DOMSelectors.feedbackTab).text(),
						partNumber = $(data).find(DOMSelectors.positionNumber).text(),
						avalible = !!$(data).find(DOMSelectors.avalibilityClass)[0],
						name = $(data).find(DOMSelectors.positionNameClass).html(),
						feedsQuantity = parseInt((feedback.slice(9)), 10),
						url = settings.query + positionArr[id];
					return {
						partNumber,
						avalible,
						name,
						feedsQuantity,
						url
					}
				};
				return $.ajax(getAjaxSettings(url))
					.then(getPositionObj, (error) => (Error(`Проверьте существует ли позиция: ${positionArr[id]}. \n Ошибка: ${error}`)))
					.then(position => {
						if (!feedsValue.toString() && position.avalible) {
							return position
						} else if (!!feedsValue.toString() && (feedsValue >= position.feedsQuantity) && position.avalible) {
							return position
						} else {
							return findPosition(feedsValue)
						}
					})
					.catch(error => {
						alert(error);
						throw error;
					})
			}
			
			return findPosition
		});
}

export default feeds();