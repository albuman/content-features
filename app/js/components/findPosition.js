import $ from 'jquery';

var settings = {
	query : 'http://mta.ua/index.php?route=product/product&path=2&product_id=',
	search: 'http://mta.ua/search?description=true&search='
};
function getAjaxSettings(data) {
	return {
		type: 'post',
		url: '//localhost:4444',
		data: data,
		dataType: 'text'
    }

}
function findPosition(code){
	return $.ajax(getAjaxSettings(settings.search + code))
		  	.then((dom)=>{
		  		var name ,
		  			position;
				name = $(dom).find('.b1c-name:first');
		  		if(name.length > 0){
		  			position = {
				      	partNumber  : code,
				       	name: name.text(),
				      	url: settings.query + code,
				      	exist : true
				    };
			    	
		  		} else {
		  			position = {
			  			partNumber : `Ошибка!`,
			  			name : `Возможно позиции ${code} не существует!`,
			  			url : '',
			  			exist : false
			  		};
		  		}
		  		return position;
			   
		  	})
		  	
}

export default findPosition;