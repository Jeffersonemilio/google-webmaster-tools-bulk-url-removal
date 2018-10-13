$(document).ready(function(){
  var $fileInput = $("<input id='fileInput' type='file' />");
  var $dropdown = $("<select id='removalmethod'><option value='PAGE' selected>Remove page from search results and cache</option><option value='PAGE_CACHE'>Remove page from cache only</option><option value='DIRECTORY'>Remove directory</option></select>");
  $("#create-removal_button").append($dropdown);
  $("#create-removal_button").append($fileInput);

  var port = chrome.runtime.connect({name: "victimPort"});

  port.onMessage.addListener(function(msg) {
    if(msg.type === 'removeUrl') {
      var victim = msg.victim;
      console.log("about to remove: " + victim);
      // delete
      $("input[name='urlt']").attr('value', victim);
      $("input[name='urlt.submitButton']").trigger("click");

    } else if (msg.type === 'triggerQuota') {
      // for testing only
      // python -m SimpleHTTPServer 8000
      window.location.href="http://localhost:8000/test.html";
    }
  });


  $fileInput.change(function() {
    $.each(this.files, function(i, f) {
      var reader = new FileReader();
      reader.onload = (function(e) {
        var rawTxt = e.target.result.replace(/\r/g, "\n");
        var victimArry = rawTxt.split('\n');
        var removalMethod = $('#removalmethod').val();
        port.postMessage({
          'type': 'initVictims',
          'removalMethod': removalMethod,
          'rawTxt': rawTxt,
          'initUrl': window.location.href
        });
      });
      reader.readAsText(f);
    });
  });

  setTimeout(() => {
    port.postMessage({
      'type': 'nextVictim'
    });
  }, 1000);
});
