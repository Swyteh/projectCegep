//prefixes of implementation that we want to tes
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var promise =  new Promise((resolve,reject) => {
ajaxLocationsData(resolve,reject);

})

// const itemsData = [
//   { itemcode : "chair23", descr: "chaise pliante bleu", isactive: 1 },
//   { itemcode : "table1", descr: "table ronde", isactive: 1 }
// ];
var db;
var request = indexedDB.open("newDatabase", 2);
var tbl_locations;

request.onerror = function(event) {
  console.log("error: ");
};

request.onsuccess = function(event) {
  db = request.result;
};

request.onupgradeneeded = function(event) {
  // console.log("fct aspp");
  // var db = request.result;
  // var tbl_locations = db.createObjectStore("locations", {keyPath: "locid",autoIncrement: true});
  // tbl_locations.createIndex("by_locCode", "locCode", {unique: false} );

 promise.then((locData)=>{
 console.log(typeof locData);
  console.log( locData);
   for (var i in locData.value) {
  //   console.log(itemData.value[i]);
      tbl_locations.add(locData.value[i]);
   }

 }).catch( function (error){
   console.log("error");
 });

}
console.log(request);

// function read() {
//   var x = document.getElementById("fitem").value;
//   var db = request.result
//   .transaction("items", "readwrite")
//   .tbl_locations("items")
//   .index("by_descr");
//   var getItem = db.get(x);
//   getItem.onsuccess = function() {
//     if (getItem.result) {
//       $('#tblsearchitems tbody').append('<tr><td align="center">'+getItem.result.itemcode+'</td><td align="center">'+getItem.result.descr+'</td><td align="center"></td><td align="center">'+getItem.result.isactive+'</td></tr>');
//     }
//     else {
//       alert("This item couldn't be found in your database!");
//     }
//   };
// }

// function readAll() {
//   var tbl_locations = db.transaction("locations").tbl_locations("locations");
//
//   tbl_locations.openCursor().onsuccess = function(event) {
//      var cursor = event.target.result;
//
//      if (cursor) {
//         alert("Description for code " + cursor.key + " is " + cursor.value.descr);
//         cursor.continue();
//      }
//
//      else {
//         alert("No more entries!");
//      }
//   };
// }
//
// function add() {
//   var code = document.getElementById("fitemcode").value;
//   var descr = document.getElementById("fitemdescr").value;
//   var actif = document.getElementById("fitemactif").value;
//   var request = db.transaction(["items"], "readwrite")
//   .tbl_locations("items")
//   .add({ itemcode: code, descr: descr, isactive: actif});
//
//   request.onsuccess = function(event) {
//      alert(code + " has been added to your database.");
//   };
//
//   request.onerror = function(event) {
//      alert("Unable to add this item\r\n"+code+" is aready exist in your database! ");
//   }
// }
//
// function remove() {
//   var x = document.getElementById("fitem").value;
//   var db = request.result
//   .transaction("items", "readwrite")
//   .tbl_locations("items")
//   .index("by_descr");
//   var deleteItem = db.delete(x);
//   // var x = document.getElementById("fitem").value;
//   // var request = db.transaction(["items"], "readwrite")
//   // .objectStore("items")
//   // .delete(x);
//
//   deleteItem.onsuccess = function(event) {
//      alert(x+" entry has been removed from your database.");
//   };
// }
//
// $(function(){
//     //When an <li> element in your myMenu area is clicked
//     $('#mymenu li').click(function() {
//           //Removes the active class from any <li> elements
//           $('li.active').removeClass('active');
//           //Adds it to the current element
//           $(this).addClass('active');
//    });
//    $('#searchtab').click(function() {
//           $('#frametab').attr('src','search.html')
//    });
//    $('#additemstab').click(function() {
//           $('#frametab').attr('src','additems.html')
//    });
//    $('#loctab').click(function() {
//           $('#frametab').attr('src','loc.html')
//    });
//    $('#sitestab').click(function() {
//           $('#frametab').attr('src','sites.html')
//    });
//    $('#serialtab').click(function() {
//           $('#frametab').attr('src','serials.html')
//    });
// });
