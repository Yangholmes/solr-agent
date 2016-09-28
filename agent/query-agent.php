<?php

/**
 * Solr query Agent
 */
// require http request class
require_once('yang-class-http-request.php');

//get POST
$keyword = $_POST['keyword'];
$start = $_POST['start'];
$rows = $_POST['rows'];

/**
 * Apache Solr HTTP Interface 
 */
// server info
$solr_url = "http://localhost:8983/solr";
$collection = "/gettingstarted";
$request_handler = "/select?";

// query info
$wt = "wt=json"; // only provide json data
// deal with keywords
if($keyword==null || $keyword == ''){ // query all
	$keyword = "*:*";
}
if($start==null || $start == ''){ // page 0
	$start = 0;
}
if($rows==null || $rows == ''){ // 20 rows par page
	$rows = 20;
}

// pre-treat query condition
$keyword = "q=".rawurlencode($keyword); // Escape Chinese to url
$start = "start=".$start; 
$rows = "rows=".$rows;
$query = "$wt&$keyword&$start&$rows"; // jion the url

$url = $solr_url.$collection.$request_handler.$query;

// instantiate yang_HTTP_request class
$request = new yang_HTTP_request("$url"); // 
$request->set_header([]);
$raw_response = $request->request('GET'); // $raw_response is json string

$obj = json_decode($raw_response);
$raw_docs = $obj->response->docs; // []
$start = $obj->response->start; // number
$numFound = $obj->response->numFound; // number

$docs = [];
for($i=0;$i<count($raw_docs);$i++){
	@ $id = $raw_docs[$i]->id;
	@ $type = $raw_docs[$i]->stream_content_type[0];
	@ $title = $raw_docs[$i]->title;
	
	$id = str_replace('#', '%23', $id);
	$filename = substr( $id, strrpos($id, "\\")+1 );
	$filelink = preg_replace('/C:\\\\share\\\\01.知识库平台/', 'http://192.168.3.116:81', $id); // replace IP address, escape filename
	
	$docs[$i] = [
					 "filename"=>$filename,
					 "filelink"=>$filelink,
					 "type"=>$type, 
					 "title"=>$title, 
					 ];
}
$response = [ 
			 "docs"=>$docs, 
			 "start"=>$start, 
			 "numFound"=>$numFound,
			 ];
echo json_encode($response);