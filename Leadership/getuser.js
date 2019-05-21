<script type="text/javascript">
_spBodyOnLoadFunctionNames.push("CallClientOM()");
        
function CallClientOM() {

document.getElementById("DivRequestorName").innerHTML="";
alert("ppp");
            var context = new SP.ClientContext.get_current();
            this.website = context.get_web();
            this.currentUser = website.get_currentUser();
            context.load(currentUser);
            context.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
        }

        function onQuerySucceeded(sender, args) {
document.getElementById("DivRequestorName").innerHTML =" ";
            document.getElementById("DivRequestorName").innerHTML = currentUser.get_loginName();
        }

        function onQueryFailed(sender, args) {        
           
            document.getElementById("DivRequestorName").innerHTML = " ";
        };


function getListItem(url, listname, id, complete, failure) {
    $.ajax({
        url: url + "/_api/web/lists/getbytitle('" + listname + "')/items(" + id + ")",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            complete(data);
        },
        error: function (data) {
            failure(data);
        }
        });
    }
}
</script>