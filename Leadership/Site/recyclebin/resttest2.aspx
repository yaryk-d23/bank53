<!--
<%@ Page language="C#" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
-->




<!DOCTYPE html>
<html>

<head>
 
   <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=3, user-scalable=yes, width=device-width">
    <title></title>

    <!--CSS Links here-->
	
	<!-- Sharepoint Dependencies -->
	<!--<script src="/_layouts/1033/init.js"></script>
    <script src="/_layouts/1033/core.js"></script>
    <script src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
    <script src="/_layouts/SP.Core.js"></script>
    <script src="/_layouts/SP.Runtime.js"></script>
    <script src="/_layouts/SP.js"></script>
    <script src="/_layouts/SP.UI.Dialog.js"></script>
    <script src="/_layouts/ScriptResx.ashx?culture=en%2Dus&name=SP%2ERes"></script>

    <!--JS Links here-->
    
	<script type="text/javascript" src="//thebank.info53.com///ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
	<script src="/_layouts/1033/init.js"></script>
    <script src="/_layouts/1033/core.js"></script>
    <script src="/_layouts/15/SP.Core.js"></script>
    <script src="/_layouts/15/SP.Runtime.js"></script>
    <script src="/_layouts/15/SP.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.5.3/bluebird.min.js"></script>

  




<title></title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>

/* * {
  box-sizing: border-box;
}*/


body {
  font-family: Arial, Helvetica, sans-serif;
heght: 100%;
padding: 0px;
margin: 0px;
}

/* Style the header */


/* Create two columns/boxes that floats next to each other */
nav {
  float: left;
  width: 30%;
  
  background: #ccc;
  padding: 20px;
}

/* Style the list inside the menu */
nav ul {
 
  padding: 0;
}

article {
  float: left;
  padding: 20px;
  width: 70%;
  background-color: #f1f1f1;
  
}

/* Clear floats after the columns */
  section:after {
  content: "";
  display: table;
  clear: both;
}

/* Style the footer */
footer {
clear: both;
    margin-top: 80px;
    padding: 1.2em 0;
    background: #000;
    bottom: 0;
/*<link rel="stylesheet" type="text/css" href="https://thebank.info53.com/teams/HCInt/Learn/leading/SiteAssets/Site/components/footer2.css">*/
}

/* Responsive layout - makes the two columns/boxes stack on top of each other instead of next to each other, on small screens 
@media (max-width: 600px) {
  nav, article {
    width: 100%;
    height: auto;
  }
}*/



</style>

<script>
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
};
</script><div w3-include-html="components/header2.html"></div>


<script src="https://thebank.info53.com/teams/HCInt/Learn/leading/SiteAssets/Site/modules/angular.min.js"></script>
    
<script src="https://thebank.info53.com/teams/HCInt/Learn/leading/SiteAssets/Site/modules/jquery-3.3.1.min.js"></script>
    
<script>
function retriveListItem()  
{  
  
    $.ajax  
    ({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('testlist')/items?$select=Title,kind",  
        type: type,  
        data: data,  
        headers:  
        {  
            "Accept": "application/json;odata=verbose",  
            "Content-Type": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "IF-MATCH": "*",  
            "X-HTTP-Method": null  
        },  
        cache: false,  
        success: function(data)   
        {  
            $("#ResultDiv").empty();  
            for (var i = 0; i < data.d.results.length; i++)   
            {  
                var item = data.d.results[i];  
                $("#ResultDiv").append(item.Title + "\t" + item.kind + "<br/>");  
            }  
        },  
        error: function(data)  
        {  
            $("#ResultDiv").empty().text(data.responseJSON.error);  
		alert(jqxhr.responseText);
        }  
    });  
}  
</script>


</head>


<body>
<div w3-include-html="components/drawer.html"></div>

 
<ResultDiv></ResultDiv>


<h1> WHAT IS UP?,</h1>

<script>
retriveListItem();
</script>


</body>


<footer>
  <div w3-include-html="components/footer2.html"></div>
</footer>



<script>
includeHTML();
</script>

</html>
