var executionInProgress = false;
var removalMethod = null;
var victimUrlArray = null;
var initUrl = null;

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    if (msg.type === 'initVictims') {
      executionInProgress = true;
      victimUrlArray = msg.rawTxt.replace(/^\s+|\s+$/g, '').split('\n');
      victimUrlArray = victimUrlArray.filter(v => v.length > 0);
      removalMethod = msg.removalMethod;
      initUrl = msg.initUrl;
      console.log ("initUrl: " + initUrl);

      var victimUrl = victimUrlArray[0];
      port.postMessage({
        'type' : 'removeUrl',
        'victim': victimUrl,
        'removalMethod': removalMethod
      });
    } else if (msg.type === 'nextVictim') {

      // find the next victim
      if (executionInProgress) {
        victimUrlArray.shift();
        var victimUrl = victimUrlArray[0];

        if (victimUrl !== undefined) {
          port.postMessage({
            'type' : 'removeUrl',
            'victim': victimUrl,
            'removalMethod': removalMethod
          });
        } else {
          executionInProgress = false; //done
          removalMethod = null;
          victimUrlArray = null;

          // Artifically trigger a quota exceed event to test
          // port.postMessage({ //xxx
          //   'type' : 'triggerQuota'
          // });
        }
      } else {
        console.log("no victim to be executed.");
      }
    } else if (msg.type === 'reload') {
      console.log("reloading initUrl: " + initUrl);
      port.postMessage({
        'type' : 'doReload',
        'url' : initUrl
      });
    } else if (msg.type == 'askState') {
      port.postMessage({
        'type' : 'state',
        'executionInProgress' : executionInProgress,
        'removalMethod' : removalMethod
      });
    }
  });
});
