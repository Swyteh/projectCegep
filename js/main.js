function read() {
  var request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    db = request.result
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
          $('#tblsearchitems tbody').append('<tr id="'+getKey.result+'""><td align="center">'+getItem.result.itemcode+'</td><td align="center">'+getItem.result.descr+'</td><td align="center"></td><td align="center">'+getItem.result.isActive+'</td><td align="center"><button onclick="remove('+getKey.result+')">Delete item</button></td></tr>');
        }
        else {
          alert("Item introuvable");
        }
      };
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
       $('#tblsearchitems tbody').append('<tr id="'+cursor.key+'""><td align="center">'+cursor.value.itemcode+'</td><td align="center">'+cursor.value.descr+'</td><td align="center"></td><td align="center">'+cursor.value.isActive+'</td><td align="center"><button onclick="remove('+cursor.key+')">Delete item</button></td></tr>');
       cursor.continue();
     }
  };
}

function add() {
  request = window.indexedDB.open("prextraDB",4);
  var code = document.getElementById("fitemcode").value;
  var descr = document.getElementById("fitemdescr").value;
  var actif = document.getElementById("fitemactif").value;
  var request = db.transaction(["items"], "readwrite")
  .objectStore("items")
  .add({ itemcode: code, descr: descr, isActive: parseInt(actif)});

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
   $('#synchrotab').click(function() {
          $('#frametab').attr('src','synchro.html')
   });
});
