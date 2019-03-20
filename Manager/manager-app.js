(function(){
    angular.module('ManagerApp', [
        'ui.bootstrap',
        'ngSanitize',
        // 'textAngular',
        'validation',
        'validation.rule',
        'PopUpMsg'
    ])

    .controller('AppCtrl', ['$ManagerService', '$scope', '$q', '$sce', function($ManagerService, $scope, $q, $sce) {
        var ctrl = this;
        ctrl.update = 0;
        ctrl.currentUser = {};
        ctrl.userInfo = {};
        ctrl.selectedUser = null;
        ctrl.getUser = $ManagerService.getUser;
        ctrl.allTasks = [];
        ctrl.allTasksLog = [];
        ctrl.groupedTasks = [];
        var recentTasks = [];
        ctrl.recentTasks = [];
        ctrl.allManagerBadges = [];
        var allBadges = [];
        ctrl.userAssignedBadges = [];
        ctrl.moment = moment;
        ctrl.allManagerUsers = [];
        ctrl.colorArr = ['#5cb85c', '#07b16a', '#33cddd', '#245698', '#79569c'];


        // $ManagerService.getTaskItems().then(function(res) {
        //     ctrl.allTasks = res;
        //     ctrl.groupedTasks = createChunksFromArra(ctrl.allTasks, 5);
        // });

        $scope.$watch('ctrl.update', function(){
            if(ctrl.update != 0){
                ctrl.getData();
            }
        }, true);

        var currentUserReq = {
            getUserProfile: $ManagerService.getUserProfile(),
            allManagerUsers: $ManagerService.getUserLogItems("$filter=ManagerId eq " + _spPageContextInfo.userId),
        };

        //get current user info
        $q.all(currentUserReq).then(function(res){
            ctrl.allManagerUsers = res.allManagerUsers;
            angular.forEach(res.getUserProfile.UserProfileProperties, function(prop, key){
                if(prop.Key == "PictureURL"){
                    ctrl.currentUser.pictureUrl = prop.Value;
                }
                if(prop.Key == "UserName"){
                    ctrl.currentUser.userName = prop.Value;
                }
                if(prop.Key == "Department"){
                    ctrl.currentUser.department = prop.Value || '';
                }
                if(prop.Key == "Title"){
                    ctrl.currentUser.position = prop.Value || '';
                }
            });
            ctrl.currentUser.fullName = res.getUserProfile.DisplayName;
            $ManagerService.getUserLogItem(ctrl.currentUser.userName).then(function(res){
                if(res.length) {
                    var user = res[0];
                    ctrl.currentUser.credits = user.Credits || 0;
                    ctrl.currentUser.xp = user.XP || 0;
                    ctrl.currentUser.userItemId = user.Id;
                    ctrl.currentUser.avatar = user.Avatar;
                    ctrl.currentUser.avatarItem = user.AvatarItem;
                    ctrl.currentUser.userRole = user.UserRole;
                    ctrl.currentUser.usesId = _spPageContextInfo.userId;
                }
            });
        });

        $scope.$watch('ctrl.selectedUser',function(){
            ctrl.getData();
        }, true);
        ctrl.getData = function(){
            if(ctrl.selectedUser == null || typeof ctrl.selectedUser != 'object') return;
            var requests = {
                allManagerBadges: $ManagerService.getBadgesItems("$filter=BadgeType eq 'Manager'"),
                allBadges: $ManagerService.getBadgesItems(),
                taskLogItems: $ManagerService.getTaskLogItems('$filter=AssignedToId eq '+ctrl.selectedUser.User.Id),
                userProfile: $ManagerService.getUserProfile(encodeURIComponent(ctrl.selectedUser.User.Name)),
                allTasks: $ManagerService.getTaskItems(),
                recentTasks: $ManagerService.getTaskLogItems('$top=20&$orderby=Created desc&$select=*,Badge/Id,Badge/Title,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Id,Author/Id,Author/Title&$expand=Badge,AssignedTo,Author&$filter=AssignedToId eq '+ctrl.selectedUser.User.Id),
            };
            $q.all(requests).then(function(data){
                ctrl.allManagerBadges = data.allManagerBadges;
                allBadges = data.allBadges;
                ctrl.allTasksLog = data.taskLogItems;
                ctrl.allTasks = data.allTasks;

                //set user info
                angular.forEach(data.userProfile.UserProfileProperties, function(prop, key){
                    if(prop.Key == "PictureURL"){
                        ctrl.userInfo.pictureUrl = prop.Value;
                    }
                    if(prop.Key == "UserName"){
                        ctrl.userInfo.userName = prop.Value;
                    }
                    if(prop.Key == "Department"){
                        ctrl.userInfo.department = prop.Value || '';
                    }
                    if(prop.Key == "Title"){
                        ctrl.userInfo.position = prop.Value || '';
                    }
                });
                ctrl.userInfo.fullName = data.userProfile.DisplayName;
                $ManagerService.getUserLogItem(ctrl.userInfo.userName).then(function(res){
                    var user = res[0];
                    ctrl.userInfo.userId = user.User.Id;
                    ctrl.userInfo.credits = user.Credits || 0;
                    ctrl.userInfo.xp = user.XP || 0;
                    ctrl.userInfo.userItemId = user.Id;
                    ctrl.userInfo.avatar = user.Avatar;
                    ctrl.userInfo.avatarItem = user.AvatarItem;
                    ctrl.userInfo.avatarItem = user.AvatarItem;
                });

                //get selected user badges(icon)
                var grupedTaskByBadge = groupBy(ctrl.allTasksLog, 'BadgeId');
                var grupedTasksItemsByBadge = groupBy(ctrl.allTasks, 'BadgeId');
                ctrl.userAssignedBadges = [];
                angular.forEach(allBadges, function(badge, key){
                    if(grupedTaskByBadge[badge.Id] && grupedTaskByBadge[badge.Id].length == grupedTasksItemsByBadge[badge.Id].length){
                        ctrl.userAssignedBadges.push(badge);
                    }
                });
                setTimeout(function(){
                    $('[data-toggle="tooltip"]').tooltip();   
                },500);

                //get recent activity
                var groupedTasksByBadge = groupBy(ctrl.allTasks, 'BadgeId');
                recentTasks = data.recentTasks;
                var recentActRequests = {};
                for(var i=0;i<recentTasks.length;i++){
                    recentActRequests[i] = $ManagerService.getTaskLogItems('$filter=BadgeId eq '+recentTasks[i].BadgeId+'&$select=*,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Id&$expand=AssignedTo');
                }
                ctrl.recentTasks = [];
                $q.all(recentActRequests).then(function(res){
                    angular.forEach(res, function(req, key){
                        if(ctrl.recentTasks.length < 3){
                            if(getSumOfXP(req) == getSumOfXP(groupedTasksByBadge[recentTasks[key].BadgeId])){
                                var badge = allBadges.filter(function(x){
                                    return x.Id == recentTasks[key].BadgeId;
                                })[0];
                                badge['TaskLog'] = recentTasks[key];
                                if(!checkIfItemExist(badge)){
                                    ctrl.recentTasks.push(badge);
                                }
                            }
                            else {
                                ctrl.recentTasks.push(recentTasks[key]); 
                            }
                        }
                    });
                });
            });
        };

        ctrl.clearSelectedUser = function(){
            ctrl.selectedUser = null;
            ctrl.userInfo = {};
        };

        ctrl.getBadgeXP = function(tasks){
            var xp = 0;
            if(tasks && tasks.length)  {
                angular.forEach(tasks, function(item, k){
                    xp += item.XP;
                });
            }
            return xp;
        };
    
        ctrl.checkTask = function(taskName, badgeId){
            var flag = false;
            angular.forEach(ctrl.allTasksLog,function(task, key){
                if(task.Title == taskName && task.BadgeId == badgeId){
                    flag = true;
                }
            });
            return flag;
        }
        
        ctrl.trustHtml = function(html) {
            return $sce.trustAsHtml(html);
        };

        ctrl.createTaskItem = function(task){
        
            var item = {
                Title: task.Title,
                Badge: task.BadgeId,
                AssignedTo: ctrl.selectedUser.User.Id,
                XP: task.XP,
                Task: task.Id
            };
            $ManagerService.createTaskItem(item).then(function(res){
                var userItem = {
                    Id: ctrl.userInfo.userItemId,
                    XP: ctrl.userInfo.xp + task.XP
                };
                $ManagerService.updateUserLogItem(userItem).then(function(res){
                    ctrl.getData();
                    ctrl.showToast(task);
                }); 
            });
        };

        ctrl.showToast = function(task) {
            var x = document.getElementById('task-toast');
            x.innerText = "+" + task.XP + " XP";
            x.className = "show snackbar";
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        };
        // ctrl.getData = function(){
        //     if(ctrl.selectedUser == null || typeof ctrl.selectedUser != 'object') return;
        //     var requests = {
        //         allBadges: $ManagerService.getBadgesItems(),
        //         allTasks: $ManagerService.getTaskItems(),
        //         allTasksLog: $ManagerService.getTaskLogItems('$filter=AssignedToId eq '+ctrl.selectedUser.User.Id),
        //         userProfile: $ManagerService.getUserProfile(encodeURIComponent(ctrl.selectedUser.User.Name)),
        //         recentTasks: $ManagerService.getTaskLogItems('$top=20&$orderby=Created desc&$select=*,Badge/Id,Badge/Title,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Id&$expand=Badge,AssignedTo'),
        //     };
        //     $q.all(requests).then(function(data){
        //         allBadges = data.allBadges;
        //         ctrl.allTasks = data.allTasks;
                
        //         ctrl.groupedTasks = createChunksFromArra(ctrl.allTasks, 5);
        //         ctrl.allTasksLog = data.allTasksLog;
                
    
        //         angular.forEach(data.userProfile.UserProfileProperties, function(prop, key){
        //             if(prop.Key == "PictureURL"){
        //                 ctrl.userInfo.pictureUrl = prop.Value;
        //             }
        //             if(prop.Key == "UserName"){
        //                 ctrl.userInfo.userName = prop.Value;
        //             }
        //             if(prop.Key == "Department"){
        //                 ctrl.userInfo.department = prop.Value || '';
        //             }
        //             if(prop.Key == "Title"){
        //                 ctrl.userInfo.position = prop.Value || '';
        //             }
        //         });
        //         ctrl.userInfo.fullName = data.userProfile.DisplayName;
        //         $ManagerService.getUserLogItem(ctrl.userInfo.userName).then(function(res){
        //             var user = res[0];
        //             ctrl.userInfo.credits = user.Credits || 0;
        //             ctrl.userInfo.xp = user.XP || 0;
        //             ctrl.userInfo.userItemId = user.Id;
        //             ctrl.userInfo.avatar = user.Avatar;
        //             ctrl.userInfo.avatarItem = user.AvatarItem;
        //         });
        //         var groupedTasksByBadge = groupBy(ctrl.allTasks, 'BadgeId');
        //         recentTasks = data.recentTasks;
        //         var recentActRequests = {};
        //         for(var i=0;i<recentTasks.length;i++){
        //             recentActRequests[i] = $ManagerService.getTaskLogItems('$filter=BadgeId eq '+recentTasks[i].BadgeId+'&$select=*,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Id&$expand=AssignedTo');
        //         }
                
        //         $q.all(recentActRequests).then(function(res){
        //             angular.forEach(res, function(req, key){
        //                 if(ctrl.recentTasks.length < 3){
        //                     if(getSumOfXP(req) == getSumOfXP(groupedTasksByBadge[recentTasks[key].BadgeId])){
        //                         var badge = allBadges.filter(function(x){
        //                             return x.Id == recentTasks[key].BadgeId;
        //                         })[0];
        //                         badge['TaskLog'] = recentTasks[key];
        //                         if(!checkIfItemExist(badge)){
        //                             ctrl.recentTasks.push(badge);
        //                         }
        //                     }
        //                     else {
        //                         ctrl.recentTasks.push(recentTasks[key]); 
        //                     }
        //                 }
        //             });
        //         });
        //     });

        // }

        

        function checkIfItemExist(badge){
            var isExist = false;
            angular.forEach(ctrl.recentTasks, function(item, key){
                if((item['odata.type'] == "SP.Data.BadgesListListItem" || item['odata.type'] == "SP.Data.BadgesListItem") && 
                    item.Id == badge.Id && 
                    badge['TaskLog'].AssignedToId ==  item['TaskLog'].AssignedToId){
                        isExist = true;
                    }
            });
            return isExist;
        }

        function getSumOfXP(arr){
            var sum = 0;
            arr = arr || [];
            angular.forEach(arr, function(item, key){
                sum += item.XP;
            });
            return sum;
        }

        ctrl.generatePdf = function($event, task) {
            if(task.LinkedSource){
                window.open(task.LinkedSource.Url, '_blank');
                return;
            }
            else {
                $ManagerService.getBadgeIcon(task.BadgeId).then(function(icon){
                    var myImage = new Image();
                    myImage.src = icon.Url;
                    myImage.onload = function(){
                        $GeneratePDF.generatePDF($event, task, myImage);
                    };
                });
            }

        };
        // ctrl.getLastCompletedTask = function(){
        //     var taskId = 0;
        //     angular.forEach(ctrl.allTasks, function(task, key){
        //         if(ctrl.checkTask(task.Title, task.BadgeId)){
        //             taskId = task.Id;
        //         }
        //     });
        //     return taskId;
        // };

        // ctrl.checkTask = function(taskName, badgeId){
        //     var flag = false;
        //     angular.forEach(ctrl.allTasksLog,function(task, key){
        //         if(task.Title == taskName && task.BadgeId == badgeId){
        //             flag = true;
        //         }
        //     });
        //     return flag;
        // };

        function createChunksFromArra(array, chankLength){
            var temparray = [];
            var i,j;
            for (i=0,j=array.length; i<j; i+=chankLength) {
                temparray.push(array.slice(i,i+chankLength));
            }
            return temparray;
        }

        function groupBy(xs, prop) {
            return xs.reduce(function(rv, x) {
            (rv[x[prop]] = rv[x[prop]] || []).push(x);
            return rv;
            }, {});
        }
    }])
    .factory('$ManagerService', ['$http', '$q' , function ($http, $q) {
        return {
            getUserProfile: getUserProfile,
            getUserLogItem: getUserLogItem,
            getUserLogItems: getUserLogItems,
            createUserLogItem: createUserLogItem,
            getBadgesItems: getBadgesItems,
            createTaskItem: createOrUpdateTaskItem,
            updateTaskItem: createOrUpdateTaskItem,
            updateUserLogItem: updateUserLogItem,
            getTaskLogItems: getTaskLogItems,
            getTaskItems: getTaskItems,
            getBadgeIcon: getBadgeIcon,
            getAvatarsItems: getAvatarsItems,
            getUser: getUser
        };
        function getUser(query, managerId){
            var url = _spPageContextInfo.webAbsoluteUrl +
                '/_api/web/lists/getbytitle(\'UsersLog\')/items?'+
                '$select=*,User/Title,User/Id,User/EMail,User/UserName,User/Name,AvatarItem/Id,AvatarItem/Title&$expand=User,AvatarItem'+
                "&$top=20"+
                "&$filter=("+[
                    "substringof('" + query + "',User/Title)",
                    "substringof('" + query + "',User/EMail)",
                    "substringof('" + capitalizeFirstLetter(query) + "',User/Title)",
                    "substringof('" + capitalizeFirstLetter(query) + "',User/EMail)"
                ].join(" or ")+") and ManagerId eq "+managerId;
            return $http({
                method: 'GET',
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose"
                },
                url: url                    
            }).then(function (res) {
                return res.data.d.results;
            });
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        function getUserProfile(accountName){
            if(accountName) {
                var url = _spPageContextInfo.webAbsoluteUrl + '/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=\''+accountName+'\'';
            }
            else {
                var url = _spPageContextInfo.webAbsoluteUrl + '/_api/SP.UserProfiles.PeopleManager/GetMyProperties';
            }

            return $http.get(url)
                .then(function(res){
                    return res.data;
                });
        }

        function getUserLogItem(userName){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'UsersLog\')/items?'
                +'$select=*,User/Title,User/Id,User/EMail,User/UserName,AvatarItem/Id,AvatarItem/Title&$expand=User,AvatarItem&$filter=User/UserName eq \'' + userName +'\'')
                .then(function(res){
                    return res.data.value;
                });
        }

        function getUserLogItems(filter){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'UsersLog\')/items?'
                +'$select=*,User/Title,User/Id,User/EMail,User/UserName,AvatarItem/Id,AvatarItem/Title&$expand=User,AvatarItem&'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        function getAvatarsItems(filter){
            filter = filter ? filter : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'Avatars\')/items?'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        function createUserLogItem(data){
            return $http({
                method: "POST",
                url: _spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'UsersLog\')/items?$select=*',
                data: data,
                headers: {
                    "Content-Type" : "application/json;odata=verbose",
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val() 
                 }
                }).then(function(res){
                    return res.data.d;
                });
        }

        function getBadgesItems(filter){
            filter = filter ? filter : '';
            return new Promise(function(resolve, reject){
                $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'BadgesList\')/items?'+filter)
                    .then(function(res){
                        var request = {};
                        angular.forEach(res.data.value, function(item, k){
                            request[item.Id] = $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'Tasks\')/items?'+
                                '$select=*,Badge/Id,Badge/Title&$expand=Badge'+
                                '&$filter=Badge/Id eq '+item.Id);
                        });
                        $q.all(request).then(function(tasksRes){
                            angular.forEach(res.data.value, function(item, k){
                                item['Tasks'] = tasksRes[item.Id].data.value;
                            });
                            resolve(res.data.value);
                        });
                        //return res.data.value;
                    });
            });
        }

        function getTaskLogItems(filter){
            filter = filter ? filter : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'BadgesTaskLog\')/items?'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        function getTaskItems(filter){
            filter = filter ? filter : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'Tasks\')/items?$select=*,Badge/Id,Badge/Title&$expand=Badge&'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        function getBadgeIcon(badgeId){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'BadgesList\')/items('+badgeId+')')
                .then(function(res){
                    return res.data.Icon;
                });
        }

        
        function createOrUpdateTaskItem(item){
            return new Promise(function(resolve, reject){
                // var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
                var clientContext = new SP.ClientContext.get_current();

                var oList = clientContext.get_web().get_lists().getByTitle("BadgesTaskLog");
                    
                var itemCreateInfo = new SP.ListItemCreationInformation();
                if(item.Id)
                    var oListItem = oList.getItemById(item.Id);
                else
                    var oListItem = oList.addItem(itemCreateInfo);

                for(var key in item){
                    if(key!='Id' && key!='Badge' && key!='AssignedTo'){
                        oListItem.set_item(key,item[key]);
                    }
                    else if(key=='Badge'){
                        var lookupVal = new SP.FieldLookupValue();
                        lookupVal.set_lookupId(item[key]);
                        oListItem.set_item(key,lookupVal);
                    }
                    else if(key=='AssignedTo'){
                        var lookupVal = new SP.FieldLookupValue();
                        lookupVal.set_lookupId(item[key]);
                        oListItem.set_item(key,lookupVal);
                    }
                }
                oListItem.update();

                clientContext.load(oListItem);
                function thisSuccess(){
                    resolve(oListItem);
                }
                function thisFailed(request, error){
                    console.log(error);
                }
                clientContext.executeQueryAsync(thisSuccess, thisFailed);
            });
        }

        function updateUserLogItem(item){
            return new Promise(function(resolve, reject){
                var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
                var oList = clientContext.get_web().get_lists().getByTitle("UsersLog");
                var oListItem = oList.getItemById(item.Id);
                oListItem.set_item('XP',item.XP);
                oListItem.update();

                clientContext.load(oListItem);
                function thisSuccess(){
                    resolve(oListItem);
                }
                function thisFailed(request, error){
                    console.log(error);
                }
                clientContext.executeQueryAsync(thisSuccess, thisFailed);
            });
        }
    }])
    .config(['$provide', '$validationProvider',function($provide, $validationProvider) {
        $validationProvider.showSuccessMessage = false;
        $validationProvider
            .setExpression({
                null: function (value, scope, element, attrs) {
                    return true;
                },
                UserOrNull: function (value, scope, element, attrs) {
                    return !value || typeof value.Id === typeof 1;
                },
                requiredUser: function (value, scope, element, attrs) {
                    return value && typeof value.Id === typeof 1;
                }
            })
            .setDefaultMsg({
                null: {
                    error: '',
                    success: ''
                },
                UserOrNull: {
                    error: 'Please select or remove user',
                    success: ''
                },
                requiredUser: {
                    error: 'Please select user',
                    success: ''
                }
            });
    }]);
})();