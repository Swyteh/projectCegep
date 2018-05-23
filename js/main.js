
var windowItem
function openItem(itemid) {
  $(function(){
    $.cookie("itemid", itemid);
    $('form').attr('action', 'additem.html');
    $('form').submit();
  });
}

function openSearchItem() {
  $(function(){
    $('form').attr('action', 'searchitem.html');
    $('form').submit();
  });
}

function openItemSerial(itemid) {
  $(function(){
    $.cookie("serialid", itemid);
    $('form').attr('action', 'additemserial.html');
    $('form').submit();
  });
}

function openSearchItemSerial(byitem,itemid) {
  if (byitem) {
    $.cookie("byitem",1);
    $.cookie("byitemid",itemid)
  } else {
    $.cookie("byitem",2);
  }
  $(function(){
    $('form').attr('action', 'searchitemserial.html');
    $('form').submit();
  });
}

function openLoc(idLoc) {
  $(function(){
    $.cookie("locid", idLoc);
    $('form').attr('action', 'addloc.html');
    $('form').submit();
  });
}

function openSearchLoc() {
  $(function(){
    $('form').attr('action', 'searchloc.html');
    $('form').submit();
  });
}

function openSite(idSite) {
  $(function(){
    $.cookie("siteid", idSite);
    $('form').attr('action', 'addsite.html');
    $('form').submit();
  });
}

function openSearchSite() {
  $(function(){
    $('form').attr('action', 'searchsites.html');
    $('form').submit();
  });
}

function addModif(mfield, mid, mvalue, mtable, mname){
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result.transaction(["modifications"], "readwrite")
      .objectStore("modifications")
      .add({ field: mfield, id: parseInt(mid), newvalue: mvalue, tablename: mtable, name: mname});
      db.onsuccess = function(event) {
        resolve("modif");
      };
      db.onerror = function(event) {
         reject(request.error);
      };
    };
  });
}

function addAdd(mid, mtable, mname){
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result.transaction(["newdata"], "readwrite")
      .objectStore("newdata")
      .add({ addid:parseInt(mid), tablename: mtable, name: mname});
      db.onsuccess = function(event) {
        resolve("modif");
      };
      db.onerror = function(event) {
         reject(request.error);
      };
    };
  });
}

function addDel(mid, mtable, mname){
  console.log(mname);
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result.transaction(["deldata"], "readwrite")
      .objectStore("deldata")
      .add({ delid:parseInt(mid), tablename: mtable, name: mname});
      db.onsuccess = function(event) {
        resolve("modif");
      };
      db.onerror = function(event) {
         reject(request.error);
      };
    };
  });
}

function checkExists(){

  $(document).ready(function() {
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });
  });

  var request = indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result;
    if (!db.objectStoreNames.contains("items")){
      document.getElementById("buttonsearch").disabled = true;
      document.getElementById("buttonsearchall").disabled = true;
      document.getElementById("buttonadd").disabled = true;
      document.getElementById("buttonsearchbyitem").disabled = true;
      alert("No database found.");

    }
  };
}

function getqte(object){
  var id = object.id;
  var qte = 0;
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result
      .transaction("itemsite", "readwrite")
      .objectStore("itemsite");
      db.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          if (cursor.value.itemid == id) {
            qte = parseInt(qte) + parseInt(cursor.value.qtyonhand);
          }
          cursor.continue();
        } else {
          resolve(qte);
        }
      };
    };
    request.onerror = function(event){
      reject(request.error);
    };
  });
}

function getqteserial(object){
  var id = object.id;
  var qte = 0;
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result
      .transaction("itemserial", "readwrite")
      .objectStore("itemserial");
      db.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          if (cursor.value.itemid == id) {
            qte = parseInt(qte) + parseInt(cursor.value.qtyonhand);
          }
          cursor.continue();
        } else {
          resolve(qte);
        }
      };
    };
    request.onerror = function(event){
      reject(request.error);
    };
  });
}

function getItemDescr(objet){
  var itemid = objet.itemid;
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    //console.log(objet);
    request.onsuccess = function(event) {
      var db = event.target.result
      .transaction("items", "readwrite")
      .objectStore("items");
      var getDescr = db.get(itemid);
      getDescr.onsuccess = function() {
        resolve(getDescr.result.descr);
      };
    };
    request.onerror = function(event){
        reject(request.error);
    };
  });
}

function getName(objet){
  var itemid = objet.id;
  var tablename = objet.tablename;
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    //console.log(objet);
    request.onsuccess = function(event) {
      var db = event.target.result
      .transaction(tablename, "readwrite")
      .objectStore(tablename);
      var getCode = db.get(itemid);
      getCode.onsuccess = function() {
        if (tablename == "items") {
          resolve(getCode.result.descr);
        } else if (tablename == "itemserial"){
          resolve(getCode.result.serialno);
        } else if (tablename == "sites") {
          resolve(getCode.result.name);
        } else if (tablename == "locations") {
          resolve(getCode.result.Name);
        } else if (tablename == "itemsite") {
          resolve(getCode.result.itemsiteid);
        }

      };
    };
    request.onerror = function(event){
        reject(request.error);
    };
  });
}

function getItemCode(objet){
  var itemid = objet.itemid;
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    //console.log(objet);
    request.onsuccess = function(event) {
      var db = event.target.result
      .transaction("items", "readwrite")
      .objectStore("items");
      var getCode = db.get(itemid);
      getCode.onsuccess = function() {
        resolve(getCode.result.itemcode);
      };
    };
    request.onerror = function(event){
        reject(request.error);
    };
  });
}

function getCompanyName(objet){
  var cieid = objet.cieid;
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    //console.log(objet);
    request.onsuccess = function(event) {
      var db = event.target.result
      .transaction("companies", "readwrite")
      .objectStore("companies")
      .index("by_cieid");
      var getCompany = db.get(cieid);
      getCompany.onsuccess = function() {
        if (cieid == 0) {
          resolve("");
        } else {
          resolve(getCompany.result.name);
        }
      };
    };
    request.onerror = function(event){
        reject(request.error);
    };
  });
}

function getSiteName(objet){
  var siteid = objet.siteid;
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    //console.log(objet);
    request.onsuccess = function(event) {
      var db = event.target.result
      .transaction("sites", "readwrite")
      .objectStore("sites");
      var getSite = db.get(siteid);
      getSite.onsuccess = function() {
        resolve(getSite.result.name);
        };
    };
    request.onerror = function(event){
        reject(request.error);
    };
  });
}

function getLocName(objet){
  var locid = objet.locid;
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    //console.log(objet);
    request.onsuccess = function(event) {
      var db = event.target.result
      .transaction("locations", "readwrite")
      .objectStore("locations");
      var getLoc = db.get(locid);
      getLoc.onsuccess = function() {
        resolve(getLoc.result.Name);
        };
    };
    request.onerror = function(event){
        reject(request.error);
    };
  });
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
     $('form').attr('action', 'searchitem.html')
     $('form').submit();
   });
   $('#loctab').click(function() {
     $('form').attr('action', 'searchloc.html')
     $('form').submit();
   });
   $('#sitestab').click(function() {
     $('form').attr('action', 'searchsites.html')
     $('form').submit();
   });
   $('#serialtab').click(function() {
     $.cookie("byitem",2);
     $('form').attr('action', 'searchitemserial.html')
     $('form').submit();
   });
   $('#synchrotab').click(function() {
     $('form').attr('action', 'synchro.html')
     $('form').submit();
   });
   $('#modifstab').click(function() {
          $('#frametab').attr('src','modifications.html')
   });
   $('#addtab').click(function() {
          $('#frametab').attr('src','new.html')
   });
});
