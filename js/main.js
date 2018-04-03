
function readItem() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    $('#tblsearchitems tbody').empty();
    var x = document.getElementById("fitem").value;
    var active = document.getElementById("factifslm").checked;
    var db = request.result
    .transaction("items", "readwrite")
    .objectStore("items")
    .index("by_itemcode");
    var getItem = db.get(x);
    var getKey = db.getKey(x);

    getItem.onsuccess = function() {
      getKey.onsuccess = function() {
        if (active) {
          if (getItem.result.isActive == 1) {
            $('#tblsearchitems tbody').append('<tr id="'+getKey.result+'""><td align="center">'+getItem.result.itemcode+'</td><td align="center">'+getItem.result.descr+'</td><td align="center"></td><td align="center">'+getItem.result.isActive+'</td><td align="center"><button onclick="remove('+getKey.result+')">Delete item</button></td></tr>');
          } else {
            alert("Aucun d'item trouvé");
          }
        } else {
          if (getItem.result) {
            $('#tblsearchitems tbody').append('<tr id="'+getKey.result+'""><td align="center">'+getItem.result.itemcode+'</td><td align="center">'+getItem.result.descr+'</td><td align="center"></td><td align="center">'+getItem.result.isActive+'</td><td align="center"><button onclick="remove('+getKey.result+')">Delete item</button></td></tr>');
          } else {
            alert("Aucun d'item trouvé");
          }
        }
      };
    };
  };
}

function readAllItems() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var active = document.getElementById("factifslm").checked;
    $('#tblsearchitems tbody').empty();
    var db = request.result
    .transaction("items", "readwrite")
    .objectStore("items")

    db.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;

       if (cursor) {
         if (active) {
           if (cursor.value.isActive == 1) {
             $('#tblsearchitems tbody').append('<tr id="'+cursor.key+'""><td align="center">'+cursor.value.itemcode+'</td><td align="center">'+cursor.value.descr+'</td><td align="center"></td><td align="center">'+cursor.value.isActive+'</td><td align="center"><button onclick="remove('+cursor.key+')">Delete item</button></td></tr>');
             cursor.continue();
           }
         }
         else {
           $('#tblsearchitems tbody').append('<tr id="'+cursor.key+'""><td align="center">'+cursor.value.itemcode+'</td><td align="center">'+cursor.value.descr+'</td><td align="center"></td><td align="center">'+cursor.value.isActive+'</td><td align="center"><button onclick="remove('+cursor.key+')">Delete item</button></td></tr>');
           cursor.continue();
         }
       }
    };
  };
}

function iframeOnload(event, callback) {
  if (event.src) {
    callback();
  }
}

function loadAdd() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var floc = $('#floc',window.parent.frames[0].document);
    var fuom = $('#fuom',window.parent.frames[0].document);
    floc.empty();
    floc.append('<option value="0"></option>');
    fuom.empty();
    fuom.append('<option value="0"></option>');
    var db = request.result
    .transaction("locations", "readwrite")
    .objectStore("locations")

    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        floc.append('<option value="'+cursor.key+'">'+cursor.value.Name+'</option>');
        cursor.continue();
      }
    };
    db = request.result
    .transaction("uom", "readwrite")
    .objectStore("uom")

    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        fuom.append('<option value="'+cursor.key+'">'+cursor.value.name+'</option>');
        cursor.continue();
      }
    };
  };
}

function add() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var code = document.getElementById("fitemcode").value;
    var descr = document.getElementById("fitemdescr").value;
    var active = document.getElementById("factifslm").checked;
    if (active) {
      var actif = 1;
    } else {
      var actif = 0;
    }
    var loc = document.getElementById("floc").value;
    var uom = document.getElementById("fuom").value;
    var request = db.transaction(["items"], "readwrite")
    .objectStore("items")
    .add({ itemcode: code, descr: descr, isActive: parseInt(actif), locid: loc, uomid: uom});

    request.onsuccess = function(event) {
       alert(code + " has been added to your database.");
    };

    request.onerror = function(event) {
       alert("Unable to add this item\r\n"+code+" is aready exist in your database! ");
    }
  }

  function remove(x) {
    request = window.indexedDB.open("prextraDB",2);
    var request = db.transaction(["items"], "readwrite")
    .objectStore("items")
    .delete(x);

    request.onsuccess = function(event) {
      $('#'+x+'').remove();
       alert("Item suprimé");
    };
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
   $('#synchrotab').click(function() {
          $('#frametab').attr('src','synchro.html')
   });
});
