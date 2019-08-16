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
	<script src="/_layouts/1033/init.js"></script>
    <script src="/_layouts/1033/core.js"></script>
    <script src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
    <script src="/_layouts/SP.Core.js"></script>
    <script src="/_layouts/SP.Runtime.js"></script>
    <script src="/_layouts/SP.js"></script>
    <script src="/_layouts/SP.UI.Dialog.js"></script>
    <script src="/_layouts/ScriptResx.ashx?culture=en%2Dus&name=SP%2ERes"></script>

    <link rel="stylesheet" href="/_layouts/15/1033/styles/Themable/corev15.css">

    <!--JS Links here-->
    
	
  </head>

  <body >
	<!-- required: SharePoint FormDigest -->
	<form runat="server">
    <SharePoint:FormDigest runat="server"></SharePoint:FormDigest>
    <div class="app-container b" ng-app="App" ng-controller="AppCtrl" id="app">
        <nav class="navbar navbar-default">
            <span 
                class="glyphicon glyphicon-align-justify navbar-toggle" 
                style="padding: 13px 10px;font-size: 20px;" 
                data-toggle="collapse" 
                data-target="#navbarSupportedContent" 
                aria-controls="navbarSupportedContent" 
                aria-expanded="false">
            </span>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="nav navbar-nav">
                    <li><a href="https://thebank.info53.com/teams/HCInt/Learn/Gamification/SiteAssets/app/Welcome.aspx">Home</a></li>
                    <li><a href="https://thebank.info53.com/teams/HCInt/Learn/Gamification/SiteAssets/app/Dashboard.aspx">My Dashboard</a></li>
                    <li><a href="https://thebank.info53.com/teams/HCInt/Learn/Gamification/SiteAssets/app/Badges.aspx">Trainings</a></li>
                </ul>
            </div>
        </nav>
        <div class="">
            <div class="col-sm-12">
                <div>
                    <admin-table></admin-table>
                    <br/>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
	</form>

<script>
    var STATIC_PATH = _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/app";
    var scripts = [
		"modules/jquery-3.3.1.min.js",
        "modules/angular.min.js",
        "modules/angular/angular-sanitize.min.js",
        "modules/bootstrap/js/bootstrap.min.js",
        "modules/bootstrap/js/ui-bootstrap-tpls-2.5.0.min.js",
        "modules/ui-select/select.js",

        "Admin/app.js",
        "Admin/services/admin-service.js",
        "Admin/components/admin-table/adminTable.js",
    ];
    var styles = [
        "modules/bootstrap/css/bootstrap.css",
        "modules/ui-select/select.css",
		"Admin/style.css",
        "Admin/components/admin-table/adminTable-style.css",
    ];
    for(var i=0;i<scripts.length;i++){
        document.write('<script language="javascript" type="text/javascript" src="'+ STATIC_PATH + "/" + scripts[i] + "?rnd" + Math.random() +'"><\/script>')
    }
    for(var i=0;i<styles.length;i++){
        document.write('<link href="'+ STATIC_PATH + "/" + styles[i] + "?rnd" + Math.random() +'" rel="stylesheet">')
    }
</script>

  </body>
</html>
