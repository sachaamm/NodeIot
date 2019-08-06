function pxToNumber(pxValue){

  //console.error("px value " + pxValue);

  //var a = parseInt(pxValue);
  //if(!isNaN(a))return pxValue;

  return Math.ceil(pxValue.replace("px",""));

}
