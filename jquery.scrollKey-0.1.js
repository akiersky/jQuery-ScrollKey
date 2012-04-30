//jquery plugin boilerplate setup
//http://stefangabos.ro/jquery/jquery-plugin-boilerplate-oop/

//ScrollKey plugin
//by aaron kiersky
//creates scroll-based keyframes for dom objects

;(function($) {

    $.scrollKey = function(options) {

        var defaults = {
            propertyName: 'value',
            onSomeEvent: function() {} 
        }

        var _ = this; 
        var 	pos 
        var	easeDef
		var keys = {}
		var	didScroll = false
		
        _.settings = {
        	'easeDef':'linear', 
        	'toFrom':'to'
        }

        var init = function() {
            _.settings = $.extend({}, defaults, options);
            //plugin.el = el;
            
            //console.log("init scrollkey")
    
			$(window).bind('scroll.scrollKey', function() {
			    didScroll = true;
			});
			
			document.body.addEventListener('touchmove', function(e){
				e.preventDefault()
			});
			
			
			  document.body.addEventListener('touchstart', _, false);
			  document.body.addEventListener('touchmove', _, false);
			  document.body.addEventListener('touchend', _, false);
			
			
			setInterval(function() {
			    if ( didScroll ) {
			    	
			        didScroll = false;
			        pos = $(window).scrollTop();
			        
			        //console.log("jScrollKey: "+pos)
			        updateDisplay(isIOS);
			    }
			}, 30);
			
        }

        _.addKey = function(el, params, position ) {
            var key = {
            	css: params,
            	frame: position
            }
            
            if(!keys[el]){
            	keys[el] = []
            }
            keys[el].push(key)
            
							/*if(toFrom == 'to') { //should just add these keyframes when single key is added
								
							} else if (toFrom == 'from'){
								
							} else if (toFrom == 'both'){
								
							}*/
        }
        _.addKeys = function(obj) {
        	//console.log(obj.length)
        	$.each(obj, function(i, key){
        		//console.log(key[0])
        		_.addKey(key[0], key[1], key[2])
        	});
            // code goes here
        }
        _.removeKeys = function() {
            // code goes here
        }
        _.destroy = function() {
            $(window).unbind('.scrollKey')
        }
        _.printTimeline = function() {
        	printKeys()
        }
        _.scrolling = function(){
        	didScroll = true;
        }
		//where the magic happens
		var updateDisplay = function (isIOS) {
			
			objectLoop: for(obj in keys) {// get the objects in the timeline
				if(keys[obj].length > 1) { //if only one frame, why use keyframes? 
				//console.log("object : "+obj)
					//console.log("########################")
					
					
					thisKey: for(i = 0; i< keys[obj].length; i++){ // loop through the keys of each object
						var key = keys[obj][i]
						
						for(prop in key) { 
							var frame = [prop]
							var value = key[prop]
							
								var nxt;
								//var lastFrame = false;
							if (keys[obj].length == (i+1)) {//is this the last frame?
								//lastFrame = true;
								nxt = keys[obj][i-1]
							} else {
								nxt = keys[obj][i+1]
							}
								
								
							if (pos == key.frame) {//if equal, just set it
								$(obj).css(key.css);
								//break thisKey;
							
							} else if (pos > key.frame && (pos < nxt.frame)){
								
								//ok, position is between this key and the next, let's interpolate!
								$.each(key.css, function (prop, cssVal){
									//loop through the css props on the frame and tween
									//if(!lastFrame){ //will need to switch for easing
									if(isIOS) {
										iosTween(key, nxt, prop)
									} else {
										tweenKeys(key, nxt, prop);
									}
									//} else {
									///	tweenKeys(nxt, key, prop);
									//}
								})
								
								break thisKey;
								
							} else if ((pos > key.frame && pos > nxt.frame)) {//greater than all frames
								$(obj).css(key.css);
								//break thisKey;
							}
						}
					}
				}
			}
		}
		
		var tweenKeys = function (key, nxt, prop) {
			var lerpval
			if (prop.indexOf("color") >= 0){//color tween, must use lerpColor
				lerpval = lerpColor(key.frame, nxt.frame, key['css'][prop].substring(1), nxt['css'][prop].substring(1))
				$(obj).css(prop, lerpval)
			} else if (prop.indexOf("position") >= 0){//position tween, must seperate x from y
				var lerpX = lerp(key.frame, nxt.frame, key['css'][prop][0], nxt['css'][prop][0])
				var lerpY = lerp(key.frame, nxt.frame, key['css'][prop][1], nxt['css'][prop][1])
				
				$(obj).css(prop, lerpX + "px "+lerpY+"px");
			} else {//regular tween
				lerpval = lerp(key.frame, nxt.frame, key['css'][prop], nxt['css'][prop])
				//console.log("obj : "+obj +"  prop: "+prop+ " :  value : "+lerpval);
				$(obj).css(prop, lerpval)
				//element.style.webkitTransform = 'translate3d(0, ' + offsetY + 'px, 0)';
				//$(obj).style.webkitTransform = 'translate3d(0, ' + lerpavl + 'px, 0)';
			}
		}
		var iosTween = function (key, nxt, prop){
			var lerpval
			if (prop.indexOf("color") >= 0){//color tween, must use lerpColor
				lerpval = lerpColor(key.frame, nxt.frame, key['css'][prop].substring(1), nxt['css'][prop].substring(1))
				$(obj).css(prop, lerpval)
			} else if (prop.indexOf("position") >= 0){//position tween, must seperate x from y
				var lerpX = lerp(key.frame, nxt.frame, key['css'][prop][0], nxt['css'][prop][0])
				var lerpY = lerp(key.frame, nxt.frame, key['css'][prop][1], nxt['css'][prop][1])
				
				//$(obj).css(prop, lerpX + "px "+lerpY+"px");
				$(obj).css('-webkit-transform', 'translate3d('+lerpX+'px, '+lerpY+'px, 0)')
			} else {//regular tween
				lerpval = lerp(key.frame, nxt.frame, key['css'][prop], nxt['css'][prop])
				//console.log("obj : "+obj +"  prop: "+prop+ " :  value : "+lerpval);
				//$(obj).css(prop, lerpval)
				//element.style.webkitTransform = 'translate3d(0, ' + offsetY + 'px, 0)';
				if(prop.indexOf('left') >= 0) {
					$(obj).css('-webkit-transform', 'translate3d('+ lerpval +'px, 0, 0)')
				}
				if(prop.indexOf('right') >= 0){
					$(obj).css('-webkit-transform', 'translate3d('+ (-lerpval) +'px, 0, 0)')
				}
				if(prop.indexOf('top') >= 0){
					$(obj).css('-webkit-transform', 'translate3d(0, '+ lerpval +'px, 0)')
				}
				if(prop.indexOf('bottom') >= 0){
					$(obj).css('-webkit-transform', 'translate3d(0, '+ (-lerpval) +'px, 0)')
				}
				//elm.style.webkitTransform = 'translate3d('+lerpval+'px, 0, 0)';
			}
		}
		
		//straight linear movement
		var lerp = function (start, end, bValue, eValue) {
			//console.log(">>>>>>>>>>>>>>>>>>end : "+end+"  start : "+start)
			var pct = percent(start, end)
			//console.log(pct + "%")
			var interpolated = ((eValue-bValue)*pct)+bValue
			return interpolated
		}
		
		var lerpColor = function (start, end, bValue, eValue){
			var pct = percent(start, end) //pos/(end-start)
			
			var bRgb = toRgb(bValue)
			var eRgb = toRgb(eValue)
			
			var iR = ((eRgb[0] - bRgb[0])*pct) + bRgb[0]
			var iG = ((eRgb[1] - bRgb[1])*pct) + bRgb[1]
			var iB = ((eRgb[2] - bRgb[2])*pct) + bRgb[2]
			//console.log("lerp pct: "+ iR+ "::"+ iG+ "::"+ iB)//+ "::"+ iA)
			
			return "#" + toHex(iR) + toHex(iG) + toHex(iB)// + toHex(iA)
		}
		var percent = function (start, end){
			var hi, 
				lo = 0, 
				pct, 
				tmpPos
				
			if(start > end){
				hi = start - end;
				tmpPos = pos - end;
			} else {
				hi = end- start;
				tmpPos = pos - start;
			}
			
			
			pct = tmpPos/hi
			
			//console.log(pos + " - " + tmpPos  + " - " + hi  + " - " + lo)
			
			return pct;
		}
		var toRgb = function (n) {
			var sr = parseInt( n.substring( 0, 2 ), 16 )
			var sg = parseInt( n.substring( 2, 4 ), 16 )
			var sb = parseInt( n.substring( 4, 6 ), 16 )
			return [sr, sg, sb];
		}
		var toHex = function toHex(n) {
			n = parseInt(n,10);
			if (isNaN(n)) return "00";
			n = Math.max(0,Math.min(n,255));
			return "0123456789ABCDEF".charAt((n-n%16)/16)
			      + "0123456789ABCDEF".charAt(n%16);
		}
		//movement with easing equation
		var tween = function (start, end, bTween, eTween, ease) {
			//using the jQuery Easing Plugin 1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
			var interpolated = jQuery.easing.linear(null, pos, start, end, eTween-bTween);
			return interpolated;
		}
		var printKeys = function () {
			for(obj in keys) {
				console.log("object is " + obj);
				
				$.each(keys[obj], function (i, v) {
					console.log("  key : "+ i + " - " + v );
					$.each(v, function (j, k) {
						if(j == "css"){
							console.log("        css : ")
							$.each(k, function (prop, val) {
								console.log("           " + prop + ": "+val);
							});	
						} else {
							console.log("       - "+ j + " : " +k)
						}
					});
				})
			}
		}


// ios scrolling  /////////////////////////////////////////////////////////////////////////////////////////
// VIA - http://code.google.com/mobile/articles/webapp_fixed_ui.html

 _.handleEvent = function(e) {
  switch (e.type) {
    case 'touchstart':
      onTouchStart(e);
      break;
    case 'touchmove':
      onTouchMove(e);
      break;
    case 'touchend':
      onTouchEnd(e);
      break;
  }
}

var dragging = false,
	decel = false,
	vel = 0,
	currY,
	prevY,
	
	startTouchY = 0,
	contentStartOffsetY,
	contentOffsetY = 0,
	element = document.body,
	isIOS = false,
	scrollDrift
	
var onTouchStart = function(e) {
	drifting = false;
	isIOS = true;
	window.clearInterval(scrollDrift);
	startTouchY = e.touches[0].clientY;
	contentStartOffsetY = contentOffsetY;
 	clock = new Date();
	cTime = clock.getTime()
	currY = startTouchY
	prevTouch = startTouchY;
}
	
var onTouchMove = function(e) {
 	dragging = true;
 	prevY = currY;
 	
   currY = e.touches[0].clientY;
   
   var deltaY = currY - startTouchY;
   var newY = deltaY + contentStartOffsetY;
   vel = (currY-prevY)
   
   animateTo(newY);
}

var onTouchEnd = function(e) {
  if (dragging) {
  	dragging = false
    if (vel > 0.0001 || vel < -0.0001) {
    	
       scrollDrift = window.setInterval(function() {
			console.log('decelerating : '+vel)
			
			vel = vel * 0.9
			
			var newY = contentOffsetY + vel;
			contentOffsetY = newY;
				
			if(vel > -0.0005 && vel < 0.0005) {
				console.log("stopped")
				window.clearInterval(scrollDrift);
			}
			
			animateTo(newY);
		}, 30);
    }
  }
}

var animateTo = function(offsetY) {
  contentOffsetY = offsetY;
  
	pos = -contentOffsetY
	updateDisplay(isIOS)
 	element.style.webkitTransform = 'translate3d(0, ' + offsetY + 'px, 0)';
}

/*
var doMomentum = function() {
	console.log('decelerating : '+vel)
	//decel = true;
	//var velocity = vel //getEndVelocity();
	//var acceleration = vel < 0 ? 0.0005 : -0.0005;
	//var displacement = - (vel * vel) / (2 * acceleration);
	//var displacement = contentOffsetY -vel
	//var time = - vel / acceleration;
	
	vel = vel * 0.8
	
	var newY = contentOffsetY + vel;
	contentOffsetY = newY;
		
	if(vel > -0.0001 && vel < 0.0001) {
		//drifting = false;
		console.log("stopped")
		window.clearInterval(scrollDrift);
	}
	//console.log(acceleration  + " - " + displacement)
	console.log(newY)
	
	animateTo(newY);
}
var isDragging = function() {
  return (dragging) ? true : false;
}
*/

  // Set up the transition and execute the transform. Once you implement this
  // you will need to figure out an appropriate time to clear the transition
  // so that it doesn’t apply to subsequent scrolling.
  //element.style.webkitTransition = '-webkit-transform ' + time +
      //'ms cubic-bezier(0.33, 0.66, 0.66, 1)';

/*
var stopMomentum = function() {
  if (isDecelerating()) {
    // Get the computed style object.
    var style = document.defaultView.getComputedStyle(element, null);
    // Computed the transform in a matrix object given the style.
    var transform = new WebKitCSSMatrix(style.webkitTransform);
    // Clear the active transition so it doesn’t apply to our next transform.
    element.style.webkitTransition = '';
    // Set the element transform to where it is right now.
    animateTo(transform.m42);
  }
}*/
/*
var shouldStartMomentum = function() {
  return true;
}
var snapToBounds = function() {
  
var isDecelerating = function() {
	
}
*/

        init();

    }
    
})(jQuery);
/* Usage

$(document).ready(function() {

    // create a new instance of the plugin
    var myplugin = new $.pluginName($('#element'));

    // call a public method
    myplugin.foo_public_method();

    // get the value of a public property
    myplugin.settings.property;

});
*/