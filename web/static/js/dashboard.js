function DashBoard() { }
$(document).ready(function() {
	months = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ]

    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='https://weatherwidget.io/js/widget.min.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','weatherwidget-io-js');
    document.getElementById("weatherwidget-io").onclick = function() { return false; }



    function showPosition(position) {
          //x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
    }
	$("#scrollup").click(function() {
		$("html, body").animate({
			scrollTop : 0
		}, 1000);
		$("#scrollup").hide();
	});

function getNotificationData(){
	var parameters = {};
	RetrieveData("callAPI", {
		data : "getCallApi",
		url_api : "getstatusdata",
		parameters : JSON.stringify(parameters)
	}, getstatusdataSuccess, getstatusdataError, true, false);
}

function getdashboarddetailsSuccess(result){
	var output_data = JSON.parse(result);
	if (output_data["success"] != undefined) {
		//getDashboardRecordCountSuccess(JSON.parse(output_data["success"][0])["ds_record_count"])
		getDashboardHarmonizationStatusSuccess(JSON.parse(output_data["success"][0]))
		setTimeout(function() {
			getDashboardData();
		}, AppData.DashboardRefreshTime||15000);
	}
	else if (output_data["error"] != undefined) {
		console.error(output_data["error"][0])
	}
}

function getdashboarddetailsError() {
	console.error("error occured while getting data for dashboard")
}

function getDashboardHarmonizationStatusSuccess(result){
	try {
		
		if (result) {
			var ds_harmonization_status = result["ds_harmonization_status"];
			var processingStatusData = []
			if(ds_harmonization_status!=undefined){
				$.each(ds_harmonization_status, function(file_key,file_val){
					$.each(file_val, function(key,val){
						processingStatusData.push(val)
					});
				});
				
				// processingStatusData.sort(customCompare_output_file_time);
				processingStatusData.sort( ( a, b ) => {
					  return a.output_file_time && b.output_file_time ? (a.output_file_time < b.output_file_time ? 1 : -1) : ( !a.output_file_time && !b.output_file_time ? 0 : ( !a.output_file_time ? 1 : -1 )) 
					} ) ;
				table = $("#HmStatusDataTable tbody");
				table.empty();
				records_received = 0
				records_processed = 0
				records_submitted = 0
				
				$.each(processingStatusData, function(ind, val) {
					if(Object.keys(val).length != 0){
						var output_file_name = val["output_file_name"]==undefined?"":val["output_file_name"]
						var input_file_name = val["input_file_name"]==undefined?"":val["input_file_name"]
						var input_file_time = val["input_file_time"]==undefined?"":val["input_file_time"]
						var input_row_count = val["input_row_count"]==undefined?"":val["input_row_count"]
						if(input_row_count!="")
							records_received += input_row_count
						var output_row_count = val["output_row_count"]==undefined?"":val["output_row_count"]
						if(output_row_count!="")
							records_processed += output_row_count
						var single_count = val["single_count"]==undefined?"":val["single_count"]
						var conflict_count = val["conflict_count"]==undefined?"":val["conflict_count"]
						var notfound_count = val["notfound_count"]==undefined?"":val["notfound_count"]
						var verified_count = val["verified_count"]==undefined?"":val["verified_count"]
						var manual_count = val["manual_count"]==undefined?"":val["manual_count"]
						var reviewed_count = val["reviewed_count"]==undefined?"":val["reviewed_count"]
						if(reviewed_count!="")	
							records_submitted += reviewed_count
						var published_count = val["published_count"]==undefined?"":val["published_count"]
						var output_file_time = val["output_file_time"]==undefined?"":val["output_file_time"].trim()
						row_title = output_file_name.replace(".json", "")
		
						var template = "<tr class='tr' id='status_" + ind + "'>"+
								"<td class='td overflow-ellipsis' style='width:150px;' actFileName = '" + input_file_name + "' title='" + input_file_name + "'>" + input_file_name + "</td>" +
								"<td class='td overflow-ellipsis' style='width:130px;' title='" + input_file_time + "'>" + input_file_time + "</td>"+
								"<td class='td overflow-ellipsis' style='width:70px;' title='" + input_row_count + "'>" + input_row_count + "</td>"+
								"<td class='td overflow-ellipsis' style='width:70px;' title='" + notfound_count + "'>" + notfound_count + "</td>"+
								"<td class='td overflow-ellipsis' style='width:70px;' title='" + single_count + "'>" + single_count + "</td>"+
								"<td class='td overflow-ellipsis' style='width:70px;' title='" + conflict_count + "'>" + conflict_count + "</td>"+
								"<td class='td overflow-ellipsis' style='width:70px;' title='" + verified_count + "'>" + verified_count + "</td>"+
								"<td class='td overflow-ellipsis' style='width:70px;' title='" + reviewed_count + "'>" + reviewed_count + "</td>"+
								"<td class='td overflow-ellipsis' style='width:70px;' title='" + published_count + "'>" + published_count + "</td>"+
								"<td class='td overflow-ellipsis' style='width:70px;' title='" + manual_count + "'>" + manual_count + "</td>" +
								"<td class='td overflow-ellipsis' style='width:180px;' act_file_name ='" + output_file_name + "'  title='" + row_title + "'>";					
						if(output_file_time != ""){
							template += "<span class ='output_file_name'><i title='Edit File' tabindex='0' class='material-icons md-18 right' style='cursor: pointer; margin-right:20px;'>edit</i> " + output_file_time + " </span>";	
						}
						template += "</td>";
						
						table.append(template);
					}
				});
				
				// for dashboard counts
				$("#records_received").text(records_received)
				$("#records_processed").text(records_processed)				
				$("#records_under_processed").text(records_received - records_processed);
				$("#records_submitted").text(records_submitted)
	
				$("#processing_status_table tr td span.output_file_name").on("click", function(ev) {
					try {
						$("#preloader").show();
						if ( $(ev.currentTarget).closest('td').attr('act_file_name') != "" ) {
							$("#dashboard").hide()
							$("#fileUIPart").show();
							out_fileName = $(ev.currentTarget).closest('td').attr('act_file_name');						
							$("#search-results-title").text("HARMONIZED RECORDS - " + out_fileName.replace(/\/\//g, '/').replace("json",""))
							//appendTextArea("editing file : " + out_fileName.replace("____","/"), "white", false);
							out_fileName=out_fileName.replace("/","____").replace("\\","____");
							/*RetrieveData(getResources, {
								data : "getEditFileDetails",
								out_fileName : out_fileName
							}, getEditFileDetailsSuccess, getEditFileDetailsError)*/
							EditGrid.dirName = out_fileName.split('____')[0]
							EditGrid.fileName = out_fileName.split('____')[1]
							EditGrid.tab_name = 'NOTFOUND';
							EditGrid.page_number = 1;
							EditGrid.rows_per_page = default_rows_per_page;
							EditGrid.search_criteria = []
							getGridData();
							
						}
						$("#preloader").hide();
					} catch (err) {
						$("#dv_dashboard").trigger('click');						
						console.error(err)
					}
				});
	
				var dataflowStatusData = result["ds_dataflow_status"];	
				if(dataflowStatusData!=undefined){
					dataflowStatusData.sort(customCompare_wf_called_count)
					table = $("#dfStatusDataTable tbody");
					table.empty();
					$.each(dataflowStatusData, function(ind, val) {
						var wf_id = val["wf_id"]
						var wf_name = val["wf_name"]
						var wf_called_count = val["wf_called_count"]
						var wf_input_file_obj = JSON.stringify(val["wf_input_file_obj"]).replace(/[{}]/g, '')
						if (wf_input_file_obj.split(',').length > 1)
							wf_input_file_obj = wf_input_file_obj.split(',')[0] + "..."
		
						var wf_input_file_obj_title = JSON.stringify(val["wf_input_file_obj"]).replace(/[{}]/g, '').replace(/,/g, '\n')
		
						var template = "<tr class='tr' id='status_" + ind + "'>+" +
								"<td class='td overflow-ellipsis' style='width:255px;' title='" + wf_id + "'>" + wf_id + "</td>" +
								"<td class='td overflow-ellipsis' style='width:255px;' title='" + wf_name + "'>" + wf_name + "</td>" +
								"<td class='td overflow-ellipsis' style='width:255px;' title='" + wf_called_count + "'>" + wf_called_count + "</td>" +
								"<td class='td overflow-ellipsis' style='width:255px;' title='" + wf_input_file_obj_title + "'>" + wf_input_file_obj + "</td>"
						
						table.append(template);
					});
				}
				// data flow status grid binding ends
				
				// log status on dashboard
				var ds_log_details = result["ds_log_details"];		
				if(ds_log_details != undefined){
					var harmonizationStatus = []
					$.each(ds_log_details, function(key,val){
						harmonizationStatus.push(val)
					});
						
						
					harmonizationStatus.sort( ( a, b ) => {
							  return a.triggered_time && b.triggered_time ? (a.triggered_time < b.triggered_time ? 1 : -1) : ( !a.triggered_time && !b.triggered_time ? 0 : ( !a.triggered_time ? 1 : -1 )) 
					} ) ;				
						
					table = $("#HmHarmonizationStatus tbody");
					table.empty();
					$.each(harmonizationStatus, function(ind, val) {					
						var folder_name = val["output_folder_name"] == undefined ? "" : val["output_folder_name"]
						var file_name = val["input_file_name"] == undefined ? "" : val["input_file_name"]
						var triggered_time = val["triggered_time"] == undefined ? "" : val["triggered_time"]
						var status = val["status"] == undefined ? "" : val["status"]
						var log_file = val["log_file"] == undefined ? "" : val["log_file"]
		
						var template = "<tr  class='tr' foldername = '"+folder_name+"' id='hm_status_" + ind + "'>"+
							"<td class='td overflow-ellipsis' style='width:400px;' title='" + folder_name + "'>"+ folder_name + "</td>" + 
							"<td class='td overflow-ellipsis' style='width:300px;' title='" + file_name + "'>"+ file_name + "</td>" + 
							"<td class='td overflow-ellipsis' style='width:160px;' title='" + triggered_time + "'>"+ triggered_time + "</td>"
							/*+ "<td title='"+ status +"'>" + status + "</td>";*/
						template += "<td class='td overflow-ellipsis' style='width:80px;'><div class ='view_workflow_file'><i title='view workflow' tabindex='0' class='material-icons md-18' style='cursor: pointer; margin-right:20px;'>shuffle</i></div></td>";
						template += "<td class='td overflow-ellipsis' style='width:80px;' log_file='"+log_file+"'><div class ='view_log_file'><i title='view log' tabindex='0' class='material-icons md-18' style='cursor: pointer; margin-right:20px;'>description</i></div></td></tr>";
						table.append(template);
					});
				}
			}
		} else if (output_data["error"] != undefined) {
			console.error(output_data["error"][0])
		}

	} catch (err) {
		$("#preloader").hide();
		console.error(err)
		setTimeout(function() {
			getDashboardData();
		}, AppData.DashboardRefreshTime||15000);
	}
}


$(document).on("click", "tr td div.view_workflow_file", function(ev) {
	try {
		$("#preloader").show();												
		var dir_name = $(ev.currentTarget.closest('tr')).attr('foldername') || $(ev.currentTarget).attr("foldername");
		var parameters = {};						
		parameters["dir_name"] = dir_name;	
		
		RetrieveData("callAPI", {
			data : "getCallApi",
			url_api : "getdffiledata",
			parameters : JSON.stringify(parameters)
		}, getDataFlowFileDataSuccess, getDataFlowFileDataError,true,false)						
		
	} catch (err) {												
		console.error(err)
	}
});
$(document).on("click", "tr td div.view_log_file", function(ev) {
	try {
		$("#preloader").show();
		var file_name = $(ev.currentTarget.closest('td')).attr('log_file');
		
		var parameters = {};						
		parameters["file_name"] = file_name;		
		
		RetrieveData("callAPI", {
			data : "getCallApi",
			url_api : "getlogfiledata",
			parameters : JSON.stringify(parameters)
		}, getLogFileDataSuccess, getLogFileDataError,true,false)						
	} catch (err) {												
		console.error(err)
	}
});



function getDataFlowFileDataSuccess(result){
	document.getElementById("showDataFlowJSON").innerHTML = ""
	var dataflow_data = JSON.parse(JSON.parse(result)['success'][0])
	if(dataflow_data == null || dataflow_data['error'] != undefined){
		appendTextArea("Error while getting log data", "red", true);
		return
	}
	$("#modalViewWorkFlow").openModal({
		dismissible : true
	});
	
	document.getElementById("showDataFlowJSON").innerHTML = "<font color='#2A36FF'>" + JSON.stringify(dataflow_data, undefined, 2) + "</font>";
	$("#preloader").hide();
	
	
}

function getDataFlowFileDataError(){
	appendTextArea("Error while getting workflow data", "red", true);
}

function getLogFileDataSuccess(result){
	document.getElementById("showLogFile").innerHTML = "";	
	var log_data = JSON.parse(JSON.parse(result)['success'][0])
	if(log_data == null ||log_data['error'] != undefined){
		appendTextArea("Error while getting log data", "red", true);
		return
	}
	$("#modalViewLog").openModal({
		dismissible : true
	});
	document.getElementById("showLogFile").innerHTML = "<font color='#2A36FF'>" + htmlEncode(log_data) + "</font>";
	$("#preloader").hide();
}

function getLogFileDataError(){
	appendTextArea("Error while getting log data", "red", true);
}

function getstatusdataSuccess(result){
	var output_data = JSON.parse(result);
	if (output_data["success"] != undefined) {		
		populateNotificationDetails(JSON.parse(output_data["success"][0]))
	}
}

function getstatusdataError(){
	appendTextArea("error while getting status meta data", "red", true);
}

function populateNotificationDetails( dataArray ){
	try{
		$("#preloader").show()
		var container_id = '#notification_data'
		
		gridMetaData = AppData.gridConfig['notificationDataGrid'];
		dataArray = flattenStatusMetaData(dataArray["workflow"]||[]);
		Grid.init(container_id, "no_tab_name", gridMetaData, dataArray);
		
		
		$('#'+gridMetaData.GRID_ID+' div.dvth').off('click');
		$('#'+gridMetaData.GRID_ID+' div.dvth').on('click',function(ev) {
			if($(this).attr('columnname') != "ACTIONS"){
				$.each($('#'+gridMetaData.GRID_ID+' div.dvth'),function(dv_key,dv_val){
					if($(this).html().indexOf('<input')==0){
						$(this).html($(this).attr('columnname'))
					}
				});			
				var title = $(this).attr('columnname')		
				$(this).html($('<input class="search_field" type="text" style="border-style: none !important; height: 15px !important ; padding: 0px !important;background-color: white; border: #0e0e0e; border-bottom: 1px solid #9e9e9e;FONT-WEIGHT: NORMAL; " onClick="stopPropagation(event);" title="' + title + '" placeholder="' + title + '" />'));
				var debounceFn = debounce(Grid.filterRows, 100, false, gridMetaData.GRID_ID, $(this).parent().parent());
		        $("#" + gridMetaData.GRID_ID + " input.search_field").unbind().on('keyup', function (ev) {		        		        
		            debounceFn();
		        });
			}
		});
		
	} catch (err) {
		$("#preloader").hide();
		console.error(err)
	}
}


DashBoard.showData = function showData(gridMetaData, dataArray, tab_name, grid_id) 
{
	var html = "";

    Grid.data[gridMetaData.GRID_ID] = Grid.data[gridMetaData.GRID_ID] || {};
    Grid.data[gridMetaData.GRID_ID].DATA = dataArray;
    Grid.data[gridMetaData.GRID_ID].SELECTED = [];
    
    if(dataArray && dataArray.length) {
	    html += dataArray.map(function (dataObj, index) {	    	
	    	
	    	var tr_background = gridMetaData.TR_BACKGROUND_COLOR[dataObj["status"]]||"#fff";	    	
	    		
	        return "<tr class='tr' style='background :"+ tr_background +";' index='" + index + "'>"
	        +'<td class="td overflow-ellipsis" style="width:80px;"><div foldername= "'+dataObj["output_folder"]  +'" class="view_workflow_file"><i title="view workflow" tabindex="0" class="material-icons md-18" style="cursor: pointer; margin-right:20px;">shuffle</i></div></td>'
	        +'<td class="td overflow-ellipsis" style="width:80px;" log_file="'+ dataObj["log_file"] +'"><div class="view_log_file"><i title="view log" tabindex="0" class="material-icons md-18" style="cursor: pointer; margin-right:20px;">description</i></div></td>'
	        + gridMetaData.COLUMNS.map(function (columnMetaDataObj) {
	        	var visibilityHTML = "";
	            var columnHTML = "";
	            var columnName = columnMetaDataObj.NAME;
	            var widthHTML = "\"width: " + columnMetaDataObj.WIDTH + "px;" + visibilityHTML + "\"";	           
	            
                var pureData = dataObj[ columnMetaDataObj.NAME ] || "";
                columnHTML += '<td class="td overflow-ellipsis" style=' + widthHTML + '  data-columnName = "' + columnName + '"  title="' + pureData + '">' + ( pureData || "" ) + '</td>';
	            return columnHTML;
	            
	        }).join("") + "</tr>";        
	    }).join("");
	
	    $("#" + gridMetaData.GRID_ID + " .dataRowList").html(html);
	    
	  
	    $( ".td.actions i[data-onclick]" ).unbind();
	    $( ".td.actions i[data-onclick]" ).bind( "click", function(){
	        var dataRowIndex = $( this ).attr( "data-rowindex" );
	        var dataObj = dataArray[ dataRowIndex ];
	        var dataOnCLick = $( this ).attr( "data-onclick" );
	        executeFunctionByName(dataOnCLick, window, dataObj, dataRowIndex);
	    });
	    
	    $(".notification_tab_refresh").show();
    } 
    else 
    {
    	DashBoard.createNoDataFoundMessage(Grid.data[gridMetaData.GRID_ID].CONTAINER, tab_name , "");
    }
}

DashBoard.createNoDataFoundMessage = function createNoDataFoundMessage( containerSelector,tab_name, message )
{
	message = message || "No status meta data found";
	var html = '<div><div class="loaderMessage">' + message + '</div></div>';
	$( containerSelector ).empty();
	$( containerSelector ).html( html );
	//$( containerSelector ).css( "width","700px").css("margin","auto");
	
	$("#preloader").hide();
};


$(".notification_tab_refresh").on('click',function(ev){
	$(".notification_tab_refresh").hide();
	getNotificationData();
});
});



news = [{
    "_id" : "5c80a69f4fca2b1313740d37",
    "details" : {
        "headline_category" : "city.mumbai",
        "headline_text" : "Man held for posing as navy commander",
        "publish_date" : 20080906.0
    },
    "headline_category" : "city.mumbai",
    "headline_text" : "Man held for posing as navy commander",
    "publish_date" : 20080906.0,
    "image_name" : "car_2.png",
    "detailed_text" : "The cyber cell of Kolkata Police Tuesday arrested a man for impersonating a Navy officer in a cheating case. The accused, a resident of South 24 Parganas, created different accounts on social media to cheat women, according to an investigation officer. A case was lodged on March 4, under Information Technology Act and various sections of the Indian Penal Code (IPC). “On and before May 25, 2018, the accused, Rajan Sharma, who was into online trading, used his mobile number 7768837947 to create multiple accounts on various social networking sites and lured women, falsely representing himself as an Indian Navy officer, posting his photos in uniform,” the officer said on condition of anonymity."
},
{
    "_id" : "5c80a69f4fca2b1313740d38",
    "details" : {
        "headline_category" : "world.europe",
        "headline_text" : "European Union takes road to Rome for 60th anniversary",
        "publish_date" : 20170325.0
    },
    "headline_category" : "world.europe",
    "headline_text" : "European Union takes road to Rome for 60th anniversary",
    "publish_date" : 20170325.0,
    "image_name" : "car_1.png",
    "detailed_text" : "European Union leaders will renew their vows on the 60th anniversary of the troubled bloc's founding treaties Saturday at a special summit in Rome designed to show unity despite Britain's looming divorce."
} ]




function displayNews(result){
    var temp =""
    $.each(result, function(key,val){
         temp += "<div class='row' id='"+val["_id"]+"' >"+
            "<div style='width:20%;position:absolute;'><img src='static/img/"+val["image_name"]+"'/></div>"+
            "<div style='margin-left:22%;'><div><h5>"+val["headline_text"]+"</h5></div>"+
            "<div><p><h6> "+val["detailed_text"]+"</h6></p></div></div></div></hr>";

    });
    $("#news").html($(temp))


}


displayNews(news)


