/*
  *----------------------------
  *   Pungle Extension Class
  *----------------------------
*/
function pungleExtension() {
  // Variables Declared
  
  // Hash of merchants visited during this session
  var pXtn_visitedHash = new Array();
  
  // Array used to flag URLs passed through pungle.me site, do not redirect.
  var pXtn_passThru = new Array();
  
  // Array used to flag if the redirect has run for the URL.
  var pXtn_redirectRun = new Array();
  
  // Array used to flag the key (url) as allowing the extension to redirect.
  var pXtn_redirectArray = new Array();
  
  // Clean String cause name
  var pXtn_cause_id;
  

  // Methods Declared 
  
  // Get the merchant name for URL (value)
  this.getMerchantName = function (value) {
    return pungleJSON.store[value].name;
  },
  
  // Get the merchant ID for URL
  this.getMerchantID = function (value) {
    value = removeWWW(value.toLowerCase());
    
    for ( var i=0, len=pungleJSON.store.length; i<len; ++i ){
    	  if ( pungleJSON.store[i].domain == value && pungleJSON.store[i].live == true ) { 
		    // log("EX:: getMerchantID => ID:" + pungleJSON.store[i].id + ", URL: " + value);
		    return pungleJSON.store[i].id;
	    }
	}
		
    return false;
  },
  
  // Simply return the cause name
  this.getCauseID = function () {
    if(getItem == "") return 0;
    else return getItem("causeID");
  },
  
  // Tests if the merchant exists for the URL (value)
  this.exists = function (value) {
    
    if (value!='undefined' && value!='' && value.toString().indexOf("chrome:") == -1) {
      value = removeWWW(value.toLowerCase());
      
      for ( var i=0, len=pungleJSON.store.length; i<len; ++i ){
  		  if ( pungleJSON.store[i].domain == value && pungleJSON.store[i].live == true ) { 
  		    log("EX:: Live Vendor Exists => NAME: " + pungleJSON.store[i].name);
  		    return true;
  	    }
  		}
  		
  		// Else vendor not found.
  		log("EX:: Vendor Not Found => DOMAIN: " + value);
  	}
  	
    return false;    
  },
  
  // Did we already go here URL (value)
  this.wasVisited = function (value) {
    if (pXtn_visitedHash[value] == 1) {
      log("EX:: User has already visited: " + value);
      return true;
    }
    log("EX:: User's first visit: " + value);
    return false;
  },
  
  // Mark this URL as visited
  this.setVisited = function (value) {
    pXtn_visitedHash[value] = 1;
    // log("EX:: setVisited => TRUE: " + value);
  },
  
  // Return Affiliate Store Link by ID for Referral Process
  this.affiliateLink = function (merchant_ID, cause_ID) {
    var referralURL = "http://pungle.me/inject/#id=" + merchant_ID + "&c=" + cause_ID;
    // log("EX:: Returning => Link: " + referralURL);    
    return referralURL;
  },
  
  // Enable/Disable (flag) slider redirection on URL
  this.setRedirect = function (url, flag) {
    pXtn_redirectArray[url] = flag;
    // only called by TL.. log("EX:: setRedirect => " + flag + ": " + url);
  },
  
  // Ask if it's OK for content script to redirect? (URL)
  this.isRedirect = function (url) {
    return pXtn_redirectArray[url];
  },
  
  // Set the redirect as having run for this URL.
  this.redirectRun = function (url) {
    pXtn_redirectRun[url] = true;
    log("EX:: redirectRun => TRUE: " + url);
  },
  
  // Has the redirect run for this URL?
  this.hasRedirectRun = function (url) {
    return pXtn_redirectRun[url];
  }
  
  // HOLD: Flag this URL as having already passed through Pungl.me site injector.
  /* this.flagPungleRedirect = function (merchant) {
    pXtn_passThru[merchant] = 1;
  }, */
  
  // HOLD: Check if already flagged as redirected by Pungle.me site injector.
  /* this.isRedirectFlagged = function (merchant) {
    return pXtn_passThru[merchant];
  }, */
  
  // OBSOLETE - set in popup.. Set the cause name in this object and in localStorage
  /* this.setCauseID = function (cause) {
    setItem("causeID", cause);
    pXtn_cause_id = cause;
  }, */
  
} // CLOSE pungleExtension Object

exports.pungleExtension = pungleExtension;

/*
*---------------------
* Utility Functions
*---------------------
*/

// Query localStorage by key.
exports.getItem = getItem;
function getItem(key){
  try{
    var val = window.localStorage.getItem(key);
    if(val == null)    val = "";
    return val;
  }catch(e){
    console.log("Unable to return value for key  " + key);
    return "";
  }
}


// Query localStorage for integer by key. Return 0 if does not exist or non-int.
exports.getIntItem = getIntItem;
function getIntItem(key){
  var val = 0;
  try{
    val = parseInt(window.localStorage.getItem(key));
  }catch(e){}
  if(val == null || val == ""){
    val = 0;
  }
  return val;
}


// Set localStorage by key, value.
exports.setItem = setItem;
function setItem(key, value){
  try{
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
  }catch(e){
    console.log("Unable to set value for key " + key);
  }
}


// Set localStorage by key only if does not exist
exports.setIfEmpty = setIfEmpty;
function setIfEmpty(key, value) {
  try {
    if (getItem(key) == "") {
      setItem(key, value);
    }
  }
  catch (e) {
    setItem(key, value);
  }
}


// Remove the www and subdomain from the URL.
exports.removeWWW = removeWWW;
function removeWWW(url) {
  if (typeof (url) == "undefined") {
    return;
  }
  var retval = url;
  if (url.indexOf("www") != -1) {
    retval = url.substring(url.indexOf(".") + 1, url.length);
  }
  var domainCount = retval.split(".").length - 1;
  while (domainCount > 1) {
    retval = retval.substring(retval.indexOf(".") + 1, retval.length);
    domainCount = retval.split(".").length - 1;
  }
  return retval;
}


// Strips the protocol and trailing slash from the URL leaving the domain.
// ie http://www.amazon.com/Products -> www.amazon.com
exports.cleanURL = cleanURL;
function cleanURL(url){
  if(typeof(url) == "undefined") return "undefined";
  
  url = url.replace("http://", "");
  url = url.replace("https://", "");
  url = url.substring(0, url.indexOf('/'));
  
  return url;
}


// This method sends the redirect message to a specific tab on 'port' telling the content-script to run the redirect.
exports.sendRedirectMessage = sendRedirectMessage;
function sendRedirectMessage(port, url) {
  if (!port) {
    log("TL:: ERROR: PORT NOT FOUND!");
    return;
  }
  
  var flag = pXtn.isRedirect(cleanURL(url));
  
  if (flag && !pXtn.hasRedirectRun(cleanURL(url))) {
    // We are clear to redirect and has not run before this call.
    log("TL:: CALL EX:: Redirect Request " + url);
    
    // Super scrubbed URL, just for good measure.
    var clean = cleanURL(url);
    
    // Mark the URL as having been redirected.
    pXtn.redirectRun(clean);
    
    // Collect merchant & cause information.
    var merchantID = pXtn.getMerchantID(clean);
    var causeID = pXtn.getCauseID();
    
    log("EX:: Compiling Message for ID: " + merchantID);
    
    port.postMessage({
      response: "redirect",
      merchant: merchantID,
      cause: causeID
    });
    
    log("EX:: Redirect message sent.");
  }
}

exports.includeStores = includeStores;
function includeStores(dataStores) {
  var incStores = []; // arary to hold new wild card stores
  
  for ( var i=0, len=dataStores.length; i<len; ++i ){
    incStores[i] = '*.' + dataStores[i].domain;    
  }
  
  log('Included Stores: ' + incStores);
  
  return incStores;
}

/*
exports.queryVersion = queryVersion;
function queryVersion() {
  var jsonUrl = chrome.extension.getURL("manifest.json");
  var xhr = new XMLHttpRequest();
  var qVersion = "Undeclared";
  
  xhr.open("GET", jsonUrl, false);  
  xhr.send();
  
  if(xhr.readyState == 4 && xhr.status == 200) {
    var manifest = JSON.parse(xhr.responseText);
    qVersion = manifest.version;
  }
  
  return qVersion;
}
*/


// Function to add/remove console logs
exports.log = log;
function log(txt){console.log(txt); }