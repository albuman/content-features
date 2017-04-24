
//COPY-PASTE REMOVER

var a = document.createElement('script');
a.type = "text/javascript";
a.innerHTML = "\nfunction addLink() {\n return true; \n} \n document.oncopy = addLink;\n";
document.body.appendChild(a);
//LOOP THROUGH ALL PRODUCTS
function setParamsToElems(elemArr){
	[].forEach.call(elemArr, (elem, index)=>{
		document.getElementsByClassName('product-meta')[index].style.backgroundColor = '#fff';
		var link = elem.getElementsByClassName('b1c-name')[0].href,
			productBlock = elem.getElementsByClassName('product-block')[0],
			description = elem.getElementsByClassName('description')[0],
			codePath = elem.getElementsByClassName('front')[0],
			imageClass = elem.getElementsByClassName('image')[0],
			flip = elem.getElementsByClassName('flip')[0];
		loadImgs(flip, link);
		productBlockEffects(productBlock, setSpecs(description), codePath, setControls(imageClass), link, index);
		
	})
}
// FLIP - IS CONTAINER OF TITLE IMG'S
function loadImgs(flip, link){
	const imgWidth = getComputedStyle(flip.parentNode).width,
		  imgHeight = getComputedStyle(flip.parentNode).height;

	fetch(link)
		.then(response=>(response.text()), 
				error=>(new Error(error)))
		.then((data)=>($.parseHTML(data)))
		.then(html=>($(html).find('.slider-for img')))
		.then(images=>{
			try{
				var imgs = [].map.call(images, (img)=>{
						var a = document.createElement('a');
						a.appendChild(img)
						return a;
					}),
					blockWidth = imgs.length * 100,
					pcsWidth = 100 / imgs.length;


				flip.style.cssText = `display: flex; transition: transform .3s ease-out; width: ${blockWidth}%`;
				var href;
				[].forEach.call(flip.getElementsByTagName('a'), (elem)=>{href = elem.href; elem.style.cssText = `display: inline-block; width: ${pcsWidth}%`});
				for(let k=1; k<imgs.length; k++){
					if(imgs[k]){	
						imgs[k].style.cssText =`display: inline-block; width: ${pcsWidth}%`;
						imgs[k].href  = href;
						imgs[k].className = 'swap-image';
						imgs[k].firstChild.style.cssText = 'width: 100%';
						flip.appendChild(imgs[k]);
					}else{
						break;
					}

				}

			} catch(e){
				console.log(e, `Позиция ${link} содержит только 1 фото`)
			}
		});
}
//PARENT - ELEMENT-CONTAINER FOR FETCHED IMGS , CLASSNAME - CLASS OF IMAGES THAT PARTICIPATE IN SLIDE-SHOW
function slide(parent, className) {
			var count =0;
				return  {
					left: ()=>{
						var len = parent.getElementsByClassName(className).length;
						count = (count - (100/len)) < 0 ? (100*((len-1)/len)) : (count - (100/len));
						parent.style.transform = 'translateX(-'+ count + '%)';
					},
					right:()=>{
						var len = parent.getElementsByClassName(className).length;
						count = (count + (100/len)) > (100*((len-1)/len)) ? 0 : (count + (100/len));
						parent.style.transform = 'translateX(-'+ count + '%)';
					}
				}	
					
};
// IMAGECLASS - IS CLASS OF CONTAINER ON WHICH PLACED CONTROLS
function setControls(imageClass){
	if(imageClass){
				var prev = document.createElement('a'),
					next = document.createElement('a'),
					ul = document.createElement('ul'),
					li1 = document.createElement('li'),
					li2 = document.createElement('li');
					prev.className = 'flex-prev';
					next.className = 'flex-next';
					prev.style.cssText = 'opacity: 1; left: -50px;';
					next.style.cssText = 'opacity: 1; right: -50px;';	
					ul.appendChild(li1);
					ul.appendChild(li2);
					ul.className = 'flex-direction-nav';
					li1.className ='flex-nav-prev first';
					li2.className ='flex-nav-next last';
					li1.appendChild(prev);
					li2.appendChild(next);
					imageClass.appendChild(ul);
					imageClass.style.cssText = 'margin-bottom: 0px; background: #fff;';
					return {
						prev,
						next
					}				
	};
}

// DESCRIPTION - IS CLASS OF CONTAINER WITH SPECIFICS
function setSpecs(description){

	description.style.cssText = 'display:block; position: absolute; top: 5%; transition: .3s; z-index: -9; padding: 5px 20px; background: #fff; border-radius: 0 0 4px 4px;  width: 100%; left: 0; font-weight: 600;';
	var p = description.querySelector('p');
	if(p){
		var specs = [].map.call(p.childNodes, (elem)=>(elem.textContent)),
			finishSpecs = specs.reduce((acum , elem, index)=>
			{
				if(index%2!==0) { return acum+=elem+'<br>'
				
				} else{return acum+=elem}
			}
			, '');
		p.innerHTML = finishSpecs;
		
	}
	return description;
}
// CODE - PATH FOR EXTRACT COMPANY CODE
function displayCode(code){
	var append = document.createElement('div'),
		inner = document.createElement('u');
		append.className = 'cod';
		inner.innerHTML = code;
		append.appendChild(inner);
		append.style.top = 'auto';
		append.style.bottom = '0px';
		append.style.right = '0px';
		return append;
}
// MAIN FUNCTION 
function productBlockEffects(productBlock, specs, codePath, controls, link, index){
	if(codePath){
		productBlock.appendChild(displayCode(parseInt(codePath.getAttribute('src').slice(36))))
	} else {
		fetch(link)
		.then(response=>(response.text()),
			  error=>(new Error(error)))
		.then(html=>($(html).find('.cod').innerText))
		.then(code=>(productBlock.appendChild(displayCode(code.slice(4)))));
	}
	const {prev, next} = controls;
	const {left, right} = slide(productBlock.getElementsByClassName('flip')[0], 'swap-image');
	prev.onclick = left;
	next.onclick = right;
	productBlock.onmouseover = function(){
		return ((e)=>{
			productBlock.style.cssText = 'z-index: 999';
			specs.style.top = '98%';
			next.style.cssText="opacity:1; right:0px; visibility:visible; z-index: 999;";
			prev.style.cssText="opacity:1; left:0px; visibility:visible; z-index: 999;";
		})(index)
	}
	productBlock.onmouseout = function(){
		return ((e)=>{
			productBlock.style.cssText = 'z-index: 0';
			specs.style.top = '5%';
			next.style.cssText="opacity:0; visibility:hidden; ";
			prev.style.cssText="opacity:0; visibility:hidden; ";
		})(index)
	}
}

$(document).ready(
	()=>{
			if(document.getElementsByClassName('products-block')[0]){
				setParamsToElems(document.getElementsByClassName('col-lg-4 col-md-4 col-sm-4 col-xs-12 product-cols'));
				document.getElementsByClassName('products-block')[0].style.overflow = 'visible';		
				var block = document.getElementById('mfilter-content-container'), 
				search = document.getElementsByClassName('product-filter clearfix')[0],
				navigList = document.getElementsByClassName('search')[0],
				wrap = document.createElement('div'),
				btn  = document.createElement('a');

				wrap.className = 'product-compare';
				btn.className = 'btn btn-theme-default';
				btn.innerHTML = 'Открыть все позиции';
				wrap.appendChild(btn);
				wrap.style.cssText = 'clear: both; float: right;'
				btn.onclick = function(){
					for(let i=0, n = document.getElementsByClassName('product-grid')[0].getElementsByClassName('b1c-name'); i<n.length; i++){
						n[i].setAttribute('target', '__blank');
						window.open(n[i]);
				}
				};
				var nav = document.getElementsByClassName('pagination paging clearfix')[0],
					productBlock = document.getElementsByClassName('product-grid')[0],
					copyNav = nav.cloneNode(true);
				if(navigList){
					search.appendChild(wrap);
					navigList.insertBefore(copyNav, productBlock);
				}
				else{
					search.appendChild(wrap);
					block.insertBefore(copyNav, productBlock);
				};

			}
	}
)



	





var feedBlock = document.getElementById('tab-review');
if(feedBlock){
	$("#colorbox-gal-load").css("height", "700px");
	$(".slick-slide img").css('margin-top','0px');
	var feeds = feedBlock.querySelector('.buttons.no-padding'),
		womenNames = 'Александра Саша Сашка Алёна Алина Алла Анастасия Настя Ангелина Анна Аня Анька Богдана Валентина Валя Валерия Лера Вера Виктория Вика Виолетта Влада Галина Галя Дарья Даша Евгения Екатерина Катя Катюха Елена Лена Елизавета Лиза Зоя Инна Ира Карина Кира Кристина Ксения Ксюха Лариса Лидия Лида Лика Любовь Люба Людмила Люда Марина Мария Маша Надежда Надя Наталья Наташа Нина Оксана Олеся Ольга Оля Полина Светлана Света Соня Стелла Тая Татьяна Таня Ульяна Юлия Юля Яна Ярослава';
		manNames = 'Александр Саша Алексей Лёша Анатолий Толик Андрей Антон Аркадий Арсений Сеня Артём Тёма Богдан Бодя Борис Боря Вадим Валентин Валик Валерий Валера Василий Вася Виктор Витя Виталий Виталик Владимир Вова Владислав Влад Вячеслав Славик Геннадий Гена Георгий Жора Григорий Гриша Денис Дмитрий Дима Евгений Женя Егор Иван Ваня Игорь Илья Кирилл Константин Костя Леонид Лёня Максим Никита Николай Коля Олег Павел Паша Пётр Петя Роман Рома Ростислав Ростик Руслан Семён Сергей Серёга Станислав Стас Степан Стёпа Тарас Фёдор Федя Филипп Юрий Юра Ярослав';
		mainInput = feedBlock.querySelector('input[name="name"]'),
		feedText = document.querySelectorAll('.form-group .form-control'),
		email = feedBlock.querySelector('.form-group input[name=mail]');
		feedBlock.querySelector('#mail-pod-otvet').checked = false;
		feedBlock.getElementsByClassName('fa fa-star-o ratingPushCom')[4].click();
		email.value = 'info@mta.ua';
		randomWomen = document.createElement('a');
		randomMan = document.createElement('a');
		randomWomen.className = 'button btn btn-theme-default';
		randomMan.className = 'button btn btn-theme-default';
		randomMan.innerHTML = 'Мужское имя';
		randomWomen.innerHTML = 'Женское имя';
		randomWomen.style.cssText = 'margin-left:10px;';
		feeds.appendChild(randomMan);
		feeds.appendChild(randomWomen);
		womenArr = womenNames.split(' ');
		manArr  = manNames.split(' ');
		var vidgukyBlock = document.getElementsByClassName('col-lg4 col-md-4 tab-descripti-vidguky')[0];
		function randomName(arr, input, focusElem){
			var id = Math.floor(arr.length * Math.random());
			input.value = arr[id];
			focusElem.focus();
			return arr[id]
		}
		if(vidgukyBlock){
			if(vidgukyBlock.querySelector('.form-group')){
				var email = vidgukyBlock.querySelector('.form-group input[name=mail-hot]');
				var feeds2 = vidgukyBlock.querySelector('.pull-hot'),
					altInput = vidgukyBlock.querySelector('input[name="name-hot"]');
				vidgukyBlock.querySelector('#mail-podpis-otvet').checked = false;
				vidgukyBlock.getElementsByClassName('fa fa-star-o ratingPush')[4].click();
				email.value = 'info@mta.ua';
				var	randomWomen2 = feeds2.appendChild(randomWomen.cloneNode(true)),
					randomMen2 = feeds2.appendChild(randomMan.cloneNode(true));
				var buttonStyle = 'display:block; height:40px; width: 42.6%; font-size: 13px; margin:10px auto !important;';
				randomWomen2.style.cssText = buttonStyle;
				randomMen2.style.cssText = buttonStyle;
				randomWomen2.onclick = function(){
					mainInput.value = randomName(womenArr, altInput, feedText[0]);

				}
				randomMen2.onclick = function() {
					mainInput.value = randomName(manArr, altInput, feedText[0]);
				};
			}
			
		};
		randomWomen.onclick = function() {
				if(vidgukyBlock && vidgukyBlock.querySelector('.form-group')){
					altInput.value = randomName(womenArr, mainInput, feedText[1]);
					
				} else {
					randomName(womenArr, mainInput, feedText[0]);
				}

		};
		randomMan.onclick = function() {
			if(vidgukyBlock && vidgukyBlock.querySelector('.form-group')){
					altInput.value = randomName(manArr, mainInput, feedText[1]);
					
				} else {
					randomName(manArr, mainInput, feedText[0]);
				}
			
		};
};







