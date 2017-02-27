$(document).ready(function(){

	var themeChooser = document.getElementById('themes'),
		style = document.getElementsByTagName("link")[0],
		getFromStorage = (prop)=>(localStorage.getItem(prop)),
		setToStorage = (prop, value)=>{
			localStorage.setItem(prop, value);	
		}
		function changeTheme(value){
				
			switch(value){
				
				case '1':
					setToStorage("theme", "css/main_1.css");	
					setToStorage("currentTheme", value);
					style.href = getFromStorage('theme');
					themeChooser.value = value;					
					count(12, document.querySelector('.wrap'), '../images/2.jpg');
					break;
				
				case '2':
					setToStorage("theme", "css/main_2.css");
					setToStorage("currentTheme", value);
					style.href = getFromStorage('theme');
					themeChooser.value = value;
					var kaleido = document.querySelector('.kaleidoscop');
					kaleido ? kaleido.parentNode.removeChild(kaleido) : null;
					break;
				
				default: 
					count(12, document.querySelector('.wrap'), '../images/2.jpg');
					setToStorage("theme", "css/main_1.css");	
					setToStorage("currentTheme", 1);
					break;
			}
			
		}


	
	themeChooser.onchange = function(){changeTheme(this.value)};
	changeTheme(getFromStorage("currentTheme"));
})