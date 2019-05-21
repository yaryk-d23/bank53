<style>
 #page-container {
  position: relative;
  min-height: 100vh;
}
#content-wrap {
  padding-bottom: 22.5rem;    /* Footer height */
}
body {
  font-family: Arial, Helvetica, sans-serif;
heght: 100%;
padding: 0px;
margin: 0px;
}
#footer {
   clear: both;
    margin-top: 80px;
    padding: 1.2em 0;
    background: #000;
    bottom: 0;
    margin-right: -33px;

}


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
</script>

<head>
<div w3-include-html="components/header.html"></div>
</head>


<body>
<div w3-include-html="components/drawer.html"></div>

<div w3-include-html="components/portalcards.html"></div>
</body>
<footer>
<div w3-include-html="components/footer2.html"></div>
</footer>

<script>
includeHTML();
</script>
            
        


