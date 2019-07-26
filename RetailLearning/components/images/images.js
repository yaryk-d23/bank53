(function(){
    angular.module('App')
    .component('images', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/RetailLearning/components/images/images-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', '$routeParams', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope, $routeParams){
        var ctrl = this;
        ctrl.allRetailTopics = [
            {
                Image: {
                    Url: 'https://s16815.pcdn.co/wp-content/uploads/2017/07/iStock-679437550-FF170728.jpg',
                },
                Title: 'Discuss1',
                Id: 1
            },{
                Image: {
                    Url: 'http://www.interview-skills.co.uk/blog/wp-content/uploads/2015/07/How-to-stand-out-group-tasks-discussions-1024x835.jpg',
                },
                Title: 'Discuss2',
                Id: 2
            },{
                Image: {
                    Url: 'http://himachal.nic.in/images/discussion-forum.jpg',
                },
                Title: 'Discuss3',
                Id: 3
            },{
                Image: {
                    Url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK4nHHYy5nyCnX__ltLPGA8QTPX4CV97oM3sjUkdOvfNl-AGqXsw',
                },
                Title: 'Discuss4',
                Id: 4
            },{
                Image: {
                    Url: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201904/people-2557399_1920.jpeg?vRenYxoGCjPYALoGt4Hz6Mll8FmG2dQm',
                },
                Title: 'Discuss5',
                Id: 5
            },{
                Image: {
                    Url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUhvNj3DH4xUQcCC8jIsw7Iu-MDjtUUB5mM1Dgide-X-JwgUmJ',
                },
                Title: 'Discuss6',
                Id: 6
            },
        ];
        
        //ctrl.allRetailTopics = createChunksFromArray(ctrl.allRetailTopics, 3);
        console.log(ctrl.allRetailTopics);
        function createChunksFromArray(array, chankLength){
            var temparray = [];
            var i,j;
            for (i=0,j=array.length; i<j; i+=chankLength) {
                temparray.push(array.slice(i,i+chankLength));
            }
            angular.forEach(temparray, function(value,k){
                if(value.length < chankLength){
                    var emptyLength = chankLength-value.length;
                    for(var i=0;i<emptyLength;i++){
                        value.push({isEmpty: true});
                    }
                }
            });
            return temparray;
        }

        function groupBy(xs, prop) {
            return xs.reduce(function(rv, x) {
              (rv[x[prop]] = rv[x[prop]] || []).push(x);
              return rv;
            }, {});
        }
    }
})();