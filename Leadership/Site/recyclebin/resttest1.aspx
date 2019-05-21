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
</head>

<body>
<div>{{ctrl.userInfo.fullName}}</div>

<script>


$.ajax({  
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('testlist')/items",  
    type: "GET",  
    headers: {  
        "accept": "application/json;odata=verbose",  
       "content-Type": "application/json;odata=verbose"  
    },  
    success: function(data) {  
        console.log(data.d.results);  
    },  
    error: function(error) {  
        alert(JSON.stringify(error));  
    }  
});  
</script>
      </body>
      </html>