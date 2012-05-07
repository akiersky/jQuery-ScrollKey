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

        var _ = this,
        	pos, 
        	easeDef,
			keys = {},
			didScroll = false,
			docHeight,
			windowHeight
		
		
        _.settings = {
        	'easeDef':'linear', 
        	'toFrom':'to'
        }

        var init = function() {
            _.settings = $.extend({}, defaults, options);
            //docHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)
            docHeight = $(document).height()
            windowHeight = $(window).height()
    
			$(window).bind('scroll.scrollKey', function() {
			    didScroll = true;
			})
			
			document.body.addEventListener('touchmove', function(e){
				e.preventDefault()
			})
			
			  document.body.addEventListener('touchstart', _, false);
			  document.body.addEventListener('touchmove', _, false);
			  document.body.addEventListener('touchend', _, false);
			
			//console.log(document.body.style);
			//test for css tranformations  
			if ('WebkitTransform' in document.body.style 
				 || 'MozTransform' in document.body.style 
				 || 'OTransform' in document.body.style 
				 || 'transform' in document.body.style) 
				{
				    _.settings.csstrans = true;
				}
				
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
				if(keys[obj].length > 1) {// && isOnscreen($(obj))) { //if only one frame, why use keyframes? 
										
					thisKey: for(i = 0; i< keys[obj].length; i++){ // loop through the keys of each object
						var key = keys[obj][i]
						
						for(prop in key) { 
							var frame = [prop]
							var value = key[prop]
							
								var nxt;
							if (keys[obj].length == (i+1)) {//is this the last frame?
								nxt = keys[obj][i-1]
							} else {
								nxt = keys[obj][i+1]
							}
							
							if (i == 0 && pos < key.frame){
								//console.log(pos  + " - " + key.css)
								$(obj).stop().css(key.css);
							}else if (pos == key.frame) {//if equal, just set it
								$(obj).stop().css(key.css);
								//console.log("equal to frame")
							
							} else if (pos > key.frame && (pos < nxt.frame)){
								
								//ok, position is between this key and the next, let's interpolate!
								$.each(key.css, function (prop, cssVal){
									//loop through the css props on the frame and tween
									if(isIOS) {
										iosTween(key, nxt, prop)
									} else {
										tweenKeys(key, nxt, prop);
									}
								})
								
								break thisKey;
								
							} else if (pos > key.frame && i == keys[obj].length-1) {//greater than all frames
								console.log([pos, key.frame, nxt.frame])
								//console.log("greater than all")
								$(obj).stop().css(key.css);
							}
						}
					}
				}
			}
		}
		
		var tweenKeys = function (key, nxt, prop) {
			var lerpval, aniObj = {}
			if (prop.indexOf("color") >= 0){//color tween, must use lerpColor
				lerpval = lerpColor(key.frame, nxt.frame, key['css'][prop].substring(1), nxt['css'][prop].substring(1))
				//console.log(lerpval + " - " + pos);
				aniObj[prop] = lerpval;
				$(obj).stop(true, false).animate(aniObj, 'fast')
				//$(obj).css(prop,lerpval)
			} else if (prop.indexOf("position") >= 0){//position tween, must seperate x from y
				var lerpX = lerp(key.frame, nxt.frame, key['css'][prop][0], nxt['css'][prop][0])
				var lerpY = lerp(key.frame, nxt.frame, key['css'][prop][1], nxt['css'][prop][1])
				
				$(obj).stop(true, false).animate(prop, lerpX + "px "+lerpY+"px", 'fast');
				
				//$(obj).css(prop, lerpX + "px "+lerpY+"px");
			} else {//regular tween
				lerpval = lerp(key.frame, nxt.frame, key['css'][prop], nxt['css'][prop])
				aniObj[prop] = lerpval
				//console.log($(obj).css('margin-left')  + " - " + lerpval)
				//console.log(aniObj)
				$(obj).stop(true, false).animate(aniObj, 'fast')
				//$(obj).css(prop,lerpval)
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
				console.log(lerpX + " - " +lerpY);
				//$(obj).animate("{"prop + ": (" + lerpX + "px " + lerpY + "px)}")
				//$(obj).animate(prop, lerpX + "px "+lerpY+"px");
				$(obj).css('-webkit-transform', 'translate3d('+lerpX+'px, '+lerpY+'px, 0)')
			} else {//regular tween
				lerpval = lerp(key.frame, nxt.frame, key['css'][prop], nxt['css'][prop])
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
			var pct = percent(start, end)
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
			
			return "#" + toHex(iR) + toHex(iG) + toHex(iB)
		}
		var percent = function (start, end){
			var hi, 
				lo = 0, 
				pct, 
				tmpPos
			if(start > end){
				hi = start - end
				tmpPos = pos - end
			} else {
				hi = end- start
				tmpPos = pos - start
			}
			pct = tmpPos/hi
			return pct
		}
		var toRgb = function (n) {
			var sr = parseInt( n.substring( 0, 2 ), 16 )
			var sg = parseInt( n.substring( 2, 4 ), 16 )
			var sb = parseInt( n.substring( 4, 6 ), 16 )
			return [sr, sg, sb];
		}
		var toHex = function (n) {
			n = parseInt(n,10);
			if (isNaN(n)) return "00";
			n = Math.max(0,Math.min(n,255));
			return "0123456789ABCDEF".charAt((n-n%16)/16)
			      + "0123456789ABCDEF".charAt(n%16);
		}
		var isOnscreen = function (elem) {
		    var docViewTop = $(window).scrollTop();
		    var docViewBottom = docViewTop + $(window).height();
		
		    var elemTop = $(elem).offset().top;
		    var elemBottom = elemTop + $(elem).height();
			if(elemBottom-elemTop >= docViewBottom-docViewTop){
				return (elemTop >= docViewTop) && (elemTop <= docViewBottom)
			} else {
		    	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop))
			}
		}
		//movement with easing equation TODO
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
					vel = vel * 0.9
					
					var newY = contentOffsetY + vel;
					contentOffsetY = newY;
					if(vel > -0.0005 && vel < 0.0005) {
						window.clearInterval(scrollDrift);
					}
					animateTo(newY);
				}, 30);
		    }
		  }
		}
		
		var animateTo = function(offsetY) {
			if(offsetY > 0){
				offsetY = 0
			} else if (-offsetY > docHeight-windowHeight) {
				offsetY = -docHeight+windowHeight
			}
		    contentOffsetY = offsetY;
			pos = -contentOffsetY
					
			updateDisplay(isIOS)
		 	element.style.webkitTransform = 'translate3d(0, ' + offsetY + 'px, 0)';
		}
        init();
    }
})(jQuery);
/* Usage

$(document).ready(function() {

    // create a new instance of the scrollKey
    var sk = new $.scrollKey();

    // add some keys
    sk.addKey("h1", {'font-size': 3px}, 0)
    sk.addKey("h1", {'font-size': 25px}, 100)
    sk.addKey("h1", {'font-size': 10px}, 200)
    //addKey("jquery selector", {'css property': value}, scrollFrame)
    
    // more than one property at a time
    sk.addKey("p", {'color': #ffffff, 'line-spacing': 3}, 0)
    sk.addKey("p", {'color': #000000, 'line-spacing': 6}, 100)
    
    // x, y positioned properties as arrays
    sk.addKey("img", {'background-position': [0, -100]}, 0)
    sk.addKey("img", {'background-position': [0, 100]}, 200)
    
    // print added keys to the log
	sk.printKeys()
});
*/