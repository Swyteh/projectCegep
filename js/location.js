//sort un item selon le code

var nbloc = 0;
var count = 0;

checkExists();

function next() {
  if((nbloc + 50) < count){
    nbloc = nbloc + 50;
    readAllLocs();
  }
}

function previous() {
  if (nbloc > 0) {
    nbloc = nbloc - 50;
    readAllLocs();
  }
}

function readLoc() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    $('#tblsearchlocs tbody').empty();
    $('#tblsearchlocs tfoot').empty();
    var x = document.getElementById("fitem").value;
    var db = event.target.result
    .transaction("locations", "readwrite")
    .objectStore("locations")
    .index("by_locCode");
    var getLoc = db.get(x);
    var getKey = db.getKey(x);

    getLoc.onsuccess = function() {
      getKey.onsuccess = function() {
        if (getLoc.result) {
          var locInfo = {
            name:getLoc.result.Name,
            siteid:getLoc.result.siteid,
            code:getLoc.result.locCode,
            key:getKey.result
          }
          getSiteName(locInfo).then(function(sitename){
            $('#tblsearchlocs tbody').append(
              '<tr id="'+locInfo.key+'" onclick="openLoc('+locInfo.key+');" >'+
              '<td align="center" class="col-xs-3">'+locInfo.code+'</td>'+
              '<td align="center" class="col-xs-6">'+locInfo.name+'</td>'+
              '<td align="center" class="col-xs-3">'+sitename+'</td></tr>');
          });
        } else {
          alert("No location found");
        }
      };
    };
  };
}
//sort tout les items et tris si seulement actif est coché
function readAllLocs() {
  var loccpt = 0;
  var locstart = 0;
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    $('#tblsearchlocs tbody').empty();
    $('#tblsearchlocs tfoot').empty();
    var db = event.target.result
    .transaction(["locations"], "readonly")
    .objectStore("locations");
    db.count().onsuccess = function(event) {
      count = event.target.result;
      $('#tblsearchlocs tfoot').append(
        '<tr><td coslpan="4" align="right">'+
        (nbloc + 1)+' à '+(nbloc + 50)+' de '+count+' '+
        '<button onclick="previous()" width="100px" class="btn btn-primary btn-width" id="previousb" type="button">Précédent </button>'+
        '&nbsp<button onclick="next()" width="200px" class="btn btn-primary btn-width" id="nextb" type="button">Suivant </button>'+
        '</td></tr>');
      if((nbloc + 50) >= count){
        document.getElementById("nextb").disabled = true;
      }
      if(nbloc <= 0 ){
        document.getElementById("previousb").disabled = true;
      }
    };
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        if (locstart < nbloc) {
          locstart = nbloc;
          cursor.advance(nbloc);
        } else {
          var locInfo = {
            name:cursor.value.Name,
            siteid:cursor.value.siteid,
            code:cursor.value.locCode,
            key:cursor.key
          }
          if (loccpt < 50) {
            getSiteName(locInfo).then(function(sitename){
              $('#tblsearchlocs tbody').append(
                '<tr id="'+locInfo.key+'" onclick="openLoc('+locInfo.key+');" >'+
                '<td align="center" class="col-xs-3">'+locInfo.code+'</td>'+
                '<td align="left" class="col-xs-6">'+locInfo.name+'</td>'+
                '<td align="center" class="col-xs-3">'+sitename+'</td></tr>');
            });
            loccpt = loccpt + 1;
            cursor.continue();
          }
        }
      }
    };
  };
}

//Load les combobox du add items
function loadSites(site) {
  var selectedsite;
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var fsites = $('#fsites',window.parent.document);
    fsites.empty();
    fsites.append('<option value="0"></option>');
    db = event.target.result
    .transaction("sites", "readwrite")
    .objectStore("sites");
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        if(site == cursor.key){
          selectedsite = "Selected";
        } else {
          selectedsite = "";
        }
        fsites.append('<option value="'+cursor.key+'" '+selectedsite+'>'+cursor.value.name+'</option>');
        cursor.continue();
      }
    };
  };
}
//ajout d'un item
function addLoc() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var code = document.getElementById("floccode").value;
    var name = document.getElementById("flocname").value;
    var site = document.getElementById("fsites").value;
    if (code != "" && name != "" && site != 0){
      var db = event.target.result.transaction(["locations"], "readwrite")
      .objectStore("locations")
      .add({ locCode: code, Name: name, siteid: parseInt(site)});

      db.onsuccess = function(event) {
         alert(code + " has been added to your database.");
         addAdd(event.target.result,"locations", name).then(function(modif){
           openSearchLoc();
         });
      };

      db.onerror = function(event) {
         alert("Error");
      }
    } else {
      alert("Missing field(s)");
    }
  };
}

function updateLoc() {
  var cookieValue = $.cookie("locid");
  var loc = parseInt(cookieValue);
  cookieValue = $.cookie("name");
  var name = cookieValue;
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var code = document.getElementById("floccode").value;
    var name = document.getElementById("flocname").value;
    var site = parseInt(document.getElementById("fsites").value);
    var db = event.target.result.transaction(["locations"], "readwrite")
    .objectStore("locations");
    var getLoc = db.get(loc);

    getLoc.onsuccess = function() {
      var data = getLoc.result;
      data.locCode = code;
      data.Name = name;
      data.siteid = site;
      var updatedLoc = db.put(data);
      alert(code + " has been updated to your database.");
      addModif("locCode",loc,String(code),"locations", name).then(function(modif){
        addModif("Name",loc,String(name),"locations", name).then(function(modif){
          addModif("siteid",loc,String(site),"locations", name).then(function(modif){
            openSearchLoc();
          });
        });
      });

    };

    getLoc.onerror = function(event) {
       alert("Unable to update this item! ");
    }
  };
}
//delete un item

function checkItem(){
  var cookieValue = $.cookie("locid");
  var loc = parseInt(cookieValue);
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result.transaction(["itemsite"], "readwrite")
    .objectStore("itemsite");
    db.openCursor().onsuccess = function(event){
      var cursor = event.target.result;
      if (cursor){
        if (cursor.value.locid == loc){
          alert("This location is use");
          return;
        }
        cursor.continue();
      } else {
        checkItemSerial();
      }
    };
  };
}

function checkItemSerial(){
  var cookieValue = $.cookie("locid");
  var loc = parseInt(cookieValue);
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result.transaction(["itemserial"], "readwrite")
    .objectStore("itemserial");
    db.openCursor().onsuccess = function(event){
      var cursor = event.target.result;
      if (cursor){
        if (cursor.value.locid == loc){
          alert("This location is use");
          return;
        }
        cursor.continue();
      } else {
        remove();
      }
    };
  };
}

function remove() {
  if (confirm("Are you sure you want to delete this location?")){
    var cookieValue = $.cookie("locid");
    var loc = parseInt(cookieValue);
    cookieValue = $.cookie("name");
    var name = cookieValue;
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result.transaction(["locations"], "readwrite")
      .objectStore("locations")
      .delete(loc);

      db.onsuccess = function(event) {
        alert("Location deleted");
        addDel(loc,"locations",name).then(function(modif){
          openSearchLoc();
        });
      };
    };
  }
}

function readInfoLoc() {
  var cookieValue = $.cookie("locid");
  var loc = parseInt(cookieValue);
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    //var x = document.getElementById("fitem").value;
    if(loc == 0) {
      loadSites(0);
      $('#tblinfoloc tbody').append(
        '<tr><td colspan="6" align="center">'+
        '<button onclick="addLoc()" class="btn btn-primary" type="button">Ajouter item</button></td></tr>');
    } else {
      var db = event.target.result
      .transaction("locations", "readwrite")
      .objectStore("locations");
      var getLoc = db.get(loc);
      getLoc.onsuccess = function() {
        $.cookie("name", getSite.result.Name);
        $('#floccode').val(''+getLoc.result.locCode+'');
        $('#flocname').val(''+getLoc.result.Name+'');
        loadSites(getLoc.result.siteid);
        $('#tblinfoloc tbody').append(
          '<tr><td colspan="6" align="center">'+
          '<button onclick="updateLoc()" class="btn btn-primary" type="button">Modifier item</button>'+
          ' &nbsp<button onclick="checkItem()" class="btn btn-primary" type="button">Supprimer</button>'+
          '</td></tr>');
      };
    }
  };
}
