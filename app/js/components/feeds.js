import $ from 'jquery';
import {address, DOMSelectors, isChromeExtension} from '../main';

function feeds(){
	var file = "/data/all.txt";
	
	function getAjaxSettings(urlToSend) {
		return {
			type: isChromeExtension ? 'get' : 'post',
			url: isChromeExtension ? urlToSend : address.local,
			data: urlToSend,
			dataType: 'text'
		}
		
	}
	
	return $.get(file)
		 .then(text=>{
		 	var positionArr = text.split('\n');

			function findPosition (feedsValue) {
				var id = Math.floor(Math.random() * positionArr.length),
					urlToSend = address.targetQuery + positionArr[id];
				
				function getPositionObj(data){
					var feedback = $(data).find(DOMSelectors.feedbackTab).text(),
						partNumber = $(data).find(DOMSelectors.positionNumber).text(),
						avalible = !!$(data).find(DOMSelectors.avalibilityClass)[0],
						name = $(data).find(DOMSelectors.positionNameClass).html(),
						feedsQuantity = parseInt((feedback.slice(9)), 10),
						url = urlToSend;
					return {
						partNumber,
						avalible,
						name,
						feedsQuantity,
						url
					}
				}
				
				return $.ajax(getAjaxSettings(urlToSend))
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