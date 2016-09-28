/**
 * global variable
 */
var url = "agent/query-agent.php",
	query = '*:*',
	rows = 50;


$(function(){
    $('#result').w2grid({ 
    name   : 'queryResult', 
    // style: 'font-size: 1.5em',
    show : {
        toolbar: false,
        footer: true,
        lineNumbers: true,
    },
	
    columns: [
			{ field: 'type', caption: '格式', size: '10%', sortable: true },
			{ field: 'filename', caption: '文件名', size: '50%', sortable: true },
			{ field: 'title',caption: '标题',size:'30%' },
			{ field: 'filelink', caption: '位置', size: '10%', sortable: true, render: function(foo){ return '<a target="_blank" href="' + foo.filelink + '">' + '点此下载' + '</a>'; } },
	],
	// sortData: [
		// { field: 'bookname', direction: 'asc' },
		// { field: 'author', direction: 'asc' }
	// ],
   });
});

$('#query-btn').click(function(){
	query = $('#query').val() ? $('#query').val() : "*:*";
	
	sendQuery(0);
});

function queryWithStart(a){
	console.log(a);
	var index = a.innerHTML;
	query = $('#query').val() ? $('#query').val() : "*:*";
	
	sendQuery((index-1) * rows);
}

function sendQuery(start=0, rows=50){
	query = $('#query').val() ? $('#query').val() : "*:*";
	start = start<0 ? 0 : start;
	rows = rows<0 ? 50 : rows;
	
	$.ajax({
		method: "POST",
		dataType: 'json',
		url: url,
		data: {
			keyword: query,
			start: start,
			rows: 50,
		},
		success: function(msg){
			console.log(msg);
			var resultGrid = w2ui['queryResult'];
			if(msg){
				// update grid records
				var docs = msg.docs,
					start = msg.start/rows,
					numFound = msg.numFound;
					
				resultGrid.records = docs;
				resultGrid.refresh();
				//update #numFound
				start = start+1;
				$('#numFound').html('<p>共' +numFound + '条记录' + ' | ' + '第' + start +'页</p>');
				// update #start 
				$('#start').html('');
				for(var i=0;i<Math.ceil(numFound/rows);i++){
					var page = i+1;
					$('#start').append('<a onclick="queryWithStart(this)">' + page + '</a>');
				}
				
			}
		}
	})
}