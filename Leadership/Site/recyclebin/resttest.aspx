<!--
<%@ Page language="C#" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
-->

<!DOCTYPE html>

<html>
<head>
<SCRIPT type=text/javascript src="../jquery-3.3.1.min.js"></SCRIPT>

<script type=”text/javascript” src=../”https:/thebank.info53.com/teams/HCInt/Learn/leading/Style Library/jquery.min.js”> </script>
<script type=”text/javascript” src=../”https:/thebank.info53.com/teams/HCInt/Learn/leading/Style Library/jquery.SPServices.min.js”> </script>
</head>

<body>


<script type=”text/javascript”>
 $(document).ready(function() {
 var SOStatusreports=[]
 $().SPServices({
 operation: “GetListItems”,
async: false,
 listName: “Your-List-Name”,
CAMLViewFields: “<ViewFields><FieldRef Name=’Title’ /><FieldRef Name=’Attachments’ /><FieldRef Name=’Modified’ /><FieldRef Name=’Link’ /></ViewFields>”,
CAMLQueryOptions: “<QueryOptions><IncludeAttachmentUrls>True</IncludeAttachmentUrls></QueryOptions>”,
completefunc: function (xData, Status) {
 $(xData.responseXML).SPFilterNode(“z:row”).each(function(index) {

SOStatusreports.push($(this).attr(“ows_Attachments”).replace(‘;#’,”))
var trimurl= SOStatusreports[index];
 itmurl = trimurl.replace(‘;#’,”)
var liHtml = “<li><a href='”+itmurl+”‘>” +$(this).attr(“ows_Title”) + “</a></li>”;
 $(“#MyListItems”).append(liHtml);
 });
 }
 });
 });
 </script>

<ul id=”MyListItems”> </ul>

      </body>
      </html>