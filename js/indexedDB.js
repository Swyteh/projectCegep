//prefixes of implementation that we want to tes
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

  //prefixes of window.IDB objects
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

  if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
  }
  var db;
  var request = window.indexedDB.open("newDatabase", 1);

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
    tbl_companies.createIndex("by_ciecode", "ciecode", {unique: false} );
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

  function read() {
    $('#tblsearchitems tbody').empty();
    var x = document.getElementById("fitem").value;
    var db = request.result
    .transaction("items", "readwrite")
    .objectStore("items")
    .index("by_descr");
    var getItem = db.get(x);
    var getKey = db.getKey(x);

    getItem.onsuccess = function() {
      getKey.onsuccess = function() {
        if (getItem.result) {
          $('#tblsearchitems tbody').append('<tr id="'+getKey.result+'""><td align="center">'+getItem.result.itemcode+'</td><td align="center">'+getItem.result.descr+'</td><td align="center"></td><td align="center">'+getItem.result.isactive+'</td><td align="center"><button onclick="remove('+getKey.result+')">Delete item</button></td></tr>');
        }
        else {
          alert("Item introuvable");
        }
      };
    };
  }

  function readAll() {
    $('#tblsearchitems tbody').empty();
    var db = request.result
    .transaction("items", "readwrite")
    .objectStore("items")

    db.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;

       if (cursor) {
         $('#tblsearchitems tbody').append('<tr id="'+cursor.key+'""><td align="center">'+cursor.value.itemcode+'</td><td align="center">'+cursor.value.descr+'</td><td align="center"></td><td align="center">'+cursor.value.isactive+'</td><td align="center"><button onclick="remove('+cursor.key+')">Delete item</button></td></tr>');
         cursor.continue();
       }
    };
  }

  function add() {
    var code = document.getElementById("fitemcode").value;
    var descr = document.getElementById("fitemdescr").value;
    var actif = document.getElementById("fitemactif").value;
    var request = db.transaction(["items"], "readwrite")
    .objectStore("items")
    .add({ itemcode: code, descr: descr, isactive: actif});

    request.onsuccess = function(event) {
       alert(code + " has been added to your database.");
    };

    request.onerror = function(event) {
       alert("Unable to add this item\r\n"+code+" is aready exist in your database! ");
    }
  }

  function remove(x) {
    var request = db.transaction(["items"], "readwrite")
    .objectStore("items")
    .delete(x);

    request.onsuccess = function(event) {
      $('#'+x+'').remove();
       alert("Item suprimé");
    };
  }

  $(function(){
      //When an <li> element in your myMenu area is clicked
      $('#mymenu li').click(function() {
            //Removes the active class from any <li> elements
            $('li.active').removeClass('active');
            //Adds it to the current element
            $(this).addClass('active');
     });
     $('#searchtab').click(function() {
            $('#frametab').attr('src','search.html')
     });
     $('#additemstab').click(function() {
            $('#frametab').attr('src','additem.html')
     });
     $('#loctab').click(function() {
            $('#frametab').attr('src','loc.html')
     });
     $('#sitestab').click(function() {
            $('#frametab').attr('src','sites.html')
     });
     $('#serialtab').click(function() {
            $('#frametab').attr('src','serials.html')
     });
  });
