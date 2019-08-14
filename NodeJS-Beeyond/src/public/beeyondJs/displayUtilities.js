	function displayInfo(arg,element,point,text){ // display Insert info

		if(arg == true){

			element.fadeIn("slow");

		}else{
		
			element.fadeOut("slow");

		}


		var rect = point.getBoundingClientRect();

		var responsiveOffset = getResponsiveValue('height',4);
	
		element.css("top",rect.top - responsiveOffset);
		element.css("left",rect.left);


		if(text)element.text(text);

	}


	function getResponsiveValue(arg,percentValue){

		var responsiveValue = 0;

		var responsiveReference = $( window );	// Returns width of browser viewport
		// var responsiveReference = $( document ).width();	// Returns width of HTML document
		
		if(arg == 'height'){
			responsiveValue = responsiveReference.height() * percentValue / 100;
			return responsiveValue;
		}

		if(arg == 'width'){
			resposniveValue = responsiveReference.width() * percentValue / 100;
			return responsiveValue;
		}

		console.error("Error for repsonsive value");
	
		return responsiveValue;

	}


	function setVisibility(element,state){
			
		if(state == false)element.css("display","none");
		if(state == true)element.css("display","inline");
			
	}
