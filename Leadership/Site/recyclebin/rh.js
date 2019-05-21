<script src="https://thebank.info53.com/teams/HCInt/Learn/leading/SiteAssets/Site/modules/angular.min.js"></script>
    
<script src="https://thebank.info53.com/teams/HCInt/Learn/leading/SiteAssets/Site/modules/jquery-3.3.1.min.js"></script>
    




<script>

var myAngApp = angular.module('SPAngApp' , []);
myAngApp.controller('SPLinkController', function ($scope, $http) {
	$http({method: 'GET',url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('testlist')/items? $select= Title, kind", headers: { "Accept": "application/json;odata=verbose" }
		}) .success(function (data, status, headers, config) {
			$scope.links = data.d.results;
		}) .error(function (data, status, headers, config) {

		});
	});



</script>

function retriveListItem()  
{  
  
    $.ajax  
    ({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('companyInfo')/items?$select=Title,kind",  
        type: type,  
        data: data,  
        headers:  
        {  
            "Accept": "application/json;odata=verbose",  
            "Content-Type": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "IF-MATCH": "*",  
            "X-HTTP-Method": null  
        },  
        cache: false,  
        success: function(data)   
        {  
            $("#ResultDiv").empty();  
            for (var i = 0; i < data.d.results.length; i++)   
            {  
                var item = data.d.results[i];  
                $("#ResultDiv").append(item.Title + "\t" + item.kind + "<br/>");  
            }  
        },  
        error: function(data)  
        {  
            $("#ResultDiv").empty().text(data.responseJSON.error);  
        }  
    });  
}  