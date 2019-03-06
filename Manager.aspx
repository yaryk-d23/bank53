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
    
	<script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
	<script src="/_layouts/1033/init.js"></script>
    <script src="/_layouts/1033/core.js"></script>
    <script src="/_layouts/15/SP.Core.js"></script>
    <script src="/_layouts/15/SP.Runtime.js"></script>
    <script src="/_layouts/15/SP.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.5/bluebird.min.js"></script>
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
                "modules/angular/angular-sanitize.min.js",
                // "modules/angular/textAngular.min.js",
                "modules/bootstrap/js/ui-bootstrap-tpls-2.5.0.min.js",
                "modules/angular/angular-validation.min.js",
                "modules/angular/angular-validation-rule.min.js",
                "modules/moment.min.js",
                "Manager/manager-app.js",
            ];
            var styles = [
                "modules/bootstrap/css/bootstrap.css",
                "Manager/manager-app.css",
            ];
            for(var i=0;i<scripts.length;i++){
                document.write('<script language="javascript" type="text/javascript" src="'+ STATIC_PATH + "/" + scripts[i] + "?rnd" + Math.random() +'"><\/script>')
            }
            for(var i=0;i<styles.length;i++){
                document.write('<link href="'+ STATIC_PATH + "/" + styles[i] + "?rnd" + Math.random() +'" rel="stylesheet">')
            }
        </script>
        
        <div class="app-container b" ng-app="ManagerApp" ng-controller="AppCtrl as ctrl" id="manager">
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
                        <!-- <li class="active"><a href="https://thebank.info53.com/teams/HCInt/Learn/Gamification/SiteAssets/app/Leaderboard.aspx">Leaderboard</a></li> -->
                    </ul>
                </div>
            </nav>
            <h2>Manager Page</h2>
            <div class="row">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-3">
                            <div class="form">
                                <div class="form-group">
                                    <label>Select user</label>
                                    <input type="text" class="form-control"
                                        autocomplete="off"
                                        id="SelectedUser"
                                        name="SelectedUser"
                                        ng-model="ctrl.selectedUser"
                                        maxlength="255"
                                        validator="requiredUser"
                                        valid-method="watch"
                                        use-view-value="false"
                    
                                        uib-typeahead="user as user.User.Title for user in ctrl.getUser($viewValue)"
                                        typeahead-min-length="2"
                                        typeahead-loading="loadingLocations.SelectedUser"
                                        typeahead-no-results="noResults.SelectedUser"
                                        ng-class="{loading: loadingLocations.SelectedUser}"
                                        message-id="errorMessage-SelectedUser"
                                    >
                                    <div ng-show="noResults.SelectedUser && SelectedUser">
                                        <i class="glyphicon glyphicon-remove"></i> No Results Found
                                    </div>
                                    <div id="errorMessage-SelectedUser"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div class="row" ng-if="ctrl.userInfo.userName">
                        <div class="col-sm-12 col-md-12 col-lg-12">
                            <div class="profile-header-container user-info">   
                                <div class="profile-header-img text-center">
                                    <!-- <img class="img-circle user-icon" ng-src="/_layouts/15/userphoto.aspx?size=L&username={{ctrl.userInfo.userName}}" /> -->
                                    <div class="img-circle user-icon" style="background-image: url('/_layouts/15/userphoto.aspx?size=L&username={{ctrl.userInfo.userName}}')"></div>
                                    <span class="rank-label-container">
                                        <div class="credits-info">{{ctrl.userInfo.xp}} XP</div>
                                        <div class="full-name-info">{{ctrl.userInfo.fullName}}</div>
                                        <span class="position-info">{{ctrl.userInfo.position}}</span>
                                        <span ng-if="ctrl.userInfo.position && ctrl.userInfo.department">&nbsp;|&nbsp;</span>
                                        <span class="department-info">{{ctrl.userInfo.department}}</span>
                                    </span>
                                </div>
                                <div class="text-center">
                                    <h4>Avatar</h4>
                                    <div class="profile-header-container avatar">   
                                        <div class="profile-header-img text-center">
                                            <img class="img-circle user-icon" ng-src="{{ctrl.userInfo.avatar.Url}}" />
                                            <!-- <span class="rank-label-container">
                                                <div class="full-name-info">{{ctrl.userInfo.avatarItem.Title}}</div>
                                            </span> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div class="row" ng-if="ctrl.userInfo.userName">
                        <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                            <h4 class="text-center">Recent Activity</h4>
                            <div ng-repeat="item in ctrl.recentTasks track by $index" class="col-sm-12 col-md-12 col-lg-4">
                                <div ng-if="item['odata.type'] == 'SP.Data.BadgesTaskLogListItem'" class="recent-container">
                                    <div class="user-image">
                                        <img class="img-circle" ng-src="/_layouts/15/userphoto.aspx?size=S&username={{item.AssignedTo.EMail}}" />
                                        <div>&nbsp;{{item.AssignedTo.Title}}</div>
                                    </div>
                                    <div>
                                        <div>{{item.Badge.Title}}: {{item.Title}}</div>
                                        <div>{{ctrl.moment(item.Created).format('MM/DD/YYYY h:mm a')}}</div>
                                    </div>
                                </div>
                                <div ng-if="item['odata.type'] == 'SP.Data.BadgesListListItem'" class="recent-container">
                                    <div class="user-image">
                                        <img class="img-circle" ng-src="/_layouts/15/userphoto.aspx?size=S&username={{item.TaskLog.AssignedTo.EMail}}" />
                                        <div>&nbsp;{{item.TaskLog.AssignedTo.Title}}</div>
                                    </div>
                                    <div>
                                        <img class="img-circle" ng-src="{{item.Icon.Url}}" />
                                        <div>
                                            <div>{{item.Title}}</div>
                                            <div>{{ctrl.moment(item.TaskLog.Created).format('MM/DD/YYYY h:mm a')}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div class="row" ng-if="ctrl.userInfo.userName">
                        <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                            <h4 class="text-center">Tasks Map</h4>
                            <div class="tasks-map">
                                <div ng-repeat="row in ctrl.groupedTasks track by $index"
                                    ng-init="parentIdx = $index"
                                    class="tasks-map-row" ng-class="{'reverse': $index%2!=0}">
                                    <div class="map-item text-center bg-color-{{$index}}" 
                                        ng-repeat="item in row track by $index"
                                        ng-style="{'background-color': ctrl.colorArr[$index]}"
                                        ng-init="isHover = false"
                                        ng-mouseenter="isHover = true"
                                        ng-mouseleave="isHover = false"
                                        ng-class="{
                                            'not-completed': (!isHover && !ctrl.checkTask(item.Title, item.BadgeId)),
                                            'first-map-item': (parentIdx==0 && $index==0),
                                            'end-bottom': (parentIdx%2==0 && $index==4),
                                            'end-top': (parentIdx%2!=0 && $index==0),
                                            'start-bottom': ((parentIdx%2!=0 && $index==4)),
                                            'start-top': (parentIdx!=0 && parentIdx%2==0 && $index==0),
                                            'last-map-item': (parentIdx==ctrl.groupedTasks.length-1 && $index==row.length-1)
                                        }"
                                    >
                                        <!-- <span class="glyphicon glyphicon-star" 
                                            ng-if="ctrl.checkTask(item.Title, item.BadgeId)">
                                        </span> -->
                                        <img 
                                            class="avatar-image" 
                                            ng-src="{{ctrl.userInfo.avatar.Url}}"
                                            ng-if="ctrl.checkTask(item.Title, item.BadgeId) && ctrl.getLastCompletedTask() == item.Id"
                                        >
                                        <div class="snackbar">{{item.Badge.Title}}: {{item.Title}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </body>
</html>
