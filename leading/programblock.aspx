<!DOCTYPE html>
<html lang="en">
<head>
<title>PBA Program Block</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>

/* * {
  box-sizing: border-box;
}*/


body {
  font-family: Arial, Helvetica, sans-serif;
heght: 100%;
padding: 0px;
margin: 0px;
}

/* Style the header */


/* Create two columns/boxes that floats next to each other */
nav {
  float: left;
  width: 30%;
  
  background: #ccc;
  padding: 20px;
}

/* Style the list inside the menu */
nav ul {
   list-style-type: none;
  padding: 0;
}

article {
  float: left;
  padding: 20px;
  width: 70%;
  background-color: #f1f1f1;
  
}

/* Clear floats after the columns */
  section:after {
  content: "";
  display: table;
  clear: both;
}

/* Style the footer */
footer {
clear: both;
    margin-top: 80px;
    padding: 1.2em 0;
    background: #000;
    bottom: 0;
/*<link rel="stylesheet" type="text/css" href="https://thebank.info53.com/teams/HCInt/Learn/leading/SiteAssets/Site/components/footer2.css">*/
}

/* Responsive layout - makes the two columns/boxes stack on top of each other instead of next to each other, on small screens 
@media (max-width: 600px) {
  nav, article {
    width: 100%;
    height: auto;
  }
}*/



</style>

<script>
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
};
</script><div w3-include-html="components/header2.html"></div>


</head>


<body>
<!<div w3-include-html="components/drawer.html"></div>
<div w3-include-html="modulesv3.html"></div>

</body>


<footer>
  <!<div w3-include-html="components/footer2.html"></div>
</footer>



<script>
includeHTML();
</script>

</html>
