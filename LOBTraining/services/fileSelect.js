(function(){
    angular.module('App')
    .directive('selectFiles', [ '$parse', '$ApiService', function ($parse, $ApiService) {
        return {
          restrict: 'EAC',
          scope: {
            $files: "=model"
          },
          template: '<div class="select-file-container">'+
                        '<span class="glyphicon glyphicon-paperclip" style="cursor:pointer;"></span>'+
                        '<input type="file"  style="display:none;">'+
                    '</div>',
        //   transclude: true,
          link: function postLink(scope, iElm, iAttrs) {
            var $file = $(iElm.find('input')),
                $button = iElm.find('span');
            if(iAttrs.multiple==""){
                $file.attr('multiple','multiple');
            }
            $file.bind('change', function () {
                var $tmpFiles = [];
                for (var i = 0; i < this.files.length; i++) {
                    $tmpFiles.push({
                        $file: this.files[i],
                        base64: ''
                    });
                }
                scope.$files = $tmpFiles;
                scope.$apply();
            //   $parse(iAttrs.selectFile).assign(scope,this.files);
            });
            
            $button.bind('click', function () {
              $file.click();
            });
          }
        };
      }]);
})();