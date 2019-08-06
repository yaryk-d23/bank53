<!--
<%@ Page language="C#" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
-->

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Leading at Fifth Third</title>

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
        
        <script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
        <script src="/_layouts/1033/init.js"></script>
        <script src="/_layouts/1033/core.js"></script>
        <script src="/_layouts/15/SP.Core.js"></script>
        <script src="/_layouts/15/SP.Runtime.js"></script>
        <script src="/_layouts/15/SP.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.5.3/bluebird.min.js"></script>
        
    </head>

    <body>
        <!-- required: SharePoint FormDigest -->
	    <form runat="server">
            <SharePoint:FormDigest runat="server"></SharePoint:FormDigest>
        </form>
        <script>
            var STATIC_PATH = _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/app/RetailLearning";
            var scripts = [
                "modules/jquery-3.3.1.min.js",
                "modules/angular/angular.min.js",
                "modules/angular/angular-route.min.js",
                "modules/angular/angular-sanitize.min.js",
                "modules/bootstrap/js/bootstrap.min.js",
                "modules/bootstrap/js/ui-bootstrap-tpls-2.5.0.min.js",

                "app.js",
                "services/api-service.js",
                "components/site-header/siteHeader.js",
                "components/retail-roles/retailRoles.js",
                "components/retail-topics/retailTopics.js",
                "components/site-footer/siteFooter.js",
                "components/retail-learning/retailLearning.js",
                "components/images/images.js",
            ];
            var styles = [
                "modules/bootstrap/css/bootstrap.css",
                "app-style.css",
                "components/site-header/siteHeader-style.css",
                "components/retail-roles/retailRoles-style.css",
                // "components/retail-topics/retailTopics-style.css",
                // "components/site-footer/siteFooter-style.css",
                // "components/retail-learning/retailLearning-style.css",
                "components/images/images-style.css",
            ];
            for(var i=0;i<scripts.length;i++){
                document.write('<script language="javascript" type="text/javascript" src="'+ STATIC_PATH + "/" + scripts[i] + "?rnd" + Math.random() +'"><\/script>')
            }
            for(var i=0;i<styles.length;i++){
                document.write('<link href="'+ STATIC_PATH + "/" + styles[i] + "?rnd" + Math.random() +'" rel="stylesheet">')
            }
        </script>
        <div class="app-container b" ng-app="App" ng-controller="AppCtrl as ctrl">
            <div class="container-fluid content-wrap">
                <div class="row">
                    <site-header></site-header>
                    <images></images>
                </div>
            </div>
            <!-- <site-footer></site-footer> -->
        </div>
    </body>
</html>