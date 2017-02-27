		function appendDivTo(div){
			var division1 = document.createElement('div'),
				division2 = document.createElement('div');
				
			division1.appendChild(division2);
			div.appendChild(division1);
			return {division1, division2};
		}
		function count(quantity, parent, imgPath){
			wrap = document.createElement('div');
			wrap.className = 'kaleidoscop';	
			wrap.style.cssText = 'overflow:hidden; box-sizing:border-box; z-index:-1;position: fixed; min-width:100%; min-height: 100%; top: 0; left: 0;'

			for(let i =0; i<quantity; i++){
				
				const {division1, division2} = appendDivTo(wrap);
				division1.className = 'kalWrap';
				division1.style.cssText = `width:150%; height:150%; transform-origin: left top; transform:rotate(${(360/quantity * i)}deg); background-color: transparent;  position:absolute; left:50%; top:50%; overflow:hidden`;
				division2.className= 'kal';
				division2.style.cssText = `width:100%; height:100%;transform-origin:left top; background-image: url(${imgPath}); transform:rotate(-${90-(360/quantity)}deg);`;

			}
			parent.appendChild(wrap);
			var childArr = [].filter.call(wrap.childNodes, function(elem){return elem.className == 'kalWrap'});//console.log(childArr)
			document.onmousemove = function(e){[].forEach.call(childArr, function(elems){elems.firstChild.style.backgroundPosition = e.pageX + "px " + e.pageY + "px ";})};
		}
		
		
