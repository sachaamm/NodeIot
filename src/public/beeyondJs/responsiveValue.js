function percentToPx(percentValue,cssAttribute,ratio,parentElement){

  // Returns width of browser viewport
  var ww = $( window ).width();

  // Returns width of HTML document
  var dw =$( document ).width();

  // Returns width of browser viewport
  var wh = $( window ).height();

  // Returns width of HTML document
  var dh =$( document ).height();

  var aw = ww;
  var ah = wh; // BY DEFAULT USE DOCUMENT


  var referenceAttributeValue = null;

  if(cssAttribute == "width"){

    var pxVal = null;

    if(!parentElement){
      pxVal = aw;
    }else{
      pxVal = $(parentElement).css(cssAttribute);
    }


    //console.log();
    return Math.ceil(percentValue / 100 * pxVal / ratio) + "px";

  }

  if(cssAttribute == "height"){

    var pxVal = null;

    if(!parentElement){
      pxVal = ah;
    }else{
      pxVal = $(parentElement).css(cssAttribute);
    }



    return Math.ceil(percentValue / 100 * pxVal * ratio) + "px";

  }

  console.error("Nothing was returned in percent to px process");

  return null;


}

function ptopx(percentValue,cssAttribute,parentElement){

  return percentToPx(percentValue,cssAttribute,parentElement);

}
