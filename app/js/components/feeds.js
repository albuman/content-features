import $ from 'jquery';

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
				return $.get(url)
					.then((data) => {
						var feedback = $(data).find('ul.nav-tabs>li:last').text(),
							partNumber = $(data).find("u").text(),
							avalible = !!$(data).find('.najavniste')[0],
							name = $(data).find(".b1c-name").html(),
							feedsQuantity = parseInt((feedback.slice(9)), 10),
							url = settings.query + positionArr[id];
						return {
							partNumber,
							avalible,
							name,
							feedsQuantity,
							url
						}
					}, (error) => (Error(`Проверьте существует ли позиция: ${positionArr[id]}. \n Ошибка: ${error}`)))
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