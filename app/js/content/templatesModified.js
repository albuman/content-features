var tabs = document.querySelector('.nav.nav-tabs.clearfix');
var tabs2 = document.querySelector('#tabs2');
var preview = document.querySelector('div[itemprop="description"]');
var prevButton = tabs.querySelector('a[href="#tab-description"]');
var buffer = [];
const preferences = {
	
	descriptionTypes: {	
		full  : {
			class: 'widthfullopis',
			name: 'Широкое',
			rows  : 3,
		} ,
		chess : {
			class: 'good_info',
			name: 'Шахматка',
			rows  : 3,
		},
		little: {
			class: 'good_info1',
			name: 'Маленькое',
			rows  : 1,
		},

	},
	picturesFormat:{
		jpg : '.jpg',
		jpeg : '.jpeg',
		png : '.png',
		gif : '.gif',  
	}, 
	defaultType: {
		class: 'widthfullopis',
		name: 'Широкое',
		rows: 3
	},


};
const descriptionTypes = Object.keys(preferences.descriptionTypes);
var generalQuantChess = 0;
const fileName = {
	name: 'div',
	params: {
		class: 'file-name col-lg-8 col-md-8'
	},
	childs: [
		{
			name: 'label',
			params: {
				for: 'file-name',
                style: 'width: 50%'
			},
			props: {
				textContent: 'Имя файла: '
			}
		},

		{
            name: 'input',
            params: {
                id: 'file-name',
				style: 'width: 50%'
            },
            props: {
                oninput: function(){
                    autoComplete.call(this, '.path input[type=text]:not([disabled])');
                }
            }
		},
        {
            name: 'label',
            params: {
                for: 'folder-name',
                style: 'width: 50%'
            },
            props: {
                textContent: 'Имя папки: '
            }
        },

        {
            name: 'input',
            params: {
                id: 'folder-name',
                style: 'width: 50%'
            },
            props: {
                oninput: function(){
                    autoComplete.call(this, '.path input[type=number]:not([disabled]');
                }
            }
        }
	]

};
function template (descClass, caption, text, img, alt, title) {
	const generateID = Math.random();

	const close = {
		name: 'i',
		params: {
			class: 'fa fa-times',
			style: 'position: absolute; right: 5px; top: 0; cursor: pointer'
		},
		props:{
			onclick: function (){
				var parent = block.elem.parentNode;
				if(parent.childNodes.length > 1){
					removeFromChilds(parent, block.elem);
					parent.removeChild(block.elem);
				} else {
					removeFromChilds(parent.parentNode, parent);
					parent.parentNode.removeChild(parent);
				};
				if(descClass == preferences.descriptionTypes.chess.class){
					generalQuantChess--;
				}
				nthOfBlock('p.path i.nth', 'p.path input[type=checkbox]');
				
			}
		}
	};
	const textContent = {
		name: 'div',
		params: {
			class: 'text-content',
		},
		childs: [
			{
				name: 'input',
				params : {
					type: 'text', 
					class: 'caption', 
					placeholder: 'Заголовок',
					data: 'caption',
					disabled: descClass == preferences.descriptionTypes.little.class ? true : null,
					
				},
				props: {
					value: caption ? caption : null
				}
			},
			{
				name: 'textarea',
				params: {
					data : 'text',
					
				},
				props: {
					value: text ? text : null
				}
			}
		]
	};
	const checkBox = {
		name: 'input',
		params: {
			type: 'checkbox',
			checked: !!img,
			data: 'image-switcher'
		},
		props: {
			onchange: function(){

				function recursiveDisabled(childs, value){	
					[].forEach.call(childs, child=>{
						if(child!=this){
							child.disabled = value;
						}
						if(child.childs){
							recursiveDisabled(child.childs, value)
						}
					})
				}
				if(this.checked){
					$(addImg.elem).show('fade', 300, recursiveDisabled.bind(this, imageProps.elem.childs, false));
					
				} else {
					$(addImg.elem).hide('fade', 300, recursiveDisabled.bind(this, imageProps.elem.childs, true));
				}
				nthOfBlock('p.path i.nth', 'p.path input[type=checkbox]');
			}
		}
	};
	const imageProps = {
		name : 'p',
		params: {
			class: 'path',
		},
		childs: [
			checkBox,
			{
				name: 'i',
				params : {
				data: 'servpath'
				},
				childs: null,
				props: {
					textContent: 'image/data/foto/',
					
				}
			},
			{
				name: 'input',
				params : {
					type: 'number',
					data: 'folder'
				},
				childs: null,
				props: {
					oninput: function(){
						autoComplete.call(this, '.path input[type=number]')
					}
				}
			},
			{
				name: 'i',
				params: {
					data: 'description'
				},
				childs: null,
				props: {
					textContent: '/description/',
							
				}
			},
			{
				name: 'input',
				params: {
					type: 'text', 
					data: 'image-name'
				},
				props: {

				}
			},
			{
				name: 'i',
				params:{
					class : 'nth',
					data: 'order'
				},
				props: {

				}
			},
			{
				name: 'select',
				params: {
					data: 'format'
				},
				childs: formatsCount(preferences.picturesFormat)
			},
			{
				name: 'div',
				params: {
					class: 'imgProps'
				},
				childs: [
					{
						name: 'input',
						params:{
							name: 'alt',
							placeholder: 'alt',
							data: 'alt',
							
						},
						props: {
							value: alt ? alt : null
						}
					},
					{
						name: 'input',
						params: {
							name: 'title',
							placeholder: 'title',
							data: 'title',
							
						},
						props: {
							value: title ? title : null
						}
					}
				]
			}
		]
	};
	const addImg = {
				name: 'div',
				props: {

				},
				params: {
					class: 'img-placeholder',
				},
				childs: [
					{
						name: 'input',
						params: {
							type: 'file',
							id: 'picture' + generateID,
							style: 'display: none',
							multiple: true
						},
						props:{
							onchange: function(){

								var type = /image\/(\w+)/;
								var files = this.files;
								var contChilds = [];
								[].forEach.call(container.elem.childNodes, (description)=>{
									for(let i of description.childNodes){
										contChilds.push(i)
									}
								});
								var index = [].indexOf.call(contChilds, block.elem);
								var filtered = [];
								[].forEach.call(files, file=>{
									if(type.test(file.type)){
										filtered.push(file);
									} else {
										alert('Файл ' + file.name + ' не является картинкой!');
									}
								});
								function searchFormat(string, match){
									var len = string.length, result = '';
									function recSearch(n){
										if(string[n]!=match){
											result+=recSearch(n-1)
										}
										return result+=string[n]
									}
									recSearch(len-1)
									return result;
								}
								if(filtered.length>1){
									/*var order = Promise.resolve();
									for(let i = index, n = 0; i < contChilds.length; i++, n++){
										if(filtered[n]){
											order = order.then(()=>{
												var reader = new FileReader();
												reader.readAsDataURL(filtered[n]);
												return new Promise(function(success, fail){
													reader.onloadend = function(){
														success(reader.result);
													}
													reader.onerror = function(){
														fail(console.error(filtered[n].name + ' not loaded'))
													}
												})
											})
											.then(result=>(contChilds[i].querySelector('img').src = result))
										} else{
											console.log('File not found')
										}
									}*/
									var n = 0;
									var asyncRead = {len: contChilds.length};
									asyncRead[Symbol.iterator] = function(){
										var self = this;
										return {
											next: function(){
												let i = index, file = filtered[n] ;
												if(i < self.len && file){
													var format = searchFormat(file.name, '.');
													var reader = new FileReader();
													reader.readAsDataURL(file);
													reader.onloadend = function(){
														contChilds[i].querySelector('img').src = reader.result;
														var select = contChilds[i].querySelector('select');
														[].forEach.call(select.options, option=>{
															if(option.textContent == format){
																select.value = option.value
															}
														})
													}
													index++;
													return {value: filtered[n++].name, done: false}
												}
												else {
													return {done: true}
												}
												
											}
										}
									}
									for(let i of asyncRead){
										console.log(i)
									}
								} else {
									var reader = new FileReader();
									reader.readAsDataURL(filtered[0]);
									var format = searchFormat(filtered[0].name, '.');
									reader.onloadend = function(){
										var select = contChilds[index].querySelector('select');
										contChilds[index].querySelector('img').src = reader.result;
										[].forEach.call(select.options, option=>{
											if(option.textContent == format){
												select.value = option.value
											}
										})
									}
								}
								this.value = '';
							},
						}
					},
					{
						name: 'label',
						params: {
							for: 'picture' + generateID,
							class: 'button btn btn-theme-default'
						},
						props: {
							textContent: 'Добавить',


						}
					},
					{
						name: 'img',
						params: {
							data: 'picture'
						}

					},
					{
						name: 'div',
						params: {
							class: 'dimensions',
							style: 'position: absolute; right: 5%'
						},
						props: {
							
						},
						childs: [
							{
								name: 'div',
								childs: [
									{
										name: 'label',
										params: {
											for: 'height',
										},
										props: {
											textContent: 'H'
										}
									},
									{
										name: 'input',
										params: {
											id: 'height'

										},
										props: {
											oninput: function(){
												block.elem.querySelector('img').style.height = this.value;
											}
										}
									}
								]
							},
							{
								name: 'div',
								childs: [
									{
										name: 'label',
										params: {
											for: 'width',
										},
										props: {
											textContent: 'W'
										}
									},
									{
										name: 'input',
										params: {
											id: 'width',

										},
										props: {
											oninput: function(){
												block.elem.querySelector('img').style.width = this.value;
											}
										}
									}
								]
							},
						]
					}
				]
			};
	if(descClass == preferences.descriptionTypes.chess.class){
		generalQuantChess++;
	}
	const block = {
		name: 'div',
		params: {
			class: 'blocks', 
			style: 'position:relative; padding-top: 15px;'
		},
		childs: [
			close,
			textContent,
			addImg,
			imageProps
		]
	}
	return block;
}
function autoComplete(querySelectorAll){
	var elems = document.querySelectorAll(querySelectorAll);
	[].forEach.call(elems, elem=>{
		if(elem!==this)	
			elem.value = this.value
	})
} 
const mainTemplate = buildDesc(preferences.defaultType.class, preferences.defaultType.rows, template);
const container = {
		name: 'div', 
		params:{
			class: 'col-lg-8 col-md-8 description-text'
		},
		childs: [
			mainTemplate
		]
}
const chooserPosition = function(){
	var active = preferences.defaultType.class,
		position = descriptionTypes.filter(type=>(preferences.descriptionTypes[type].class===active)),
		[left] = position;
	return descriptionTypes.indexOf(left); 
}
const chooser = {
	name: 'div',
	params: {
			style: `position: absolute; top:0; height: 100%; width:${100/descriptionTypes.length}%; left: ${chooserPosition()/descriptionTypes.length * 100}%; background-color: #eee; transition: .3s left`
	}
}; 

const controls = {		
		name: 'div',
		params: {
			class: 'col-lg4 col-md-4 control-container', 
			style: 'height: 90%; position: absolute; right: 0'
		}, 
		childs: [
			{
				name: 'div',
				params:{
					class: 'col-lg12 col-md-12 settings',
					style : 'border: 1px solid #eee; padding: 10px; border-radius: 3px; text-align: center; position: absolute; top: 0; left: 0; transition: .2s top'
				},
				childs:[
					{
						name: 'div',
						params: {
							class: 'row', 
							style: 'position: relative'
						},
						
						childs : [
							chooser,
							descriptionChanger(preferences.descriptionTypes)
							
						]
					},
					{
						name: 'div',
						params: {
							class: 'row', 
							style: 'position: relative; margin-top: 10px;'
						},
						props: {

						},
						childs: [
							{
								name: 'div',
								params: {
									class: 'col-lg5 col-md-5',
								},
								props: {

								},
								childs:[
									{
										name: 'a',
										params: {
											class: 'button btn btn-theme-default',
											style: 'width: 100%'
										},
										props: {
											textContent: 'Посмотреть',
											onclick: function(){
												try{
													while(preview.childNodes.length>0){
														preview.removeChild(preview.firstChild)
													};
													var inputsData = lookAtPreview(container.elem.childNodes, 'preview');
													inputsData.forEach(description=>{
														append(description, preview);
													});

													 prevButton.click();
												} catch(e){
													if(e instanceof TypeError){
														alert('Нет блока для описания!');
														console.log(e)
													} else {
														alert(e.message)
													}

												}
												
											}
										}
									}
								]
							},
							{
								name: 'div',
								params: {
									class: 'col-lg5 col-md-5',
								},
								props: {
									
								},
								childs:[
									{
										name: 'a',
										params: {
											class: 'button btn btn-theme-default',
											style: 'width: 100%; background-color: #509609'
										},
										props: {
											textContent: 'Генерировать',
											onclick: function(){
												//var mask = document.querySelector('#colorbox-gal-loadopactiv');
												
												var child = {
													name: 'div',
													params: {
														style: 'height: 100%; position: relative; display: flex; justify-content:center; align-items:center;'
													},
													props: {

													},
													childs: [
														{
															name: 'textarea',
															params:{
																style: 'position: absolute; height: 500px; width: 800px;'
															},
															props: {
																onclick: function(e){
																	e.stopPropagation();
																}
															}
														}
													]
												};
												var inputsData = lookAtPreview(container.elem.childNodes, 'generate');
												var output = '';
												inputsData.forEach(description=>{
													var elem = recursiveCreatingElems(description);
													output += htmlFormat(elem.elem.outerHTML);
												});
												$.ajax({
													url: 'http://localhost:4444',
													type: 'post',
													data: JSON.stringify({createDescription:{
														fileName: $('input#file-name').val() + '.html',
                                                        folderName: $('input#folder-name').val(),
														text: output
													}})
												}).always(function(res){
													alert(res.responseText || res);
												});
											}
										}
									}
								]
							},
							{
								name: 'div',
								params: {
									class: 'col-lg2 col-md-2',
								},
								props: {
									
								},
								childs:[
									{
										name: 'input',
										params: {
											type: 'file',
											id: 'addFile',
											style: 'display: none'
										},
										props: {
											onchange : function(){
												if(this.files[0]){
													var file = this.files[0];
													if(file.type == 'text/html'){
														function filter(node){
															var result = [].filter.call(node, elem=>(elem.nodeType == 1));
															return result;
														}
														var reader = new FileReader();
														reader.readAsText(file);
														reader.onloadend = function(){
															try{
																var html = $.parseHTML(reader.result);
															} catch (e){
																alert('Не удалось прочитать ' + file.name + '!\n' + 'Ошибка: ' + e.message);
															}
															var filtered = filter(html);
															var parent = container.elem;
															var classesOfDescription = descriptionTypes.map(type=>(preferences.descriptionTypes[type].class));
															var canCopyValues = filtered.reduce(
																(final, block)=>{
																	var hasClass = classesOfDescription.some(
																		className=>{
																			if(block.className == className)
																				return true 
																			else 
																				return false
																		}
																	);
																	final = final || hasClass;
																	return final
																}, false);
															if(canCopyValues){
																while(parent.childNodes.length>0){
																	parent.removeChild(parent.firstChild);
																}
																parent.childs = [];
																filtered.forEach(description=>{
																	var quantityOfBlocks;
																	/*if(description.className !== preferences.descriptionTypes.little.class){
																		quantityOfBlocks = description.getElementsByTagName('h3').length < 1 ? 1 : description.getElementsByTagName('h3').length;
																		var newDescription = buildDesc(description.className, quantityOfBlocks, template);
																		var element = append(newDescription, parent);
																		dragNdrop(element.elem, parent);
																		nthOfBlock('p.path i.nth', 'p.path input[type=checkbox]');
																		valueFromHtml(description, container.elem.querySelector(`.${description.className}`))
																	} else {
																		dragNdrop(changeDescription(description.className, parent, 1).elem, parent);
																		valueFromHtml(description, container.elem.querySelector(`.${description.className}`))
																		
																	}*/
																	//valueFromHtml(description, parent);
																	parseElements(description, parent);
																	nthOfBlock('p.path i.nth', 'p.path input[type=checkbox]');

																});
																stylingChess(parent);
															} else {
																alert(`Файл ${file.name} не содержит блоков с описанием!`)
															}
															
															
														}
													} else {
														alert('Выбран не валидный html-файл!')
													}
												} else {
													alert('Ничего не выбрано!')
												}
												this.value = '';
											}
													
										}
									},
									{
										name: 'label',
										params: {
											for: 'addFile',
											class: 'button btn btn-theme-default',

										},
										props: {
											style : 'background: url("http://pngimages.net/sites/default/files/file-png-image-59234.png") center no-repeat #31a8d2; background-size: contain; display: block;'
										},
										childs: [

										]
									}
								]
							}
								
								
						]
					},

				]	
			}
		]			
}
const description =  {	
		name: 'div', 
		params:{
			class: 'tab-content',
			id: 'description',
			style: 'display: none; overflow: auto; position: relative; min-height: 200px',
		},
		childs: [
			fileName,
			container,
			controls
		]
		
}
const newTab = {
		name: 'li',
		params:{

		},
		childs:[{
			name: 'a',
			params:{
				href: '#description', 
				onmouseup: "$('html, body').animate({scrollTop: $('#tabs2').offset().top}, 800)"
			},
			props:{
				textContent: 'Шаблоны',
				
			}
		}]
		
	
}

function formatsCount(picturesFormat){
	var formats = [];
	var prefFormats = Object.keys(picturesFormat);
	prefFormats.forEach((format, i)=>{
		formats[i] = {
			name: 'option', 
			params: {}, 
			childs: [], 
			props: {
				textContent: picturesFormat[format]
			}
		};
	});
	return formats;
}
var buffer = [], selector = "data";
function descriptionChanger(types){
	var result = [], size = descriptionTypes.length;
	descriptionTypes.forEach((type, i)=>{
		result[i] = {
			name: "div",
			params:{
				class: `col-lg${12/size} col-md-${12/size}`, 
				style: 'padding:0'
			}, 
			childs:[

				{
					name: 'input', 
					params: {
						type: 'radio', 
						name: 'description', 
						value: type, 
						id: types[type].class, 
						style: 'display:none',
						checked: (types[type].class == preferences.defaultType.class ? true : false)
					
					},
					props: {
						onchange: function(){
							var childs = [].reduce.call(container.elem.childNodes, (acum, children)=>(acum = acum.concat([].slice.call(children.childNodes))), []);
							replaceORwrite(byAttrName(childs, selector), buffer);
							var response = acceptCopy();
							var activeDescription = changeDescription(preferences.descriptionTypes[this.value].class, container.elem, type=='little' ? 1 : response ? buffer.length : null);
							chooser.elem.style.left = `${100*(i/size)}%`;
							response ? copyValues(activeDescription.elem, selector) : null;
							
						},
						
					}
				}, 
				{
					name: 'label', 
					params: {
						for: types[type].class, 
						style: 'cursor: pointer; margin-right:5px'
					}, 
					props: {
						textContent: types[type].name
					}
				},
				{
					name: 'a', 
					params: {
						class: 'button btn btn-theme-default'
					}, 
					props: {
						textContent: '+',
						onclick : function (){
							var wrpr = container.elem;
							var childs = wrpr.childNodes;
							var descripContainer = [].reduce.call(childs, (last, child)=>{
								if(types[type].class == child.className){
									last = child
								}
								return last
							}, null);
							var outer = descripContainer;
							
							if(outer){
								var elem = append(template(types[type].class), outer);
								dragNdrop(elem.elem.parentNode, wrpr);
							} else {
								var elem = append(buildDesc(types[type].class, 1, template), wrpr);
								dragNdrop(elem.elem, wrpr);
							}
							nthOfBlock('p.path i.nth', 'p.path input[type=checkbox]');
							stylingChess(wrpr);
							autoComplete.call(document.querySelector('p.path input[type=number]'), 'p.path input[type=number]');
							autoComplete.call(document.querySelector('p.path input[type=text]'), 'p.path input[type=text]');
							
						}
					}
				}
			]	
				
		};
		
		
	});

	return result;
}
function changeDescription(className, parent, quantityOfBlocks){
	while(parent.childNodes.length>0){
		parent.removeChild(parent.firstChild);
	}
	parent.childs = [];
	var [typeofDescription] = descriptionTypes.filter(type=>(preferences.descriptionTypes[type].class === className));

	var newDescription = buildDesc(className, quantityOfBlocks || preferences.descriptionTypes[typeofDescription].rows, template);
	var element = append(newDescription, parent);
	stylingChess(parent);
	dragNdrop(element.elem, parent);
	nthOfBlock('p.path i.nth', 'p.path input[type=checkbox]');
	return element
}
function removeFromChilds(parent, elem){
	var childs = parent.childs;
	if(childs){
		if(childs.length > 1){
			var index = childs.indexOf(elem);
			var [start, finish] = [childs.slice(0, index), childs.slice(index+1)];
			parent.childs = start.concat(finish);
		}else {
			parent.childs = [];
		}
			
	}
	return parent.childs;
}
function nthOfBlock(querySelectorAll, checked){
	var elems = document.querySelectorAll(querySelectorAll);
	var bases = document.querySelectorAll(checked);
	var n = 1;
	[].forEach.call(bases, (base, i)=>{
		if(base.checked)
			elems[i].textContent = `-${n++}`
		else
			elems[i].textContent = '';
	});

}
function create(tagName, attrs, childs, props){
	var elem = document.createElement(tagName);
	
	if(attrs){
		if(attrs.constructor.name != 'Object'){
			console.error(`Attributes of <${tagName}> tag is not Object`);
			return;
		}
		var paramsArr = Object.keys(attrs);
			paramsArr.forEach(attr=>{
				if(attrs[attr])
					elem.setAttribute(attr, attrs[attr]);
		})
	}
	
	if(props){
		if(props.constructor.name != 'Object'){
			console.error(`Properties of <${tagName}> tag is not Object`);
			return;
		}
		var properties = Object.keys(props);
			properties.forEach(prop=>{
				if(prop in elem){
					elem[prop] = props[prop];
				}
			})
	}
	if(childs){
		try{
			if(childs.constructor.name == 'Array'){
				[].forEach.call(childs, child=>{
					elem.appendChild(child);
				})
			} else {
				elem.appendChild(childs);
			}
		} catch(e) {
			console.error(e);
			return;
		}
	
	}
	return elem;

}


function recursiveCreatingElems(roots){
	/*debugger*/
	var map = roots, result = {}, n = 0;
	
	search(roots, result, n);

	function search(block, parent, n){
		
		var current;
		
			if(block.name){
				current = creating(block);
				if(map !== block){
					parent.appendChild(current);
					if(!parent.childs){
						parent.childs = [current];
					} else {
						parent.childs.push(current)
					}
					
				}
				block.elem = current;

			} else if(block instanceof Object) {
				var props = Object.keys(block);
				props.forEach(prop=>{
					search(block[prop], parent, prop);
				})
			};
			if(block.childs) {
				search(block.childs, current, n+1);
				block.elem = current;
			} 
	}	

	function creating(block){
		var tag = create(block.name, block.params, null, block.props);	
		return tag;

	}
	return roots;

}
function buildDesc(className, quantity, elem){
	var n = 0, result;
	result = {name: 'div', params: {class: className}, childs: []};
	while(n<quantity){
		var child = elem(className, null, null, true);
		result.childs.push(child); 
		n++;
	} 
	return result;
}
function append(elem, parent){
	var result = recursiveCreatingElems(elem);
	parent.appendChild(result.elem);
	if(!parent.childs){
		parent.childs = [result.elem];
	} else {
		parent.childs.push(result.elem);
	}
	return result;
}
function byAttrName(childs, attrName){
	var build = [];
	[].forEach.call(childs, (node, i)=>{
		build[i] = {dyn:{}, static: {}};
		[].forEach.call(node.querySelectorAll(`*[${attrName}]`), elem=>{
				var tag = elem.tagName.toLowerCase();
				if(tag == 'input' || tag == 'textarea'){
					if(elem.getAttribute(attrName) == 'image-switcher'){
						build[i].static[elem.getAttribute(attrName)] = elem.checked;
					} else {
						build[i].dyn[elem.getAttribute(attrName)] = elem.value;
					}
				} 
				else if(tag == 'img'){
					build[i].dyn[elem.getAttribute(attrName)] = elem.src;
					build[i].static.imgStyle = {};
					if(elem.style.height){
						build[i].static.imgStyle['height'] = elem.style.height;
					}
					if(elem.style.width){
						build[i].static.imgStyle['width'] = elem.style.width;
					}
				} else {
					build[i].static[elem.getAttribute(attrName)] = elem.value || elem.textContent;
				}
				
		})
	});
	return build;
}
function replaceORwrite(inArr, outArr){
	for(let i = 0; i < inArr.length; i++){
		outArr[i] = inArr[i]
	};
	return outArr;
}
function checkDataInBuffer(arr){
	var emty = true;
	arr.forEach(obj=>{
		props = Object.keys(obj.dyn);
		
		props.forEach(prop=>{
			if(obj.dyn[prop]){
				emty = false;
			}
		})
	})
	return emty;

}
function acceptCopy(){
	const emty = checkDataInBuffer(buffer);
	if(!emty){
		var question = confirm('Форма содержит данные! Заполнить ними новые поля?')
		if(question){
			return true;
		} else {
			buffer = [];
			return false;
		}
	}
	buffer = [];
	return false;
}
function copyValues(toElems, selector){
	[].forEach.call(toElems.childs, (node, i)=>{
		if(buffer[i]){
			var props = Object.keys(buffer[i].dyn);
			props.forEach(prop=>{
				var elem = node.querySelector(`*[${selector}=${prop}]`);
				if(elem.tagName.toLowerCase() == 'img'){
					elem.src = buffer[i].dyn[prop];
				} else {
					elem.value = buffer[i].dyn[prop];	
				}
			
			})
		
		}
			
				
	})

	console.log(buffer)
}
var options = {

	cursor: 'move',

	forcePlaceholderSize : true,

	start: function(e, ui ){
		ui.placeholder.height(ui.helper.outerHeight());
	},
};
function dragNdrop(elem, connectedList){
		function defineConnectedList(){
			var arr = [].forEach.call(connectedList.childNodes, node=>{
				var connectWith = [].filter.call(connectedList.childNodes, child=>(child!=node));
				options.connectWith = [...connectWith];
				$(node).sortable(options);
				node.className = node.className.replace(' ui-sortable', '');
			})
		}
		function unionBlocks(container){
			var classes = [].reduce.call(container.childNodes, (sameElem, elem)=>{
				if(sameElem.className == elem.className){
					sameElem.first = false;
					[].forEach.call(elem.childNodes, block=>{
						sameElem.elem.appendChild(block);
					});
					container.removeChild(elem);
				} else {
					sameElem.elem = elem;
					sameElem.first = true;
					sameElem.className = elem.className;
				}
				return sameElem
			}, {className: '', main: null, first: true})
		}
		options.create = function(e, ui){
			defineConnectedList()
		}
		options.update = function(e, ui){
		  	nthOfBlock('p.path i.nth', 'p.path input[type=checkbox]'); 
		  	defineConnectedList();
		  	[].forEach.call(connectedList.childNodes, node=>{
				if(node.nodeType == 1 && node.childNodes.length == 0){
					connectedList.removeChild(node)
				}
			});
			unionBlocks(connectedList);

		  	
		};
		options.receive = function(e, ui){
			var target = e.target;
			var sender = ui.sender[0];
			var item = ui.item[0];
			if(target.className!=sender.className){
				var itemIndex = [].indexOf.call(target.childNodes, item);
				var childs = [].slice.call(target.childNodes);
				var [firstSlice, secondSlice] = [childs.slice(0, itemIndex), childs.slice(itemIndex+1)];
				var parentOfSecondSlice;
				if(secondSlice.length > 0){	
					parentOfSecondSlice = create('div', {class: target.className});
					[].forEach.call(secondSlice, slice=>{
						parentOfSecondSlice.appendChild(slice);

					})
					connectedList.insertBefore(parentOfSecondSlice, target.nextSibling)
				}
				var newDesc = create('div', {class: sender.className});
				newDesc.appendChild(item);
				connectedList.insertBefore(newDesc, parentOfSecondSlice ? parentOfSecondSlice : target.nextSibling);
			}
			defineConnectedList();
		};
		options.stop = function(){
			stylingChess(connectedList)
		}

		defineConnectedList()

					
}

function lookAtPreview(containerChilds, caller){	
	var output = [];
	var countChessBlocks = 0;
	function setStyles(data){
		var result = '', styles = Object.keys(data.static.imgStyle);
		styles.forEach(style=>{
			if(data.static.imgStyle[style]){
				result += `${style} : ${data.static.imgStyle[style]}; `
			}
		});
		return result;
	};

	const descriptionHandler = {
		[preferences.descriptionTypes.full.class] : function (buffer){
			var desc = {
				name: 'div',
				params: {
					class: preferences.descriptionTypes.full.class
				},
				props: {

				},
				childs: []	
			};
			buffer.forEach((data, i)=>{
				var caption = {
					name: 'h3',
					props: {
						textContent: data.dyn.caption
					}
				};
				var text = {
					name: 'p',
					props: {
						innerHTML: data.dyn.text
					}
				};
				var img = {
					name: 'img',
					params: {
						src: caller == 'preview'? data.dyn.picture : (data.static.servpath + data.dyn.folder + data.static.description + data.dyn['image-name'] + data.static.order + data.static.format),
						style: setStyles(data),
						alt: data.dyn.alt,
						title: data.dyn.title
					}
				};
				var descContent = data.static['image-switcher'] ? [caption, text, img] : [caption, text]
				desc.childs = desc.childs.concat(descContent);
			});
			return desc;
		},
		[preferences.descriptionTypes.chess.class] : function (buffer){
			var desc = {
				name: 'div',
				params: {
					class: preferences.descriptionTypes.chess.class
				},
				props: {

				},
				childs: []	
			};
			buffer.forEach((data, i)=>{
				var block = {	
							name: 'div',
							childs: [
									{
										name: 'h3',
										params: {
											class: countChessBlocks%2!==0 ? 'pravo' : ''
										},
										props: {
											textContent: data.dyn.caption
										}
									},
									{
										name: 'div',
										params: {
											class: countChessBlocks++%2==0 ? 'right' : 'left'
										},
										childs: data.static['image-switcher'] ? [
											{
												name: 'img',
												params: {
													src: caller == 'preview'? data.dyn.picture : (data.static.servpath + data.dyn.folder + data.static.description + data.dyn['image-name'] + data.static.order + data.static.format),
													style: setStyles(data),
													alt: data.dyn.alt,
													title: data.dyn.title
												}
											}
										] : null
									},
									{
										name: 'p',
										props: {
											innerHTML: data.dyn.text
										}
									},
									{
										name: 'div',
										params: {
											class: 'clear'
										},
										props: {

										}

									}
									
								]	
							};
				desc.childs.push(block);
			});
			return desc;
		},
		[preferences.descriptionTypes.little.class] : function (buffer){
			var data = buffer[0];
			var desc = {
				name: 'div',
				params: {
					class: preferences.descriptionTypes.little.class
				},
				props: {

				},
				childs: [
					{
						name: 'div',
						params: {},
						props: {},
						childs: [
							data.static['image-switcher'] ? {
								name: 'img',
								params: {
									src: caller == 'preview'? data.dyn.picture : (data.static.servpath + data.dyn.folder + data.static.description + data.dyn['image-name'] + data.static.order + data.static.format),
									style: setStyles(data),
									alt: data.dyn.alt,
									title: data.dyn.title
								}
							} : {},
							{
								name: 'p',
								props: {
									innerHTML: data.dyn.text
								}
							},
							{
								name: 'div',
								params: {
									class: 'clear'
								}
							}
						]
					}
				]
			};
			return desc;
		},

	};
	
	[].forEach.call(containerChilds, description=>{
		var temp = [];
		replaceORwrite(byAttrName(description.childNodes, selector), temp);
		var result = descriptionHandler[description.className](temp);
		output.push(result)
		
	});
	return output
	
}
function valueFromHtml(html, parent){
	var imgs = html.getElementsByTagName('img');
	var h3s = html.getElementsByTagName('h3');
	var ps = html.getElementsByTagName('p');
	var maxQuantity = [imgs, h3s, ps].reduce((a,b)=>{if(a.length>b.length){return a}else{return b}});
	var newDescription = buildDesc(html.className, maxQuantity.length, template);
	var element = append(newDescription, parent);
	dragNdrop(element.elem, parent);
	[].forEach.call(maxQuantity, (_,i)=>{
		var parent = element.elem.querySelectorAll('.blocks')[i];
		if(h3s[i]){
			parent.querySelector('input.caption').value = h3s[i].textContent.trim();
		};
		if(ps[i]){
			parent.querySelector('textarea').value = ps[i].innerHTML.trim();
		};
		if(imgs[i]){
			parent.querySelector('.imgProps input[data=alt]').value = imgs[i].alt.trim();
			parent.querySelector('.imgProps input[data=title]').value = imgs[i].title.trim();
			var pathVAlues = imgs[i].src.split(/(\/|\.)/);
			parent.querySelector('p.path input[data=folder]').value = pathVAlues.filter((part)=>(!isNaN(Number(part))) && part.length>3)[0].trim();
			parent.querySelector('p.path select[data=format]').value = `.${pathVAlues[pathVAlues.length-1]}`;
		} else if(!imgs[i]){
			parent.querySelector('p.path input[data=image-switcher]').click();
		}

	})
}
function parseElements(html, parent){
	var imgs = html.getElementsByTagName('img');
	var h3s = html.getElementsByTagName('h3');
	var ps = html.getElementsByTagName('p');
	var maxQuantity = [imgs, h3s, ps].reduce((a,b)=>{if(a.length>b.length){return a}else{return b}});
	//var newDescription = buildDesc(html.className, maxQuantity.length, template);
	
	var descriptionHandler = {
		[preferences.descriptionTypes.full.class] : function(){
			var filtered = [].filter.call(html.childNodes, node=>(node.nodeType == 1));
			var result = {name: 'div', params: {class: html.className}, childs: []};
			for(var i = 0; i < filtered.length; i++){
					var child = [html.className];
					if(!(/img|p|h3/.test(filtered[i].tagName.toLowerCase())) && filtered[i].innerHTML.trim().length > 3){
						result.childs.push(template(html.className, null, filtered[i].outerHTML.trim()))
						
					} else {
						var needRender = false;
						if(filtered[i].tagName.toLowerCase() == 'h3' && filtered[i].innerHTML.trim().length > 3){
							child.push(filtered[i].textContent.trim());
							needRender = true;
							++i
						} else {
							child.push(null)
						}

						if(filtered[i].tagName.toLowerCase() == 'p' && filtered[i].innerHTML.trim().length > 3){
							child.push(filtered[i].innerHTML.trim())
							needRender = true;
							++i
						} else {
							child.push(null)
						}
						if(filtered[i].tagName.toLowerCase() == 'img'){
							child.push(true, filtered[i].alt.trim(), filtered[i].title.trim())
							needRender = true;
							++i
						} else {
							child.push(null)
						} 
						if(needRender)
							result.childs.push(template(...child))
						
					}
			}
			/*[].forEach.call(html.childNodes, (child, i)=>{
				if(child.nodeType == 1){
					if(child.tagName.toLowerCase() == 'h3'){

					} else if(child.tagName.toLowerCase() == 'p'){
						
					} else if(child.tagName.toLowerCase() == 'img'){
						
					} else {

					}
				}
			})*/
			console.log(result, filtered)
			var element = append(result, parent);
			
		},

	}
	descriptionHandler[html.className]();
}
function htmlFormat(string){
	/*debugger*/
	string = string.replace(/\n|\t/g, '');
	var txt = '', indent = '    ', n = 0, start = 0, finish = string.length,  openTag = '<', last = openTag, closeTag = '</', reg = /(input|img|br)/;
	function indentation(indent){
		var result = '';
		for(let i = n; i>0; i--){
			result+=indent ;
		}
		return result;
	}
	function rec(){
		for(let i = start; i<finish; i++){
			/*debugger*/
			if(string[i]== openTag && string[i+1] != '/'){
				if(last == openTag){
					++n;
				}
				txt += '\n' + indentation(indent) + string[i];
				last = openTag;
				if(reg.test(string.slice(i, i+5))){
					last = closeTag
				}
				
			} else if(string[i]=='<' && string[i+1] == '/'){
				if(last == closeTag){
					--n;
				}
				txt += '\n' + indentation(indent) + string[i] ;
				last = closeTag;
			} else if(string[i] == '>' && string[i+1]!= openTag){
				++n;
				txt += string[i] + '\n' + indentation(indent);
				last = closeTag;

			} else {
				txt += string[i];
			}
			
		}
	}
	rec()
	return txt;
};
function stylingChess(container){
	var result = [].reduce.call(container.childNodes, (bundler, description)=>{
		if(description.className == preferences.descriptionTypes.chess.class){
			[].forEach.call(description.childNodes, block=>{
				if(block.nodeType == 1){
					bundler.push(block)
				}
			})
		}
		return bundler;
	}, []);
	if(result.length>0){
		result.forEach((block, i)=>{
			var img = block.querySelector('.img-placeholder');
			var textContent = block.querySelector('.text-content');
			if(i%2==0){
				textContent.style.float = 'left';
				img.style.float = 'right';
			} else {
				textContent.style.float = 'right';
				img.style.float = 'left';
			}
		})
	}
	return result
}
if(tabs){
	var tab = append(newTab, tabs);
	var descrip = append(description, tabs2);
	var controlP = descrip.elem.childs[1].childs[0];
	var contain = descrip.elem.childs[0];
	var button = tab.elem.childs[0];
	// START TO SET ORDER TO BLOCKS
	nthOfBlock('p.path i.nth', 'p.path input[type=checkbox]');
	// END TO SET ORDER TO BLOCKS
	[].forEach.call(tabs.querySelectorAll('a'), (a)=>{
		a.onclick = function(e){
			e.preventDefault();
			var selector = tabs.querySelectorAll('a.selected');
			$(selector).removeClass('selected');
			$(e.target).addClass('selected');
			$($(e.target).attr('href')).fadeIn();
			$(selector).not(e.target).each(function(i, element) {
				$($(element).attr('href')).hide();
				
			});
			var offsetTop = $(controlP).offset().top;
			if(button === e.target)	{
				[].forEach.call(contain.childs, desc=>{
					dragNdrop(desc, contain);
				});
				window.onscroll = function(e){

					const height = parseFloat(getComputedStyle(controlP).height);
					if(window.pageYOffset > offsetTop && (0 < (contain.getBoundingClientRect().bottom - height))){
						controlP.style.top  = pageYOffset - offsetTop + 10  + 'px';
						
					}
					else if(0 >= (contain.getBoundingClientRect().bottom - height)){
						return;

					} else{
						controlP.style.top  = '0';
					}
				}
			} else {
				window.onscroll = null;
			}

			return false;
		}

	});
	
}