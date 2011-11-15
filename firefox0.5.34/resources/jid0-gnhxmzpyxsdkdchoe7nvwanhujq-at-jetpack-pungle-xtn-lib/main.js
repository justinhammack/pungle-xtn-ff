/* 
*-----------------------------------------------------------------------------
* Description: Handles affiliate referrals transparently for user.
*-----------------------------------------------------------------------------
*/

// How to automatically update this plugin in the future?

// Initiates Extension onLoad
exports.main = function() {
  
  /*
  *-----------------------------------------------------------------------------
  * Global Variables & Environment
  *-----------------------------------------------------------------------------
  */
 
  // Load all Addon-Kit API's
  var pageMod = require("page-mod");
  var ss = require("simple-storage");
  var data = require("self").data;
  
  var panel = require("panel").Panel({
    contentURL: data.url("causes.html"),
    contentScriptFile: [data.url("jquery-min.js"), data.url("causes.js")]
  });
  
  require("widget").Widget({
    id: "pungleme",
    label: "Pungle.me - Social good for online shopping.",
    contentURL: "http://pungle.me/favicon.png",
    panel: panel
  });
  
  // Load Unique Libraries
  var stores = require("stores");
  var pFn = require("class");
  var pXtn = new pFn.pungleExtension();
  var includeStores = pFn.includeStores(stores.pungleJSON); // create wildcard domains
  
  // var pFn = require("functions");
  
  // var VERSION = queryVersion(); // major.minor.build 
  // var listenerBridge = new Array(); // Tracks the URL between messenger & tab listeners.
  
  // Setup localStorage.
  //pFn.log("Loading Pungle Extension: v" + VERSION);
  pFn.log("Initializing environment.");
  
  //pFn.setIfEmpty("version", VERSION); // track version
  //pFn.setIfEmpty("causeID", 0); // set to default cause
  
  if(!ss.storage.causeID) ss.storage.causeID = 0;
  
  pFn.log('causeID = ' + ss.storage.causeID);
  
  panel.port.on("cause", function(data) {
    ss.storage.causeID = data;
    pFn.log('Saved causeID = ' + ss.storage.causeID);
  });
  
  /* Store Domain Watcher
  *-----------------------------------------------------------------------------
  * Create Open Connection to Content Script
  *   1) If request to check for redirect?
  *   2) Else if request received to send aff link.
  *   3) Require user interaction? 
  *   4) User request to update cause? 
  *-----------------------------------------------------------------------------
  */
  pageMod.PageMod({
    include: includeStores,
    contentScriptFile: data.url("content.js"),
    onAttach: function(worker) {
      
      worker.port.on('isRedirect', function(pXtn_URL) { 
        // Content script sends initial message 'isRedirect'? 
        
        pFn.log("EX:: received => query: " + pXtn_URL + ", URL: " + pFn.cleanURL(pXtn_URL));        
        
        // Check to see if redirect called.
        // var flag = pXtn.isRedirect(pFn.cleanURL(pXtn_URL));
        
        // Establish listener bridge for tab.onUpdated.
        // listenerBridge[pFn.cleanURL(msg.url)] = port;
        
        if (!pXtn.hasRedirectRun(pFn.cleanURL(pXtn_URL))) { 
          // Check to make sure redirect called & it hasn't already run.
          
          // Set the redirect as having run for this URL.
          var clean = pFn.cleanURL(pXtn_URL);
          pXtn.redirectRun(clean);
          clean = pFn.removeWWW(clean);
          pXtn.redirectRun(clean);
          
          // Get the the Cause ID and redirect URL          
          // var causeID = pXtn.getCauseID();
          var redirectURL = pXtn.affiliateLink(clean, ss.storage.causeID);
          
          worker.port.emit('inject', redirectURL);
          // worker.port.emit("redirect", merchantID, causeID);
          
          // pFn.log("EX:: sent => response: redirect, merchantID: " + merchantID + ", causeID: " + causeID);
        } else if (pXtn.hasRedirectRun(pFn.cleanURL(pXtn_URL))) pFn.log("EX:: Redirect has already run. No response sent.");
        else pFn.log("EX:: Redirect not flagged. No response sent.")
      });
      
      /* worker.port.on('requestSend', function(pXtn_URL) { 
        // Prepare to send the content script the affiliate link.
        
        pFn.log("EX:: received => query: " + pXtn_URL);
        pFn.log("EX:: Collecting parameters. (again?)");
        
        var url = pXtn_URL;
        url = pFn.removeWWW(pFn.cleanURL(url));
        var merchantID = pXtn.getMerchantID(url);
        var causeID = pXtn.getCauseID();
        
        var redirectURL = pXtn.affiliateLink(merchantID, causeID);
          
        worker.port.emit('inject', redirectURL);
          
        pFn.log("EX:: sent => response: inject, URL: " + redirectURL);        
      }); */
      
      worker.port.on('pungleReferral', function(pXtn_URL) {
        var refURL = pFn.cleanURL(pXtn_URL);
        pXtn.setVisited(refURL);
        pXtn.setVisited(pFn.removeWWW(refURL));
        pXtn.setRedirect(refURL);
        log("EX:: STOP Pungle Referral => URL: " + refURL);
      });
      
    } // end onAttach
  }); // end pageMod
};