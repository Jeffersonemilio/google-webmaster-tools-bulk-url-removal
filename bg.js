var executionInProgress = false;
var removalMethod = null;
var victimUrlArray = null;
var initUrl = null;

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    if (msg.type === 'initVictims') {
      executionInProgress = true;
      victimUrlArray = msg.rawTxt.replace(/^\s+|\s+$/g, '').split('\n');
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
        }
      } else {
        console.log("no victim to be executed."); //xxx
      }
    } else if (msg.type === 'reload') {
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


//chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//if (executionInProgress) {
//chrome.tabs.getSelected(null,function(tab){
//myURL=tab.url;
//console.log(myURL); //xxx
//});
////if (changeInfo.url.match(//)) {

////}
//console.log("should be clicking on some button to close the deal");

//}
//});
