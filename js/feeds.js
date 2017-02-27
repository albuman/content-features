define(function(){
		var file = "data/all.txt",
			settings = {
				query: 'http://mta.ua/index.php?route=product/product&path=2&product_id=',
			};
		return fetch(chrome.extension.getURL(file))
			.then(response=>{
				if(response.ok){
					return response.text()
				} else {
					throw Error(`File ${file} not found!`)
				}
			})
			.then(text=>(text.split('\n')))
			.then(positionArr=>{
				function findPosition(feedsValue){
					var id = Math.floor(Math.random() * positionArr.length);
					return fetch(settings.query+positionArr[id])
						.then(response=>{
							if(response.ok)
								return response.text()
							else
								throw Error(`Can't connect to ${settings.query+id}`)
						})
						.then((element)=> ($.parseHTML(element)))
						.then((data)=>{
							var feedback = $(data).find('ul.nav-tabs>li:last')[0].innerText,
								partNumber = $(data).find("u")[0].innerHTML,
								avalible = !!$(data).find('.najavniste')[0],
								name = $(data).find(".b1c-name")[0].innerHTML,
								feedsQuantity = parseInt((feedback.slice(9)), 10),
								url = settings.query+positionArr[id];
							return {
								partNumber,
								avalible,
								name,
								feedsQuantity,
								url
							}
						}, (error)=>(Error(`Проверьте существует ли позиция: ${positionArr[id]}. \n Ошибка: ${error}`)))
						.then(position=>{
							if(!feedsValue.toString() && position.avalible){
								return position
							} else if(!!feedsValue.toString() && (feedsValue >= position.feedsQuantity) && position.avalible){
								return position
							} else {
								return findPosition(feedsValue)
							}
						})
						.catch(error=>{
							alert(error);
							throw error;
						})
				}
				return findPosition
			})
})