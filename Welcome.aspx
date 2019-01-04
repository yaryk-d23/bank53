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
    <script src="//thebank.info53.com///ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
    <script src="/_layouts/SP.Core.js"></script>
    <script src="/_layouts/SP.Runtime.js"></script>
    <script src="/_layouts/SP.js"></script>
    <script src="/_layouts/SP.UI.Dialog.js"></script>
    <script src="/_layouts/ScriptResx.ashx?culture=en%2Dus&name=SP%2ERes"></script>

    <!--JS Links here-->
    
	<script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
	<script src="/_layouts/1033/init.js"></script>
    <script src="/_layouts/1033/core.js"></script>
    <script src="/_layouts/15/SP.Core.js"></script>
    <script src="/_layouts/15/SP.Runtime.js"></script>
    <script src="/_layouts/15/SP.js"></script>
  </head>

  <body >
	<!-- required: SharePoint FormDigest -->
	<form runat="server">
	<SharePoint:FormDigest runat="server"></SharePoint:FormDigest>
	</form>

        <script>
    var STATIC_PATH = _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/app";
    var scripts = [
        "modules/jquery-3.3.1.min.js",
        "modules/angular.min.js",
        "modules/bootstrap/js/bootstrap.min.js",

        "Badges/badges-app.js",
        "Badges/services/badges-service.js",
        "Badges/components/badge-info/badge-info.js",
    ];
    var styles = [
        "modules/bootstrap/css/bootstrap.css",
        "Badges/components/badge-info/badge-info.css",
    ];
    for(var i=0;i<scripts.length;i++){
        document.write('<script language="javascript" type="text/javascript" src="'+ STATIC_PATH + "/" + scripts[i] + "?rnd" + Math.random() +'"><\/script>')
    }
    for(var i=0;i<styles.length;i++){
        document.write('<link href="'+ STATIC_PATH + "/" + styles[i] + "?rnd" + Math.random() +'" rel="stylesheet">')
    }
</script>
<div class="app-container b" ng-app="BadgesApp" ng-controller="AppCtrl" id="badges">
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="collapse navbar-collapse" id="">
                <ul class="nav navbar-nav">
                    <li><a href="https://thebank.info53.com/teams/HCInt/Learn/Gamification/SiteAssets/app/Dashboard.aspx">My Dashboard</a></li>
                    <li class="active"><a href="https://thebank.info53.com/teams/HCInt/Learn/Gamification/SiteAssets/app/Badges.aspx">Trainings</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <h3>Trainings</h3>
    <div class="">
        <div class="">
            <badge-info></badge-info>
        </div>
    </div>
</div>
  </body>
</html>
