$(document).ready(function(){
	if(document.querySelector('#image-additional-carousel')){
		
		const mainSlider = document.querySelectorAll('.slick-track')[0];
		const additionalSlider = document.querySelectorAll('.slick-track')[1];
		const preview = document.querySelector('#image-additional-carousel').querySelectorAll('img');
		
		function patch(mainSlider, additionalSlider, preview){
		
			[].forEach.call(preview, (img)=>{
				img.onclick = (e)=>{

					const index = [].indexOf.call(preview, e.target);

					const activeSlideMain = mainSlider.querySelector('.slick-current.slick-active');
					const activeSlideAdd = additionalSlider.querySelector('.slick-current.slick-center');

					$(activeSlideMain).removeClass('slick-current slick-active');
					activeSlideMain.style.cssText += 'z-index: 998; opacity: 0;';

					const mainImgs = mainSlider.querySelectorAll('.slick-slide');
					const addImgs = $(additionalSlider).find('.slick-slide:not(.slick-cloned)');

					$(mainImgs[index]).addClass('slick-current slick-active');
					mainImgs[index].style.cssText += 'z-index: 999; opacity: 1;';

					$(activeSlideAdd).removeClass('slick-current slick-center');
					$(addImgs[index]).addClass('slick-current slick-center').click();

				}
			})
		}
		patch(mainSlider, additionalSlider, preview);

	}	
})