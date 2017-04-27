import $ from 'jquery';
import {address, DOMSelectors, isChromeExtension} from '../main';



function findPosition(code){
	function getAjaxSettings(urlToSend) {
		return {
			type:isChromeExtension ? 'get' : 'post',
			url: isChromeExtension ? urlToSend : address.local,
			data: urlToSend,
			dataType: 'text'
		}
		
	}
	return $.ajax(getAjaxSettings(address.targetSearch + code))
		  	.then((dom)=>{
		  		var name ,
		  			position;
				name = $(dom).find(DOMSelectors.firstPositionName);
		  		if(name.length > 0){
		  			position = {
				      	partNumber  : code,
				       	name: name.text(),
				      	url: name.attr('href'),
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