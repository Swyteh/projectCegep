
//Implimentation de indexedDB selon le browser
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//Prefix des object indexedDB
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var tbl_item;
var tbl_locations;
var tbl_sites;
var tbl_companies;
var tbl_itemserial;
var tbl_itemsite;
var tbl_uom;
var tbl_del;

var tbl_modif;
var alertMsg = true;
function checkOnline(){
  if (navigator.onLine == false){
    document.getElementById("endSynchro").disabled = true;
    console.log("offline");
}

  if (navigator.onLine){
      console.log("online");
}
}


// }
//   console.log(navigator.onLine + " is online");
//   document.getElementById("syncButton").disabled = true;


//Fonction qui load l'animation, message = message du div, action = si loader = anim, si noloader = no anim.
function loadingAnimation(message,action){
  document.getElementById("divText").textContent = message;
  document.getElementById("divLoad").setAttribute("class", action);
}
//delete la database
function fnDelete(){
  var DBDeleteRequest = window.indexedDB.deleteDatabase("prextraDB",1)
  document.getElementById("divText").textContent = 'Database deleted.';
  alert('Local database deleted');
  window.location.reload();


}
function CreateFakeTab(){


  var request = window.indexedDB.open("prextraDB", 2);

//tests
  const modifData = [
    { tablename: "sites", id: "2", field: "name", oldvalue:"testnewname5", newvalue: "testnewname6" },
    { tablename: "locations", id: "1", field: "cieid", oldvalue: 1 , newvalue: 2 },
    { tablename: "locations", id: "2", field: "locCode", oldvalue:"ornare,", newvalue: "testnewlocCode1111" }

  ];
//tests
  const addData = [
    { tablename: "sites", addid: "2" },
    { tablename: "locations", addid: "2",  }
  ];

  request.onerror = function(event) {
    console.log(event);
    console.log("error");


  };

  request.onsuccess = function(event) {
    console.log("success");

  //  console.log(event);
    var db = request.result;
    var atbl_modif = db.transaction("modifications", "readwrite").objectStore("modifications");
    modifData.forEach(function(modif){
      atbl_modif.add(modif);
    });
    var atbl_add = db.transaction("newdata", "readwrite").objectStore("newdata");
    addData.forEach(function(newData){
      atbl_add.add(newData);
    });

  };
  request.onupgradeneeded = function(event){
    console.log("upgrade");

    //   console.log(event);
    //
    // var db = event.target.result;
    // var tbl_modif = db.createObjectStore("modifications", { keyPath: "modifid",autoIncrement: true });
    // tbl_modif.createIndex("by_modifid", "modifid", {unique: false} );
    //
    // tbl_modif.transaction.oncomplete = function(event){
    //
    //
    // };
    // console.log(event);
  };
}
//synchro
function Synchronisation(){
  var DBDeleteRequest = window.indexedDB.deleteDatabase("prextraDB",1)
  var exists = true;
 document.getElementById("syncButton").disabled = true;
  //tous les promises ajax qui s'execute en même temps
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

  Promise.all([promiseItems,promiseLocations,
    promiseSites,promiseCompanies,promiseItemserial,
    promiseItemsite,promiseUom]).then(function(values){

      var request = window.indexedDB.open("prextraDB", 1);
      loadingAnimation('Synchronizing database.',"loader");

      request.onerror = function(event) {
        console.log(event);
        loadingAnimation('Database already exists.',"noloader");

      };

      request.onsuccess = function(event) {
        db = request.result;
        //quand on ouvre la fonction, si la BD ne va pas dans onupgradeneeded, ça veut dire que la DB existe déjà
        if(exists == true){
          loadingAnimation('Database already exists.',"noloader");

        }
      };

      request.onupgradeneeded = function(event) {
        exists = false;
        //crée les tables et index
        var db = request.result;
        tbl_item = db.createObjectStore("items", {keyPath: "itemid",autoIncrement: true});
        tbl_locations = db.createObjectStore("locations", {keyPath: "locid",autoIncrement: true});
        tbl_sites = db.createObjectStore("sites", {keyPath: "siteid",autoIncrement: true});
        tbl_companies = db.createObjectStore("companies", {keyPath: "cieid",autoIncrement: true});
        tbl_itemserial = db.createObjectStore("itemserial", {keyPath: "itemserialid",autoIncrement: true});
        tbl_itemsite = db.createObjectStore("itemsite", {keyPath: "itemsiteid",autoIncrement: true});
        tbl_uom = db.createObjectStore("uom", {keyPath: "uomid",autoIncrement: true});
        tbl_modif = db.createObjectStore("modifications", { keyPath: "modifid",autoIncrement: true });
        tbl_add = db.createObjectStore("newdata", { keyPath: "newid",autoIncrement: true });
        tbl_del = db.createObjectStore("deldata", { keyPath: "newid",autoIncrement: true });

        tbl_del.createIndex("by_delid", "delid", {unique: false} );
        tbl_add.createIndex("by_addid", "addid", {unique: false} );
        tbl_modif.createIndex("by_modifid", "modifid", {unique: false} );
        tbl_item.createIndex("by_descr", "descr", {unique: false} );
        tbl_item.createIndex("by_itemcode", "itemcode", {unique: false} );
        tbl_locations.createIndex("by_locCode", "locCode", {unique: false} );
        tbl_sites.createIndex("by_sitecode", "sitecode", {unique: false} );
        tbl_companies.createIndex("by_cieid", "cieid", {unique: false} );
        tbl_itemserial.createIndex("by_serial", "serialno", {unique: false} );
        tbl_itemserial.createIndex("by_itemid", "itemid", {unique: false} );
        tbl_itemsite.createIndex("by_itemid", "itemid", {unique: false} );
        tbl_uom.createIndex("by_uom", "uomid", {unique: false} );

        //Mets les données dans les tables
        promiseItems.then((itemData)=>{
          console.log(typeof itemData + " Items ok");
          for (var i in itemData.value) {
            tbl_item.add(itemData.value[i]);
          }

        }).catch( function (error){
          console.log(error);
        });

        promiseLocations.then((locData)=>{
          console.log(typeof locData + "locations ok");
          for (var i in locData.value) {
            tbl_locations.add(locData.value[i]);

          }

        }).catch( function (error){
          console.log("errorLocations");
        });

        promiseSites.then((siteData)=>{
          console.log(typeof siteData + " site ok");
          for (var i in siteData.value) {
            tbl_sites.add(siteData.value[i]);

          }

        }).catch( function (error){
          console.log("errorSites");
        });

        promiseCompanies.then((cieData)=>{
          console.log(typeof cieData + " cie ok");
          for (var i in cieData.value) {
            tbl_companies.add(cieData.value[i]);

          }

        }).catch( function (error){
          console.log("errorCie");
        });

        promiseItemserial.then((itemserialData)=>{
          console.log(typeof itemserialData + " Items serial ok");
          for (var i in itemserialData.value) {
            tbl_itemserial.add(itemserialData.value[i]);

          }

        }).catch( function (error){
          console.log("errorserial");
        });

        promiseItemsite.then((itemsiteData)=>{
          console.log(typeof itemsiteData + " Itemsite ok");
          for (var i in itemsiteData.value) {
            tbl_itemsite.add(itemsiteData.value[i]);

          }

        }).catch( function (error){
          console.log("errorItems");
        });
        promiseUom.then((uomData)=>{
          console.log(typeof uomData + " uom ok");
          for (var i in uomData.value) {
            tbl_uom.add(uomData.value[i]);

          }
        }).catch( function (error){
          console.log("errorUom");
        });
        loadingAnimation('Database synchronized.',"noload");
      }
    })

    console.log(exists);
  }
