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

        "Leaderboard/leaderboard-app.js",
        "Leaderboard/services/leaderboard-service.js",
        "Leaderboard/components/leaderboard-table/leaderboard-table.js",
    ];
    var styles = [
        "modules/bootstrap/css/bootstrap.css",
        "Leaderboard/leaderboard-app.css",
        "Leaderboard/components/leaderboard-table/leaderboard-table.css",
    ];
    for(var i=0;i<scripts.length;i++){
        document.write('<script language="javascript" type="text/javascript" src="'+ STATIC_PATH + "/" + scripts[i] + "?rnd" + Math.random() +'"><\/script>')
    }
    for(var i=0;i<styles.length;i++){
        document.write('<link href="'+ STATIC_PATH + "/" + styles[i] + "?rnd" + Math.random() +'" rel="stylesheet">')
    }
</script>

<div class="app-container b" ng-app="LeaderboardApp" ng-controller="AppCtrl" id="leaderboard">
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
				<li><a href="Welcome.aspx">Home</a></li>
				<li><a href="Dashboard.aspx">My Dashboard</a></li>
				<li><a href="Badges.aspx">Trainings</a></li>
				<!-- <li class="active"><a href="Leaderboard.aspx">Leaderboard</a></li> -->
			</ul>
		</div>
    </nav>
    <h2>Leaderboard</h2>
    <div class="row">
        <div class="container">
            <leaderboard-table></leaderboard-table>
        </div>
    </div>
  </body>
</html>
