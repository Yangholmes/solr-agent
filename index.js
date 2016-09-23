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
	var url = "agent/query-agent.php",
		query = $('#query').val() ? $('#query').val() : "*:*";
	
	$.ajax({
		method: "POST",
		dataType: 'json',
		url: url,
		data: {
			keyword: query,
			start: 0,
			rows: 50,
		},
		success: function(msg){
			console.log(msg);
			var resultGrid = w2ui['queryResult'];
			if(msg){
				var docs = msg.docs;
				resultGrid.records = docs;
				resultGrid.refresh();
			}
		}
	})/*.done(function( msg ) {
		// console.log(msg);
		if(msg.response){
			var docs = msg.response.docs,
				resultGrid = w2ui['queryResult'],
				records = [],
				record = {};
			for(var i=0;i<docs.length;i++){
				record.recid = i;
				// record.title = docs[i].title;
				record.location = docs[i].id;
				records[i] = record;
			}
			resultGrid.records = records;
			resultGrid.refresh();
		}
	})*/;
});