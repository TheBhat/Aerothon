
function AppData(){}

// for row color refer : https://www.materialpalette.com/colors

AppData.DashboardRefreshTime = 15000
AppData.gridConfig = {
    "notificationDataGrid" : {
        CAPTION: "",
        GRID_ID: "notification-data-grid",
        IS_SORTABLE: true,
        SORT_COLUMN :"last_updated_time",
        IS_SEARCHABLE: true,
        ELLIPSIS_TEXT : true,
        COLUMN_DRAG : false,
        SHOW_DATA : 'DashBoard.showData',
        TR_BACKGROUND_COLOR:{
        	"FAILED":"#ef9a9a",
        	"IN_QUEUE":"#fff59d",
        	"IN_PROGRESS":"#80deea",
        	"STARTED":"#bbdefb",
        	"FINISHED":"#fff"
        },
        COLUMNS: [
            { NAME: "SELECT", CAPTION: "", WIDTH: "60", ALIGN: "left", SORT_BY:"", TYPE: "checkbox"},
        	{ NAME: "header1", CAPTION: "header 1", WIDTH: "250", ALIGN: "left", SORT_BY:"input_files", TYPE: "string"},
            { NAME: "header2", CAPTION: "header 2", WIDTH: "250", ALIGN: "left", SORT_BY:"reference_files", TYPE: "string"},
            { NAME: "header3", CAPTION: "header 3", WIDTH: "120", ALIGN: "left", SORT_BY:"group_id",TYPE: "string"},
            { NAME: "header4", CAPTION: "header 4", WIDTH: "150", ALIGN: "left", SORT_BY:"datasources",TYPE: "string"},
            { NAME: "header5", CAPTION: "header 5", WIDTH: "150", ALIGN: "left", SORT_BY:"workflow_id",TYPE: "string"},
            { NAME: "header6", CAPTION: "header 6", WIDTH: "200", ALIGN: "left", SORT_BY:"workflow_name",TYPE: "string"},
            { NAME: "header7", CAPTION: "header 7", WIDTH: "80", ALIGN: "left", SORT_BY:"log_level",TYPE: "string"},
            { NAME: "header8", CAPTION: "header 8",	WIDTH: "200", ALIGN: "left", SORT_BY:"queued_time",TYPE: "string"},
            { NAME: "timestamp", CAPTION: "TIMESTAMP",	WIDTH: "200", ALIGN: "left", SORT_BY:"processing_start_time",TYPE: "string"}
        ],
        SHOW_SLIDE_ACTIONS : false
    }
};
