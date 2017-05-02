# content-features
content app
 - git clone https://github.com/albuman/content-features.git -b fs_integration
 - git pull
 
var a = window.localStorage;
var normalizedDates = {};
var b = Object.keys(a).forEach((key)=>{
	var dateArr = key.split('-');
	var [day, month, year] = dateArr;
	if(day && month && year){
		normalizedDates[`${year}-${month}-${day}`] = a[key].split(/\s/g).filter((pos)=>(pos.length > 2));
	}
});
$.ajax({
	url: 'http://localhost:4444',
	data: JSON.stringify({updateHistory: normalizedDates}),
	type: 'post'
});