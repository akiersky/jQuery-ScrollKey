jQuery-ScrollKey
================

jQuery plugin for scroll-position based object keyframes.

usage example:  

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
