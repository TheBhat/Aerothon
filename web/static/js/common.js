$(document).ready(function(){
  months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  $("#a320 #currentTimestamp").text(getCurrentTimestamp())
  $('.tooltipped').tooltip();
  $('.modal').modal();
  $('.tabs').tabs();
  $('.dropdown-trigger').dropdown({
    coverTrigger:false,
    hover:true
  });


  $('#notificationtrigger').on('click',function(ev){
    $("#notificationtrigger i .notification-badge").remove();
  });


  //getCallAPI("http://localhost:8087/api/ticker/list","",tickerListSuccess,tickerDataError)
  getCallAPI("http://localhost:8087/api/ticker/data","",tickerDataSuccess,tickerDataError)
  //init()
  getCallAPI("http://localhost:8087/api/getkiteloginurl","",getLoginUrlSuccess,getLoginUrlError)
});

page_id="dvtradingpage";
kite_login_url=""
api_key="";
access_token="";
user_id=""
public_token=""

arrSelectedTickrList=[];


function tickerListSuccess(outputData){
    var backtestingtickerlist = outputData["backtestingtickerlist"];
    var tradingtickerlist = outputData["tradingtickerlist"];
    $.each(backtestingtickerlist,function(key,val){
      var temp='<div class="col s6 m4 l2"><a class="waves-effect waves-light btn-large tooltipped" data-html="true"'+
       'data-position="bottom" data-tooltip="'+key+'"><i class="material-icons right close">close</i>'+val+'</a></div>';
      $("#dvbacktestpage div.dv-trigger-btn").append(temp)
    });
    $("a i.close").on('click',function(ev){
        var instance = M.Tooltip.getInstance(ev.currentTarget.parentElement);
        instance.destroy();
        ev.currentTarget.parentElement.parentElement.remove();
    });
    $('.tooltipped').tooltip();

    $.each(tradingtickerlist,function(key,val){
      var temp='<div class="col s12 m12 l3"><ul id="'+val+'" class="collection with-header"><li class="collection-header cyan">'+
      '<h5 class="task-card-title"><i class="material-icons right close">close</i><span id="tickerName" class="tooltipped"'+
      ' data-html="true" data-position="bottom" data-tooltip="'+key+'">'+val+'</span>'+
      '</h5><p class="task-card-date"><a href="" style="color: white;"><i class="material-icons right downloadfile">open_in_new</i></a>'+
      '<span id="currentTimestamp">'+getCurrentTimestamp()+'</span></p></li><li class="collection-item"><span class="">'+
      'Last Traded Price</span><span class="right" id="lasttradedprice">0</span></li><li class="collection-item textaligncenter">'+
      '<a class="waves-effect waves-light btn-small">START</a></li><li class="collection-item"><span class="">Total Buy</span>'+
      '<span class="right" id="tradesplaced">0</span></li><li class="collection-item"><span class="">Total Sell</span>'+
      '<span class="right" id="totalinvested">0</span></li><li class="collection-item"><span class="">Profit/Loss</span>'+
      '<span class="right badge new" data-badge-caption="" id="profitloss">0</span></li></ul></div>';
      $("#dvtradingpage div.dv-card-block").append(temp);
    });
    $('.tooltipped').tooltip();
    $("h5 i.close").off('click');
    $("h5 i.close").on('click',function(ev){
        var instance = M.Tooltip.getInstance(ev.currentTarget.nextSibling);
        instance.destroy();
        $(ev.currentTarget).closest("div").remove()
    });
}

function getLoginUrlSuccess(outputData){
    kite_login_url=outputData["kite_login_url"];
    api_key=outputData["api_key"];
    access_token=outputData["access_token"];
    user_id= outputData["user_id"];
    public_token=outputData["public_token"];
    $("#user_id").text(user_id);
    $("#user_name").text(outputData["user_name"]);
    $("#api_key").text(api_key);
    $("#public_token").text(public_token);

    $("#txtaccesstoken").text(outputData["access_token"])
    if(outputData["access_token"]==""){
        M.Modal.getInstance($("#dvkitesession")[0]).open();
        $(".modalkitesession").removeClass("online").addClass("offline");
    }
    else{
        $(".modalkitesession").removeClass("offline").addClass("online")
    }
}

function getLoginUrlError(){

}

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

function tickerDataError(){

}

function RetrieveData(functionurl, functiondata, callBackSuccess,callBackError,async=true) {
    try{
        $.ajax({
            type: "POST",
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

function getCallAPI(functionurl, functiondata, callBackSuccess,callBackError,async=true) {
    try{
        $.ajax({
            type: "get",
            url: functionurl,
            data: functiondata,
            /*contentType: "application/json; charset=utf-8",*/
            dataType: "jsonp",
            async:async,
            beforeSend:function(request){

            },
            cache:false,
            complete:function(xhr,status){
                if(status==='error' || !xhr.responseJSON){
                    //alert('error')
                    customalert(status+' '+xhr.status,'error')
                }
                else{
                    callBackSuccess(xhr.responseJSON)
                }
            }
        });

    }catch(err){
        alert(err.message)
    }
}


function exchangeSuccess(outputData){
    var indices=JSON.parse(outputData).indices
    //stkexchg

//JSON.parse(outputData).indices.lastprice

//JSON.parse(outputData).indices.change
//"-13.45"
//JSON.parse(outputData).indices.percentage
//undefined
//JSON.parse(outputData).indices.percentchanage
//undefined
//JSON.parse(outputData).indices.percentchange
//"-0.13"
    $("#exchange").html(indices.lastprice)

        setTimeout(function(){
               // getCallAPI("http://localhost:8087/api/ticker/exchange",{},exchangeSuccess,exchangeError)
            },5000);

 }

function exchangeError(outputData){
    $("#exchange").html("error")
}




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


function selectedTicker(tickerName){
    //var tickerName = $("#dlsearchbar option").attr("value");
    //var tickerUrl = $("#dlsearchbar option").attr("tickerUrl");
    var tickerVal = Object.keys(tickerData)[Object.values(tickerData).indexOf(tickerName)]


    //checking if button already present
    if(tickerVal!=undefined && $("#searchbar").val()!=""){
        if(page_id=="dvbacktestpage"){
            var btnPresent=false

            $.each($("#dvbacktestpage div.row.dv-trigger-btn div a"),function(ind,val){
                if($(val).text().replace('close','').toLowerCase()==tickerVal.toLowerCase())
                    btnPresent=true;
            });
            //creating button
            if(!btnPresent){
                var tempBtn='<div class="col s6 m4 l2" ><a class="waves-effect waves-light btn-large tooltipped" data-html="true"data-position="bottom" data-tooltip="'+tickerName+'"><i class="material-icons right close">close</i>'+tickerVal+'</a></div>'
                $("#dvbacktestpage div.row.dv-trigger-btn").append(tempBtn);
                $('.tooltipped').tooltip();
                $("a i.close").off('click');
                $("a i.close").on('click',function(ev){
                    var instance = M.Tooltip.getInstance(ev.currentTarget.parentElement);
                    instance.destroy();
                    ev.currentTarget.parentElement.parentElement.remove();
                 });
            }
        }
        else if(page_id=="dvtradingpage"){
            var cardBlock=false;
            $.each($("#dvtradingpage div.dv-card-block div"),function(ind,val){
                if(this.firstChild.id.toLowerCase()==tickerVal.toLowerCase())
                    cardBlock=true;
            });
            //creating button
            if(!cardBlock){
                var temp='<div class="col s12 m6 l2"><ul id="'+tickerVal+'" class="collection with-header"><li class="collection-header cyan">'+
                    '<h5 class="task-card-title"><i class="material-icons right close">close</i><span id="tickerName" class="tooltipped" data-html="true" data-position="bottom" data-tooltip="'+tickerName+'">'+tickerVal+'</span>'+
                    '</h5><p class="task-card-date"><a href="" style="color: white;"><i class="material-icons right downloadfile">open_in_new</i></a>'+
                    '<span id="currentTimestamp">'+getCurrentTimestamp()+'</span></p></li><li class="collection-item"><span class="">'+
                    'Last Traded Price</span><span class="right" id="lasttradedprice">0</span></li><li class="collection-item textaligncenter">'+
                    '<a class="waves-effect waves-light btn-small">START</a></li><li class="collection-item"><span class="">Total Buy</span>'+
                    '<span class="right" id="tradesplaced">0</span></li><li class="collection-item"><span class="">Total Sell</span>'+
                    '<span class="right" id="totalinvested">0</span></li><li class="collection-item"><span class="">Profit/Loss</span>'+
                    '<span class="right badge new" data-badge-caption="" id="profitloss">0</span></li></ul></div>';
                $("#dvtradingpage div.dv-card-block").append(temp)
                $('.tooltipped').tooltip();
                $("h5 i.close").off('click');
                $("h5 i.close").on('click',function(ev){
                    var instance = M.Tooltip.getInstance(ev.currentTarget.nextSibling);
                    instance.destroy();
                   $(ev.currentTarget).closest("div").remove()
                });
            }
        }
    }
}


$(document).off('click',"div.row.dv-trigger-btn div a")
$(document).on('click',"#dvbacktestpage div.row.dv-trigger-btn div a",function(ev){
    //creating process card block
    var tickerVal=$(ev.target).text().replace('close','').replace('-BE','');
    var tickerName=$(ev.target).attr('data-tooltip')
    var tickerUrl=$(ev.target).attr('tickerUrl')


    var tempCardBlock ='<div class="col s12 m6 l2"><ul id="'+tickerVal+'" class="collection with-header">'+
    '<li class="collection-header cyan"><h5 class="task-card-title">'+
    '<i class="material-icons right close">close</i><span id="tickerName" title="'+tickerName +'">'+tickerVal+'</span></h5>'+
    '<p class="task-card-date"><a href="" style="color: white;"><i class="material-icons right downloadfile">cloud_download</i></a>'+
    '<span id="currentTimestamp">'+getCurrentTimestamp()+'</span></p></li>'+
    '<li class="collection-item"><span class="">Available rows</span><span class="right" id="availablerows"></span></li>'+
    '<li class="collection-item"><span class="">Trades placed</span><span class="right" id="tradesplaced"></span></li>'+
    '<li class="collection-item"><span class="">Total invested</span><span class="right" id="totalinvested"></span></li>'+
    '<li class="collection-item"><span class="">Last Traded Price</span><span class="right" id="lasttradedprice"></span></li>'+
    '<li class="collection-item"><span class="">Profit/Loss</span><span class="right badge" data-badge-caption="" id="profitloss"></span></li></ul></div>'

    if($("#dvbacktestpage div.row.dv-card-block ul#"+tickerVal).length==0){
        $("#dvbacktestpage div.row.dv-card-block").append(tempCardBlock);

        $("#dvbacktestpage div.row.dv-card-block i.close").on('click',function(ev){
            ev.currentTarget.parentElement.parentElement.parentElement.parentElement.remove();
        });

        var params={ticker:tickerVal}
        getCallAPI("http://localhost:8087/api/execute",params,executeSuccess,executeError)
    }
});

function getCurrentTimestamp(){
    var timestamp =  new Date();
    var currentTimestamp=timestamp.getDate()+'-'+months[timestamp.getMonth()]+'-'+timestamp.getFullYear()+' '+timestamp.getHours()+':'+timestamp.getMinutes()+':'+timestamp.getSeconds()
    return currentTimestamp;
}

function executeSuccess(outputData){
    $("#dvbacktestpage #"+outputData.ticker+" #availablerows").text(outputData.ar)
    $("#dvbacktestpage #"+outputData.ticker+" #tradesplaced").text(outputData.tp)
    $("#dvbacktestpage #"+outputData.ticker+" #totalinvested").text(outputData.ti)
    $("#dvbacktestpage #"+outputData.ticker+" #profitloss").text(outputData.pl.toFixed(2))
    $("#dvbacktestpage #"+outputData.ticker+" #lasttradedprice").text(outputData.tv.toFixed(2))

    if(parseFloat(outputData.pl.toFixed(2))<0){
        /*$("#"+outputData.ticker+" .task-card-title i").text('trending_down');
        $("#"+outputData.ticker+" .task-card-title i").removeClass('green').addClass('red')*/
        $("#dvbacktestpage #"+outputData.ticker+" #profitloss").addClass('new badge red')
    }
    else{
        /*$("#"+outputData.ticker+" .task-card-title i").text('trending_up');
        $("#"+outputData.ticker+" .task-card-title i").removeClass('red').addClass('green')*/
        $("#dvbacktestpage #"+outputData.ticker+" #profitloss").addClass('new badge green')
    }
    $("#dvbacktestpage #"+outputData.ticker+" .task-card-date a").attr("href","http://localhost:8087/api/downloadFile/"+outputData.ofp)
}
function executeError(outputData){
    alert('failed')
}

$("#BACKTEST i.refresh").on('click',function(ev){
    erase()
    M.Modal.getInstance($("#dvbacktestmodal")[0]).open()
})


function executeBackTest(){
    var params={}
    if($(".tabs .tab a.active").text().toUpperCase().indexOf("MANUAL")==0){
        backTestDF=[]
        $.each($("#tamanual").val().split('\n'),function(ind,val){
            tempRow={}
            tempRow["PERIOD"]=ind
            tempRow["CLOSE"]=parseFloat(val)
            backTestDF.push(tempRow)
        });
    }
    params = {ticker:'BACKTEST',backtestdata:JSON.stringify(backTestDF)}
    getCallAPI("http://localhost:8087/api/execute",params,executeSuccess,executeError)
    $("#tamanual").val('');
    M.Modal.getInstance($("#dvbacktestmodal")[0]).close()
}


$(".backtestpage").on('click',function(ev){
    page_id="dvbacktestpage"
    $("#dvbacktestpage").removeClass("hide");
    $("#dvtradingpage").addClass("hide");
    $(".backtestpage").addClass("activepage");
    $(".tradingpage").removeClass("activepage");
});

$(".tradingpage").on('click',function(ev){
    page_id="dvtradingpage"
    $("#dvbacktestpage").addClass("hide");
    $("#dvtradingpage").removeClass("hide");
    $(".backtestpage").removeClass("activepage")
    $(".tradingpage").addClass("activepage");
});


$("#btngetrequesttoken").on('click',function(ev){
    popupwindow(kite_login_url, 'test', 800,600);
});

function popupwindow(url, title, w, h) {
  var left = (screen.width/2)-(w/2);
  var top = 30;//1(screen.height/2)-(h/2);
  return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}


$("#btnkitelogin").on('click',function(ev){
    var request_token=$("#txtrequesttoken").val().trim()
    if(request_token!=""){
        params = {request_token:request_token}
        getCallAPI("http://localhost:8087/api/setaccesstoken",params,setAccesstTokenSuccess,setAccesstTokenError)

    }
})

function setAccesstTokenSuccess(outputData){
    access_token=outputData["access_token"];
    $("#txtaccesstoken").text(access_token);
    user_id= outputData["user_id"];
    public_token=outputData["public_token"];
    $("#user_id").text(user_id)
    $("#user_name").text(outputData["user_name"]);
    $("#api_key").text(api_key);
    $("#public_token").text(public_token);
    if(outputData["access_token"]==""){
        $(".modalkitesession").removeClass("online").addClass("offline");
    }
    else{
        $(".modalkitesession").removeClass("offline").addClass("online")
    }
}

function setAccesstTokenError(){

}

$("#modalkitesession").on('click',function(ev){
    M.Modal.getInstance($("#dvkitesession")[0]).open();
});


function customalert(message,type,alerttype='notification'){
    var notibadge='<small class="notification-badge">1</small>';
    $("#notificationtrigger i .notification-badge").remove();
    $("#notificationtrigger i").append(notibadge);
    var tempdivider='<li class="divider"></li>';
    if(alerttype=='console')
        console.log(message);
    else if (alerttype=='alert')
        alert(message);
    else if(alerttype=='notification'){
    var tempdivider='<li class="divider"></li>';
    var temp='';
        if(type=='error'){
            temp='<li><a class="'+type+'"><i class="material-icons">error_outline</i>'+message+'</a><small>'+getCurrentTimestamp()+'</small></li>';
        }
        else if(type=='success'){
            temp='<li><a class="'+type+'"><i class="material-icons">done</i>'+message+'</a><small>'+getCurrentTimestamp()+'</small></li>';
        }
        else if(type=='info'){
            temp='<li><a class="'+type+'"><i class="material-icons">info_outline</i>'+message+'</a><small>'+getCurrentTimestamp()+'</small></li>';
        }

        $("#notifications-dropdown").prepend(temp);
    }
}