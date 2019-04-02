angular.module('BadgesApp')
    .factory('$GeneratePDF', function ($http, $q, $BadgesService) {
        return {
            generatePDF: generatePDF
        };

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
        
        function generatePDF($event, task, logo) {
            var logo = logo || angular.element($event.currentTarget.parentElement.parentElement).find('img')[0];
            var doc = new jsPDF('p', 'pt', 'a4');
            doc.setFontStyle('normal');

            var img = new Image();
            img.src = getBase64Image(logo);

            doc.addImage(img, 'PNG', 250, 20);
            var drawHeaderRow= function (row, data) {
                doc.setTextColor(68, 68, 68);
                doc.setFillColor(255, 255, 255);
            }
            var table = [];
            table.push({title:task.Description, dataKey: "title"});
            var customHeader = {
                cellPadding: 0,
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
            doc.textWithLink(task.Title, 300, 300, {url: location.origin + location.pathname + '?task='+('TSK-'+(task.Id*task.Id*53))});
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

        function getStyle(startY,haveHeader,drawHeaderRow, drawCell, drawRow, customHeader){
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
             else if(customHeader){
                result.headerStyles = customHeader;
            }
            return result;
        
        };
    });