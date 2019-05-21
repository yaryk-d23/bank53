<!DOCTYPE html>
<html lang="en" >

<head>
  <meta charset="UTF-8">
  <title>Bootstrap Modal Example</title>
  
  
  <link rel='stylesheet' href='https://thebank.info53.com/teams/HCInt/Learn/leading/SiteAssets/Site/modules/bootstrap.min.css'>

      <link rel="stylesheet" href="https://thebank.info53.com/teams/HCInt/Learn/leading/SiteAssets/Site/modules/style.css">

  
</head>

<body>

  <div class="wrap">
  <h1>Bootstrap Modal Example</h1>
  <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg">
    Large modal
  </button>
</div>
 
<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  
  <div class="modal-dialog modal-lg">
    
    <!-- Modal Content: begins -->
    <div class="modal-content">
      
      <!-- Modal Header -->
      <div class="modal-header no-borders">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="gridSystemModalLabel"></h4>
      </div>
    
      <!-- Modal Body -->  
      <div class="modal-body">
        <p class="body-message centered"><strong>The email campaign has been successfully sent.</strong></p>
      </div>
    
      <!-- Modal Footer -->
      <div class="modal-footer no-borders">
        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    
    </div>
    <!-- Modal Content: ends -->
    
  </div>
  
</div>

<!---------------------->
<div class="wrap">
  <h1>Bootstrap Modal Example</h1>
  <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg-new">
    Large modal
  </button>
</div>
 
<div class="modal fade bs-example-modal-lg-new" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  
  <div class="modal-dialog modal-lg">
    
    <!-- Modal Content: begins -->
    <div class="modal-content">
      
      <!-- Modal Header -->
      <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="gridSystemModalLabel">Your Headings</h4>
      </div>
    
      <!-- Modal Body -->  
      <div class="modal-body">
        <div class="body-message">
          <h4>Any Heading</h4>
          <p>And a paragraph with a full sentence or something else...</p>
        </div>
      </div>
    
      <!-- Modal Footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    
    </div>
    <!-- Modal Content: ends -->
    
  </div>
  
</div>
  <script src='https://thebank.info53.com/teams/HCInt/Learn/leading/SiteAssets/Site/modules/jquery.min.js'></script>
<script src='https://thebank.info53.com/teams/HCInt/Learn/leading/SiteAssets/Site/modules/bootstrap.min.js'></script>

  

</body>

</html>
