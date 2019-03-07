function Grid() { }

Grid.data = {
    gridId: {
    	CONTAINER: "",
    	DATA: []
    }
};

Grid.init = function init(containerSelector, tabName, gridMetaData, dataArray ) {
	$(containerSelector).empty();
    var filter = {};
    $(containerSelector).html(Grid.getGridContainerSkeleton(gridMetaData));
    Grid.showHeaderColumns(gridMetaData, tabName);
    
    Grid.data = Grid.data || {};
    Grid.data[gridMetaData.GRID_ID] = {};
    Grid.data[gridMetaData.GRID_ID].CONTAINER = containerSelector;    
    if (gridMetaData.SORT_COLUMN) {
    	$("#"+gridMetaData.GRID_ID).find('thead th[data-columnname='+gridMetaData.SORT_COLUMN+'] i.sort-asc').addClass('hide');    	
    	dataArray = dataArray.sort( ( a, b ) => b[gridMetaData.SORT_COLUMN].localeCompare( a[gridMetaData.SORT_COLUMN] ) )
    	$("#"+gridMetaData.GRID_ID).find('thead th[data-columnname='+gridMetaData.SORT_COLUMN+'] i.sort-asc').attr("data-sortDirection", -1);    	
    }   
    Grid.showData(gridMetaData, dataArray, tabName);    
	Grid.bindEvents( gridMetaData, dataArray, tabName )   
    setTimeout(function() {
    	$("#preloader").hide()
    ,200});
};

Grid.showHeaderColumns = function showHeaderColumns(gridMetaData, tab_name) {
    var html = "";

    var totalWidth = 0;
    if (gridMetaData.GRID_ID =="notification-data-grid") {
    	html += '<th class="th overflow-ellipsis" style="width : 150px;"></th>';
    }
    html += gridMetaData.COLUMNS.map(function (columnMetaDataObj, index) {
    	var visibilityHTML = "";
    	if ( columnMetaDataObj.IS_SELECTABLE && !columnMetaDataObj.IS_SELECTED )
    	{
    		visibilityHTML = " display:none; ";
    	}
    	else
    	{
    		totalWidth += parseInt( columnMetaDataObj.WIDTH );
    	}
        var columnHTML = "";
        var columnName = columnMetaDataObj.NAME;
        var widthHTML = "\"width: " + ( columnMetaDataObj.WIDTH ) + "px;" + visibilityHTML + "\"";
       
        var data = columnMetaDataObj.CAPTION;
        if (columnMetaDataObj.TYPE == "checkbox") {
        	columnHTML += '<th class="th overflow-ellipsis" style=' + widthHTML + ' data-columnName = "' + columnName + '" ><input type="checkbox" id="headchk" class="filled-in" /><label for="headchk"></label></th>';
        }        
        else {
            columnHTML += '<th class="th overflow-ellipsis" index="' + index + '" data-isSortable="' + (columnMetaDataObj.SORT_BY ? true : false) + '" style=' + widthHTML + '  data-columnName = "' + columnName + '" title="' + data + '"><span class="header-text">';
        }
        if(columnMetaDataObj.SORT_BY){
        	columnHTML += ' <i tabindex="0" class="material-icons sort-asc md-18">arrow_upward</i><i tabindex="0" class="material-icons sort-desc md-18">arrow_downward</i>';
        }
        columnHTML += ' <div columnname="'+data+'" class="dvth" style="padding-left: 10px;">'+ data +'</div></span></th>';	
        
        return columnHTML;
    }).join("");
    // gridMetaData.STYLE = "width: " + totalWidth + "px";
    
    $("#" + gridMetaData.GRID_ID + " .headerColumnRow").html( html );
    if( gridMetaData.COLUMN_DRAG)
    	$("#" + gridMetaData.GRID_ID).css( "width", totalWidth +(gridMetaData.COLUMNS.length*14)+ "px" );
    else
    	$("#" + gridMetaData.GRID_ID).css( "width", totalWidth +(gridMetaData.COLUMNS.length*15)+ "px" );
    
    if ( gridMetaData.COLUMN_DRAG )
    {
        Grid.makeColumnResizable( gridMetaData );
    }
};

Grid.showData = function showData(gridMetaData, dataArray, tabName) 
{
    Grid.data[gridMetaData.GRID_ID] = Grid.data[gridMetaData.GRID_ID] || {};
    Grid.data[gridMetaData.GRID_ID].DATA = dataArray;
    Grid.data[gridMetaData.GRID_ID].SELECTED = [];
    
    executeFunctionByName(gridMetaData.SHOW_DATA , window, gridMetaData, dataArray, tabName );
};

Grid.getGridContainerSkeleton = function getGridContainerSkeleton( gridMetaData ) 
{
    var html = "";

    html += '<div class="row tab-info ev-grid-container compact">';
    html += Grid.getTableSkeletonHTML( gridMetaData );
    
    html += '</div>';

    return html;
};



Grid.getTableSkeletonHTML = function getTableSkeletonHTML(gridMetaData) {
    var html = "";
    html += '<div class="col s12 m12">';
    
    html += '<table class="bordered highlight responsive-table ev-grid" id="' + gridMetaData.GRID_ID + '" style="' + gridMetaData.STYLE + '">';

    // starting thead
    html += '<thead class="thead" style="border: 3px solid teal;">';

    html += '<tr class="tr headerColumnRow">';
    html += '</tr>';

    // ending thead
    html += '</thead>';

    html += '<tbody class="tbody dataRowList" style="max-height: 454px;overflow: auto;display: block;">';

    html += '</tbody>';

    html += '</table>';
    html += '</div>';

    return html;
};

Grid.getInfoTextHTML = function getInfoTextHTML() {
    var html = '';
    html += '<span class="show total"></span>';
    html += '<span class="hide selected"></span>';

    return html;
};

Grid.getStatusHTML = function getStatusHTML(gridMetaData) {
    var html = "";

    html += '<i tabindex="0" class="material-icons waves-effect dropdown-button right" data-activates="view-tab">more_vert</i>';
    	
    if(gridMetaData.IS_SEARCHABLE) {
    	html += '<a href="#!" class="waves-effect right grey-text filter"><i class="material-icons show">filter_list</i></a>';
        html += '<a href="#!" class="ser-expand waves-effect right grey-text"><i class="material-icons show">search</i></a>';
    }
    html += '<i tabindex="0" class="material-icons right hide">delete</i>';

    html += '<div class="input-field ser-tab col s12 right">';
    html += '<i tabindex="0" class="material-icons prefix">search</i>';
    html += '<input id="search-pro" type="text" class="validate " placeholder="Search for Products"><label for="search"></label>';
    html += '<a href="#!" class="ser-close grey-text"><i class="material-icons">close</i></a>';
    html += '</div>';

    return html;
};



Grid.bindEvents = function bindEvents( gridMetaData,dataArray,tabName ){
	
	$("#" + gridMetaData.GRID_ID + " #headchk").unbind("change");
    $("#" + gridMetaData.GRID_ID + " #headchk").bind("change", gridMetaData, Grid.headChkChanged);
    
// $("#" + gridMetaData.GRID_ID + " .tbody").off("change");
// $("#" + gridMetaData.GRID_ID + " .tbody").on("change",
// "input:checkbox[class='filled-in']", gridMetaData, Grid.setSelectedValues);

    // For the Action Icons for Edit and Delete in Tables
    $("#" + gridMetaData.GRID_ID + " .tab-info .table > tbody > tr").on("mouseenter", function () {
        $(this).addClass('active');
    });
    $("#" + gridMetaData.GRID_ID + " .tab-info .table > tbody > tr").on("mouseleave", function () {
        $(this).removeClass('active');
    });

    // Search Expand in Table
    $("#" + gridMetaData.GRID_ID + ' .ser-expand').unbind("click");
    $("#" + gridMetaData.GRID_ID + ' .ser-expand').bind("click", function () {
        $(this).addClass('hide');
        $("#" + gridMetaData.GRID_ID + ' .ser-tab').addClass('expanded');
    });
    
    $("#" + gridMetaData.GRID_ID + ' .ser-close').unbind("click");
    $("#" + gridMetaData.GRID_ID + ' .ser-close').bind("click", function () {
        $("#" + gridMetaData.GRID_ID + ' .ser-expand').removeClass('hide');
        $("#" + gridMetaData.GRID_ID + ' .ser-tab').removeClass('expanded');
        $("#" + gridMetaData.GRID_ID + ' .recent-search').removeClass('auto-suggest');
    });
    
    // Change from Comfort View to Compact View of Table
    $("#" + gridMetaData.GRID_ID + ' #view-tab li.compact').unbind("click");
    $("#" + gridMetaData.GRID_ID + ' #view-tab li.compact').bind("click", function () {
        $(this).toggleClass('active');
        $("#" + gridMetaData.GRID_ID ).closest( ".ev-grid-container" ).toggleClass('compact');
    });
    
    // Form
    // dropdown self execution
    $('.grid-container .dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of
								// the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'right' // Displays dropdown with edge aligned to the left
							// of button
    });

    if (gridMetaData.IS_SEARCHABLE) {
        var debounceFn = debounce(Grid.bindSearchEvents, 1000, false, gridMetaData);
        $("#" + gridMetaData.GRID_ID + " #search-pro").unbind().on('keyup', function (e) {
            // var keyCode = e.keyCode || e.which;
            // Grid.bindSearchEvents();
            debounceFn();
        });
    }

    if (gridMetaData.IS_SORTABLE) {
        var status = Grid.bindSortEvents(gridMetaData,dataArray,tabName);
    }

    if (gridMetaData.IS_PAGINATION) {
        Grid.bindPaginationEvents(gridMetaData );
    }
    
    return true;
};

Grid.headChkChanged = function(event) {
	$(event.currentTarget).closest('table').find("tbody input:checkbox").prop('checked', $(this).prop("checked"));
	// Grid.setSelectedValues(event);
};

Grid.setSelectedValues = function(event) {
	Grid.selectedValues = [];
	var gridMetaData = event.data;
	var values = $("tbody input:checkbox[class='filled-in']:checked");
	var length = values.length;
	for(var counter = 0; counter < length; counter++) {
		Grid.selectedValues.push($(values[counter]).attr("index"));
	}
	
	Grid.data[gridMetaData.GRID_ID].SELECTED = Grid.selectedValues;
	Grid.selectedValues.length ? $("#view-tab li.combined").removeClass('no-click') : $("#view-tab li.combined").addClass('no-click');
};

Grid.bindSearchEvents = function bindSearchEvents(gridMetaData) {
    var dataList = [];
    var filter = {};
    var columns = gridMetaData.COLUMNS;
    filter.search = $("#" + gridMetaData.GRID_ID + " #search-pro").val();
    if (gridMetaData.REST_URL) {

    } else {
        dataList = Grid.data[gridMetaData.GRID_ID].DATA;
        if ($("#" + gridMetaData.GRID_ID + " [data-isSortable]").length) {
            var sortIndex = $("#" + gridMetaData.GRID_ID + " [data-isSortable]").attr("index");
            filter.sortField = columns[sortIndex].NAME;
            filter.sortDirection = $("#" + gridMetaData.GRID_ID + " [data-sortDirection]").attr("data-sortDirection").length ? 
            					   $("#" + gridMetaData.GRID_ID + " [data-sortDirection]").attr("data-sortDirection") : 1;
        }
        filter.page = 1;
        Grid.filterRecords(gridMetaData, dataList, filter);
    }
};

Grid.bindSortEvents = function bindSortEvents(gridMetaData, dataArray, tab_name)
{
    var columns = gridMetaData.COLUMNS;
    var filter = {};
    $("#" +  gridMetaData.GRID_ID + " [data-isSortable = 'true'] i").unbind("click");
    $("#" +  gridMetaData.GRID_ID + " [data-isSortable = 'true'] i").bind("click", function () {
    	try{
    		$("#preloader").show();
    		var sortIndex =  parseInt($(this).closest('th').attr("index"));
    	        
	        
	        filter.sortField = columns[sortIndex].NAME;
	        filter.sortType = columns[sortIndex].TYPE;
	        filter.sortDirection = $("#" + gridMetaData.GRID_ID + " [data-sortDirection]").length ? $("#" + gridMetaData.GRID_ID + " [data-sortDirection]").attr("data-sortDirection") : 1;

	        $("#" + gridMetaData.GRID_ID + " [data-sortDirection]").removeAttr("data-sortDirection");
	        filter.sortDirection = filter.sortDirection * -1;
	        $(this).attr("data-sortDirection", filter.sortDirection);
	        
	        $("#" + gridMetaData.GRID_ID + " [data-isSortable = 'true']").find(".sort-asc").removeClass("hide");
	        $("#" + gridMetaData.GRID_ID + " [data-isSortable = 'true']").find(".sort-desc").removeClass("hide");
	        var sortClass = filter.sortDirection == -1 ? "sort-desc" : "sort-asc";
	        $(this).closest('th').find(".sort-desc").addClass("hide");
	        $(this).closest('th').find(".sort-asc").addClass("hide");
	        $(this).closest('th').find("." + sortClass).removeClass("hide");
	        
	        $("#" +  gridMetaData.GRID_ID).attr("filter", JSON.stringify(filter));            
	        
	        $.each($("#"+ gridMetaData.GRID_ID+" th").not('.dividerColumn'),function(th_key,th_val){
	        	if($(th_val).attr('data-columnname')== filter.sortField ){
	        		sortIndex = th_key;
	        	}
	        	return;
	        });
	       $($("#"+ gridMetaData.GRID_ID+" th")[1]).attr("data-columnname")
	       
	       setTimeout(function() {
	    	   	// sortTable(sortIndex, gridMetaData.GRID_ID , sortClass);
	    	   if (sortClass == "sort-desc"){
	    		   if(filter.sortType=="float"){
	    			   dataArray.sort( ( a, b ) => b[filter.sortField]||0 - a[filter.sortField]||0 ) 
	    		   }else{
	    			   dataArray = dataArray.sort( ( a, b ) => b[filter.sortField]||"".localeCompare( a[filter.sortField]||"" ) )   
	    		   }
	    		   
	    	   }
	    	   else{
	    		   if(filter.sortType=="float"){
	    			   dataArray.sort( ( a, b ) => a[filter.sortField]||0 - b[filter.sortField]||0 ) 
	    		   }else{
	    			   dataArray = dataArray.sort( ( a, b ) => a[filter.sortField]||"".localeCompare( b[filter.sortField]||"" ) )  
	    		   }
	    	   }
	    	   Grid.showData(gridMetaData, dataArray, tab_name); 
				$("#preloader").hide()
			}, 100);
    	}
    	catch(err){
    		$("#preloader").hide();
    		console.error(err)
    	} 
    });
    return true
};




Grid.makeColumnResizable = function( gridMetaData )
{
	var dragPadding = 2; 
	var dividerColumnHTML = "<th class='th dividerColumn' style='width:0px;height:32px;padding:" + 1 + "px;margin:0px " + ( dragPadding - 1 ) + "px;border-right: 1px solid #aaa;border-left: 1px solid #aaa;'></th>";
	
	// console.log( $("#" + gridMetaData.GRID_ID + " .headerColumnRow th" ) );

	$("#" + gridMetaData.GRID_ID + " .headerColumnRow th" ).filter( ":visible" ).not(":first").not(":last").each( function(){
		$( this ).width( $( this ).width() - ( dragPadding * 2 + 2 ) );
		$( this ).addClass( "nohover" );
	});
	
 	$( dividerColumnHTML ).insertAfter( $("#" + gridMetaData.GRID_ID + " .headerColumnRow th" ).filter( ":visible" ).not(":first").not(":last") );
	
 	$("#" + gridMetaData.GRID_ID + " .headerColumnRow th.dividerColumn" ).css( "cursor", "e-resize" );
 	
    /*
	 * $("#" + gridMetaData.GRID_ID + " .headerColumnRow
	 * th:not(.dividerColumn)").filter(":hidden").each( function(){ console.log( $(
	 * this ) ); $( this ).next( ".dividerColumn" ).hide(); });
	 */

    // return false;
    
	var pressed = false;
    var $columnSelector = undefined;
    var startX, startWidth, totalGridWidth;
    
    var $gridContainer = $( "#" + gridMetaData.GRID_ID );

    
    $gridContainer.find(".headerColumnRow .th.dividerColumn").mousedown(function(e) {
    	var columnName = $(this).prev().attr( "data-columnName" ); 
    	$columnSelector = $gridContainer.find( "[data-columnname='" + columnName + "']" );
        pressed = true;
        startX = e.pageX;
        startWidth = parseInt( $(this).prev().css( "width" ) );
        totalGridWidth = $gridContainer.width();
        $columnSelector.addClass("resizing");
    });
    
    $(document).mousemove(function(e) {
        if(pressed) {
        	var differentialWidth =  e.pageX - startX; 
        	$columnSelector.each( function(){
        		$(this).not( ".th" ).css( "width", ( startWidth + differentialWidth + 6 ) + "px" );
        		$(this).filter( ".th" ).css( "width", ( startWidth + differentialWidth ) + "px" );
        	});
        	// $columnSelector.width( startWidth + differentialWidth );
            $gridContainer.width( totalGridWidth  + differentialWidth );
            // console.log( "reached ", startWidth + differentialWidth,
			// totalGridWidth + differentialWidth );
        }
    });
    
    $(document).mouseup(function(e) {
        if(pressed) {
        	$columnSelector.removeClass("resizing");
        	// $columnSelector.width( startWidth );
            // $gridContainer.width( totalGridWidth );
        	var differentialWidth =  e.pageX - startX; 
        	$columnSelector.each( function(){
        		// $(this).css( "width", ( startWidth + differentialWidth ) +
				// "px" );
        		$(this).not( ".th" ).css( "width", ( startWidth + differentialWidth + 6 ) + "px" );
        		$(this).filter( ".th" ).css( "width", ( startWidth + differentialWidth ) + "px" );
        	});
            // console.log( "up finally ", startWidth + differentialWidth ,
			// totalGridWidth + differentialWidth );
            pressed = false;
        	// console.log( $columnSelector );
        	var columnName = $columnSelector.attr( "data-columnName" );
        	gridMetaData.COLUMNS = gridMetaData.COLUMNS.map( function( columnObj ){
        		if ( columnObj.NAME == columnName )
        		{
        			columnObj.WIDTH = startWidth + differentialWidth;
        		}
        		return columnObj;
        	});
        }
    });
};



Grid.filterRows = function filterRows(grid_id,ev){
	var value = $(ev).find('input.search_field').val().toUpperCase();
	var data_columnname = $(ev).attr('data-columnname');
    $("#"+grid_id+" tbody tr").each(function(index) {
            $row = $(this);
            var row_val = $row.find('td[data-columnname="'+data_columnname+'"]').text().toUpperCase();          
            if (row_val.indexOf(value)==-1) {
                $row.hide();
            }
            else {
            	// if($row.is(':visible'))
                $row.show();               
            }
    });
}