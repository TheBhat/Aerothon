$(document).ready(function(){
  months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  $("#a320 #currentTimestamp").text(getCurrentTimestamp())
  $('.tooltipped').tooltip();
  $('.modal').modal();
  $('.tabs').tabs();
  $('.sidenav').sidenav();
  $('.dropdown-trigger').dropdown({
    coverTrigger:false,
    hover:true
  });

    $("#trigger_sidenav i").on('click',function(ev){
        $("#sidenav-trigger").click();
    });

  $('#notificationtrigger').on('click',function(ev){
    $("#notificationtrigger i .notification-badge").remove();
  });

});


htmlEncode = function( html )
{
	html == null || html == undefined ? html = "": html;
	html = html + "";
	//return html.replace(/[&"'\<\>]/g, function(c)
	return html.replace(/[\<\>]/g, function(c)
	{
		  switch (c)
		  {
//			  case "&":
//			    return "&amp;";
			 /* case "'":
			    return "&#39;";
			  case '"':
			    return "&quot;";*/
			  case "<":
			    return "&lt;";
			  //case ">":
			   default:
			    return "&gt;";
		  }
	});
};

function tickerDataSuccess(outputData){
    // var outputTickerData =JSON.parse(outputData)
    var dataObj={}
    tickerData=outputData
    $.each(Object.values(tickerData),function(ind,val){
        dataObj[val]=null
    })


    var $input = $('#searchbar');
    $input.autocomplete({
      data: dataObj,
      onAutocomplete: function(txt) {
        if(txt!=undefined)
            selectedTicker(txt)
      },
    });

}




function fixDecimal(currvalue){
	if(typeof(currvalue)=="number"){
		if (!isNaN(currvalue) && !isNaN(parseFloat(currvalue)))	{
			if(parseInt(currvalue)==currvalue){
				return currvalue;
			}
			else{
				return parseFloat(currvalue).toFixed(2);
			}
		}
		else{
			return currvalue;
		}
	}
	else{
		return currvalue;
	}
}

//function getCallAPI(functionurl, functiondata, callBackSuccess,callBackError,async=true) {
//    try{
//        $.ajax({
//            type: "get",
//            url: functionurl,
//            data: functiondata,
//            /*contentType: "application/json; charset=utf-8",*/
//            dataType: "jsonp",
//            async:async,
//            beforeSend:function(request){
//
//            },
//            cache:false,
//            complete:function(xhr,status){
//                if(status==='error' || !xhr.responseJSON){
//                    //alert('error')
//                    callBackError(status+' '+xhr.status,'error')
//                }
//                else{
//                    callBackSuccess(xhr.responseJSON)
//                }
//            }
//        });
//
//    }catch(err){
//        alert(err.message)
//    }
//}
//
function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      }
      else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      }
      else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    }
    else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      }
      else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
      else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

    $('.toggle-fullscreen').click(function() {
        toggleFullScreen();
    });





function customFormat(n){
	return n > 9 ? "" + n : "0" + n;
}

function getCurrentTimestamp(){
    var timestamp =  new Date();
    var currentTimestamp=timestamp.getDate()+'-'+months[timestamp.getMonth()]+'-'+timestamp.getFullYear()+' '+timestamp.getHours()+':'+timestamp.getMinutes()+':'+timestamp.getSeconds()
    return currentTimestamp;
}

function formatTimeStamp(unix_val) {
	var today = new Date(unix_val);
	var date = today.getFullYear() + '-' + customFormat(today.getMonth() + 1) + '-' + customFormat(today.getDate());
	var time = customFormat(today.getHours()) + ":" + customFormat(today.getMinutes()) + ":" + customFormat(today.getSeconds());
	var dateTime = date + ' ' + time;
	return dateTime;
}



function showMessage(msg, color) {
	msg=htmlEncode(msg)
	if (color != "red"){
		color = "black"
		Materialize.toast(msg,2000,"rounded");
	}
	else{
		Materialize.toast(msg,2000,"rounded error");
	}
	$("#preloader").hide();

}


function executeFunctionByName(functionName, context){
    var args = Array.prototype.slice.call(arguments, 2);
    if (typeof functionName == "function") {
        functionName.apply(context, args);;
    }
    else {
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        if (func.indexOf("(") != -1 || func.indexOf(")") != -1) {
            func = func.replace("(", "").replace(")", "");
        }
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
    }
};

function debounce(func, wait, immediate) {
    // 'private' variable for instance
    // The returned function will be able to reference this due to closure.
    // Each call to the returned function will share this common timer.
    var timeout;
    var args = Array.prototype.slice.call(arguments, 3);
    // Calling debounce returns a new anonymous function
    return function () {
        // reference the context and args for the setTimeout function
        var context = this;

        // Should the function be called now? If immediate is true
        //   and not already in a timeout then the answer is: Yes
        var callNow = immediate && !timeout;

        // This is the basic debounce behaviour where you can call this
        //   function several times, but it will only execute once
        //   [before or after imposing a delay].
        //   Each time the returned function is called, the timer starts over.
        clearTimeout(timeout);

        // Set the new timeout
        timeout = setTimeout(function () {

            // Inside the timeout function, clear the timeout variable
            // which will let the next execution run when in 'immediate' mode
            timeout = null;

            // Check if the function already ran with the immediate flag
            if (!immediate) {
                // Call the original function with apply
                // apply lets you define the 'this' object as well as the arguments
                //    (both captured before setTimeout)
                func.apply(context, args);
            }
        }, wait);

        // Immediate mode and no wait timer? Execute the function..
        if (callNow) func.apply(context, args);
    };
};




$(".dvpage2").on('click',function(ev){
    page_id="dvpage2";
    $("#dvpage2").removeClass("hide");
    $("#dvpage1").addClass("hide");
    $(".dvpage2").addClass("activepage");
    $(".dvpage1").removeClass("activepage");

    var params=[{param1: "test1", param2 :"test2", page_number : 23, search_criteria : "save"}, {param1: "test1", param2 :"test2", page_number : 23, search_criteria : "save"}]
    SaveData('/v1/api/postexample',params,executeSuccess,executeError)
});

$(".dvpage1").on('click',function(ev){
    page_id="dvpage1";
    $("#dvpage2").addClass("hide");
    $("#dvpage1").removeClass("hide");
    $(".dvpage2").removeClass("activepage")
    $(".dvpage1").addClass("activepage");

    var params={param1: "test1", param2 :"test2", page_number : 23, search_criteria : "ret"}
    RetrieveData('/v1/api/getexample',params,executeSuccess,executeError)

});

function executeSuccess(result){
    alert(JSON.stringify(result));
}

function executeError(result){
    alert(JSON.stringify(result));
}


function SaveData(functionurl, functiondata, callBackSuccess,callBackError,async=true) {
    try{
        $.ajax({
            type: "POST",
            url: functionurl,
            contentType: "application/json",
            data: JSON.stringify(functiondata),
            async:async,
            beforeSend:function(request){

            },
            error: function (result) {
                callBackError(result)
            },
            success: function (result) {
                callBackSuccess(result)
            }
        });

    }catch(err){
        alert(err.message)
    }
}


function RetrieveData(functionurl, functiondata, callBackSuccess,callBackError,async=true) {
    try{
        $.ajax({
            type: "GET",
            url: functionurl,
            data: functiondata,
            /*contentType: "application/json; charset=utf-8",
            dataType: "json",*/
            async:async,
            beforeSend:function(request){

            },
            error: function (result) {
                callBackError(result)
            },
            success: function (result) {
                callBackSuccess(result)
            }
        });

    }catch(err){
        alert(err.message)
    }
}



function showPosition(position) {
//  x.innerHTML = "Latitude: " + position.coords.latitude +
//  "<br>Longitude: " + position.coords.longitude;
}


function getLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser."
  }
};

$("#location").on('click',function(){
    getLocation();
});