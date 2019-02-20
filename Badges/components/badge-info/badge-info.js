angular.module('BadgesApp')
    .component('badgeInfo', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Badges/components/badge-info/badge-info.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$BadgesService', '$sce', '$q', badgeInfoCtrl]
    });

function badgeInfoCtrl($BadgesService, $sce, $q){
    var ctrl = this;
    ctrl.userInfo = {};
    ctrl.allBadges = [];
    ctrl.allTask = [];
    

    var urlTaskId = getParameterByName('task');
    if(urlTaskId) {
        $BadgesService.getTaskLogItems('$filter=Task/Id eq '+urlTaskId).then(function(taskRes){
            if(!taskRes.length) {
                $BadgesService.getTaskItems('$filter=Id eq '+urlTaskId).then(function (res){
                    //ExecuteOrDelayUntilScriptLoaded(function(){
                        ctrl.createTaskItem(res[0]);
                    //}, "SP.js");
                });
            }
            else{
                window.history.pushState(null,null,'?');
            }
        });
    }

    updateData();
    function getBase64Image(img) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
    
        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
    
        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");
    
        //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        return dataURL;
    }
    ctrl.generatePdf = function($event, task) {
		if(task.LinkedSource){
			window.open(task.LinkedSource.Url, '_blank');
			return;
		}
		else {
			
		
        // var margins = {
        //     top: 0,
        //     bottom: 0,
        //     left: 0,
        //     width: 190
        // };
        var logo = angular.element($event.currentTarget.parentElement.parentElement).find('img')[0];
        var doc = new jsPDF('p', 'pt', 'a4');
        doc.setFontStyle('normal');

        //var logoData = getBase64Image(logo);
        var img = new Image();
		img.src = getBase64Image(logo);

        doc.addImage(img, 'PNG', 250, 20);
        //doc.text(10, 40, task.Description || '');
        var drawHeaderRow= function (row, data) {
            //data.cursor.y += 20;
            doc.setTextColor(68, 68, 68);
            doc.setFillColor(255, 255, 255);
        }
        var table = [];
        table.push({title:task.Description, dataKey: "title"});
        var customHeader = {
            cellPadding: 0,
            //rowHeight: 30,
            lineColor: [255, 255, 255],
            halign: 'left',
            valign: 'middle',
            overflow: 'linebreak',
            fontSize: 12,
            fontStyle: 'normal',
            fillColor:[255, 255, 255],
            textColor: [0, 0, 0]
         }
		var style = getStyle(60,true,drawHeaderRow, undefined, undefined, customHeader);
        doc.autoTable(table ,[] ,style);
        // doc.fromHTML(task.Description, 10, 40, { 
        //     'width': margins.width, 
        //     'elementHandlers': null
        // },

        // function (dispose) {
        //     // dispose: object with X, Y of the last line add to the PDF 
        //     //          this allow the insertion of new lines after html
        //     //pdf.save('Test.pdf');
        // }, margins);
        doc.textWithLink(task.Title, 300, 300, {url: location.origin + location.pathname + '?task='+task.Id});
        // doc.save(task.Title.split(' ').join('_')+'.pdf');
        // var blob = doc.output('blob'); 
        var data = doc.output();   
        var buffer = new ArrayBuffer(data.length);
        var array = new Uint8Array(buffer);

        for (var i = 0; i < data.length; i++) {
            array[i] = data.charCodeAt(i);
        }
        var blob = new Blob(
            [array],
            {type: 'application/pdf', encoding: 'raw'}
        );
        
        var reqData = {
            fileName: task.Title.split(' ').join('_')+'_'+task.Id+'_'+task.Badge.Id+'_'+_spPageContextInfo.userId+'.pdf', 
            arrayBuffer: blob
        };
        $BadgesService.uploadFile(reqData).then(function(res){
            
            var win = window.open(location.origin + res.ServerRelativeUrl, '_blank');
            win.focus();
        });
         
    }

    };

    ctrl.createTaskItem = function(task){
        
        var item = {
            Title: task.Title,
            Badge: task.BadgeId,
            AssignedTo: _spPageContextInfo.userId,
            XP: task.XP,
            Task: task.Id
        };
        $BadgesService.createTaskItem(item).then(function(res){
            var userItem = {
                Id: ctrl.userInfo.userItemId,
                XP: ctrl.userInfo.xp + task.XP
            };
            $BadgesService.updateUserLogItem(userItem).then(function(res){
                updateData();
                ctrl.showToast(task);
            }); 
        });
	}
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
        angular.forEach(ctrl.allTask,function(task, key){
            if(task.Title == taskName && task.BadgeId == badgeId){
                flag = true;
            }
        });
        return flag;
    }

    ctrl.showToast = function(task) {
        var x = document.getElementById('task-toast');
        x.innerText = "+" + task.XP + " XP";
        x.className = "show snackbar";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    function updateData(){
		try{
        var requestData = {
            taskLogItems: $BadgesService.getTaskLogItems(),
            userProfile: $BadgesService.getUserProfile(),
			allBadges: $BadgesService.getBadgesItems()
        };
		//alert('work');
        $q.all(requestData).then(function(res){
			//alert('work');
            ctrl.allTask = res.taskLogItems;
			ctrl.allBadges = res.allBadges;
            var data = res.userProfile;
            angular.forEach(data.UserProfileProperties, function(prop, key){
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
            ctrl.userInfo.fullName = data.DisplayName;
            $BadgesService.getUserLogItem(ctrl.userInfo.userName).then(function(data){
                if(data.length) {
                    var user = data[0];
                    ctrl.userInfo.credits = user.Credits || 0;
                    ctrl.userInfo.xp = user.XP || 0;
                    ctrl.userInfo.userItemId = user.Id;
                }
            });
        });
		}
		catch(e){
			alert(e);
		};
        // $BadgesService.getTaskLogItems().then(function(res){
        //     ctrl.allTask = res;
        //     $scope.$apply();
        // });
        // $BadgesService.getUserProfile().then(function(data){
        //     angular.forEach(data.UserProfileProperties, function(prop, key){
        //         if(prop.Key == "PictureURL"){
        //             ctrl.userInfo.pictureUrl = prop.Value;
        //         }
        //         if(prop.Key == "UserName"){
        //             ctrl.userInfo.userName = prop.Value;
        //         }
        //         if(prop.Key == "Department"){
        //             ctrl.userInfo.department = prop.Value || '';
        //         }
        //         if(prop.Key == "Title"){
        //             ctrl.userInfo.position = prop.Value || '';
        //         }
        //     });
        //     ctrl.userInfo.fullName = data.DisplayName;
        //     $BadgesService.getUserLogItem(ctrl.userInfo.userName).then(function(data){
        //         if(data.length) {
        //             var user = data[0];
        //             ctrl.userInfo.credits = user.Credits || 0;
        //             ctrl.userInfo.xp = user.XP || 0;
        //             ctrl.userInfo.userItemId = user.Id;
        //         }
        //     });
        // });
    }

    ctrl.trustHtml = function(html) {
        return $sce.trustAsHtml(html);
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return parseInt(decodeURIComponent(results[2].replace(/\+/g, " ")), 10);
      }
      var getStyle= function(startY,haveHeader,drawHeaderRow, drawCell, drawRow, customHeader){
        var result ={
            margin: {
                        top: 40,
                        left: 40,
                        right: 40,
                        bottom: 40
                    },
            bodyStyles: {
                        textColor: [103, 103, 103],
                        lineColor:[199,217,229],
                        cellPadding: 10,
                        //rowHeight: 30,
                     },
            alternateRowStyles: { 
                        fillColor: [238, 240, 246],
                        lineWidth: 1,
                        lineColor:[199,217,229],
                      },
            styles: {
                        fontSize: 10,
                        valign: 'top',
                        lineWidth: 1,
                        lineColor:[199,217,229],
                        overflow: 'linebreak'
                     },
            pageBreak: 'avoid',
            startY:startY + 30,
            columnStyles: {
                Title: {columnWidth: 150},
                Time: {columnWidth: 100},
                Solicitation: {columnWidth: 100},
                Status: {columnWidth: 120}
            }
            
        }
        if(drawHeaderRow)
            result.drawHeaderRow=drawHeaderRow; 
        if(drawCell)
            result.drawCell = drawCell;
        if(drawRow)
            result.drawRow = drawRow;
        if(haveHeader && !customHeader)
            result.headerStyles= {
                    cellPadding: 8,
                    //rowHeight: 30,
                    lineColor: [199,217,229],
                    halign: 'left',
                    valign: 'middle',
                    overflow: 'visible',
                    fontSize: 12,
                    fontStyle: 'normal',
                    fillColor:[222, 242, 255],
                    textColor: [68,68,68]
                 }
         else if(customHeader)
             result.headerStyles = customHeader;
         //else
        //    result.headerStyles={rowHeight:0};
        
        return result;
    
    };
}