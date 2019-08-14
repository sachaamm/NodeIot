/*

function simpleTransitionRoutine(element,attribute,startValue,endValue,nbFrames,time,cb){

  var step = parseInt($(element).attr("step"));

  var incrementArg = null;
  step++;

  $(element).attr("step", step);

  var ascending = false;
  if(startValue < endValue)ascending = true;


  if(step % 2 == 0){
    incrementArg = "+=";
    if(ascending) incrementArg = "-=";
  }else{
    incrementArg = "-=";
    if(ascending) incrementArg = "+=";
  }

  var diff = Math.max(startValue,endValue) - Math.min(startValue,endValue);

  var interval = diff / nbFrames;

  simpleTransition(element,attribute,incrementArg,interval,time,cb);

  // SI VALEUR INITIALE < VALEUR DE FIN , AVEC STEP = 0 , STEP ++ , ON DEMARRE SUR STEP 1 DONC -=
  // IL FAUT DONC QUE LA VALEUR DE DEPART SOIT SUPERIEURE A LA VALEUR DE FIN POUR QUE CA MARCHE DANS NOTRE CAS

}

function simpleTransition(element,attribute,increment,attributeInterval,time,cb){

  $(element).animate({

   attribute: increment + attributeInterval

 }, time, cb );


}

*/

// YOU HAVE TO DEFINE transition in CSS TO YOUR ELEMENT !!!
function transitionElement(element,styleAttribute,styleValues,ratio,parentElement){

    var debug = false;

    var currentState = -1;

    if(debug)console.log("ratio " + ratio);


    var closeToThreshold = 1; // PAR DEFAULT THRESHOLD = 1 POUR LA DIFFERENCE

    //console.log($(element).css(styleAttribute));
    var styleValue = pxToNumber($(element).css(styleAttribute));

    if(debug)console.log("style value " + styleValue);

    for(var i = 0 ; i < styleValues.length ; i++){

      //  if( closeTo( $(element).css(styleAttribute) , styleValues[i]) )currentState = i;
      if(  closeTo(parseInt(styleValue) , pxToNumber(styleValues[i]) , closeToThreshold) ) currentState = i;
      //  console.log("element " + element + "style styleAttribute " + styleAttribute + " styleValues["+i+"] " + styleValues[i] + " element style value " + $(element).css(styleAttribute));
      if(debug)console.log( " styleValues["+i+"] " + styleValues[i] + " element style value " + styleValue + " ceil " + parseFloat(styleValue * ratio) + " window width " + $(window).width());

    }

    if(currentState == -1){
      console.error("Error in transition element " + element + ", because current State was not found.");
      return;
    }

    var nextState = (currentState + 1) % styleValues.length;
    var nextStateValue = styleValues[nextState];

    if(debug)console.log("NEXT STATE VALUE " + nextStateValue + " NEXT STATE " + nextState + " ");

    $(element).css(styleAttribute,styleValues[nextState]);
    // INCREMENT STEP
    $(element).attr("step", parseInt( $(element).attr("step"))+1);


}

//
function closeTo(valueA,valueB,threshold){

  //console.log("VALUE A " + valueA);
  //var valueA = pxToNumber(valueA);
  //var valueB = pxToNumber(valueB);

  //console.log("VALUE A " + valueA  + "VALUE B " + valueB) ;

  var diff = Math.max(valueA,valueB) - Math.min(valueA,valueB);


  if(isNaN(diff))console.error("Values are not comparable");

  if(  diff <= threshold ) return true;

  return false;

}
