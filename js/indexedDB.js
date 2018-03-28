//prefixes of implementation that we want to tes
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

  //prefixes of window.IDB objects
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
  if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
  }
var sync = false;
var tbl_item;
var tbl_locations;
var tbl_sites;
var tbl_companies;
var tbl_itemserial;
var tbl_itemsite;
var tbl_uom;

var promiseItems =  new Promise((resolve,reject) => {
ajaxItemsData(resolve,reject);
})

var promiseLocations =  new Promise((resolve,reject) => {
ajaxLocationsData(resolve,reject);
})

var promiseSites =  new Promise((resolve,reject) => {
ajaxSitesData(resolve,reject);
})
var promiseCompanies =  new Promise((resolve,reject) => {
ajaxCompaniesData(resolve,reject);
})

var promiseItemserial =  new Promise((resolve,reject) => {
ajaxItemserialData(resolve,reject);
})

var promiseItemsite =  new Promise((resolve,reject) => {
ajaxItemsiteData(resolve,reject);
})

var promiseUom =  new Promise((resolve,reject) => {
ajaxUomData(resolve,reject);
})

function Synchronisation(){
  var request = window.indexedDB.open("prextraDB", 1);
  request.onerror = function(event) {
    console.log("error: ");
  };

  request.onsuccess = function(event) {
    db = request.result;
  };
  request.onupgradeneeded = function(event) {
    var db = request.result;
    tbl_item = db.createObjectStore("items", {keyPath: "itemid",autoIncrement: true});
    tbl_locations = db.createObjectStore("locations", {keyPath: "locid",autoIncrement: true});
    tbl_sites = db.createObjectStore("sites", {keyPath: "siteid",autoIncrement: true});
    tbl_companies = db.createObjectStore("companies", {keyPath: "cieid",autoIncrement: true});
    tbl_itemserial = db.createObjectStore("itemserial", {keyPath: "itemserialid",autoIncrement: true});
    tbl_itemsite = db.createObjectStore("itemsite", {keyPath: "itemsiteid",autoIncrement: true});
    tbl_uom = db.createObjectStore("uom", {keyPath: "uomid",autoIncrement: true});

    tbl_item.createIndex("by_descr", "descr", {unique: false} );
    tbl_locations.createIndex("by_locCode", "locCode", {unique: false} );
    tbl_sites.createIndex("by_sitecode", "sitecode", {unique: false} );
    tbl_companies.createIndex("by_ciecode", "cieCode", {unique: false} );
    tbl_itemserial.createIndex("by_serial", "serial", {unique: false} );
    tbl_itemsite.createIndex("by_itemid", "itemid", {unique: false} );
    tbl_uom.createIndex("by_uom", "uomid", {unique: false} );

  //Mets les données dans table items
   promiseItems.then((itemData)=>{
    console.log(typeof itemData + " ItemsTYPEOF");
     for (var i in itemData.value) {
        tbl_item.add(itemData.value[i]);
     }

   }).catch( function (error){
     console.log("errorItems");
   });

   //Mets les données dans table locations
   promiseLocations.then((locData)=>{
   console.log(typeof locData + "locationsTYPEOF");
    console.log( locData);
     for (var i in locData.value) {
        tbl_locations.add(locData.value[i]);
     }

   }).catch( function (error){
     console.log("errorLocations");
   });

   promiseSites.then((siteData)=>{
    console.log(typeof siteData + " siteTYPEOF");
     for (var i in siteData.value) {
        tbl_sites.add(siteData.value[i]);
     }

   }).catch( function (error){
     console.log("errorSites");
   });

   promiseCompanies.then((cieData)=>{
    console.log(typeof cieData + " cieTYPEOF");
     for (var i in cieData.value) {
        tbl_companies.add(cieData.value[i]);
     }

   }).catch( function (error){
     console.log("errorCie");
   });

   promiseItemserial.then((itemserialData)=>{
    console.log(typeof itemserialData + " ItemsTYPEOF");
     for (var i in itemserialData.value) {
        tbl_itemserial.add(itemserialData.value[i]);
     }

   }).catch( function (error){
     console.log("errorserial");
   });

   promiseItemsite.then((itemsiteData)=>{
    console.log(typeof itemsiteData + " ItemsiteTYPEOF");
     for (var i in itemsiteData.value) {
        tbl_itemsite.add(itemsiteData.value[i]);
     }

   }).catch( function (error){
     console.log("errorItems");
   });
   promiseUom.then((uomData)=>{
    console.log(typeof uomData + " ItemsiteTYPEOF");
     for (var i in uomData.value) {
        tbl_uom.add(uomData.value[i]);
     }

   }).catch( function (error){
     console.log("errorUom");
   });
  }
  console.log(request);
 }
  function fnDelete(){
    var DBDeleteRequest = window.indexedDB.deleteDatabase("prextraDB",1)
    alert("database deleted");
  }
