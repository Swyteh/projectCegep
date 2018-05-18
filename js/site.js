//sort un item selon le code

var nbsite = 0;
var count = 0;

checkExists();

function next() {
  if((nbsite + 50) < count){
    nbsite = nbsite + 50;
    readAllSites();
  }
}

function previous() {
  if (nbsite > 0) {
    nbsite = nbsite - 50;
    readAllSites();
  }
}

function readSite() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    $('#tblsearchsites tbody').empty();
    $('#tblsearchsites tfoot').empty();
    var x = document.getElementById("fitem").value;
    var db = request.result
    .transaction("sites", "readwrite")
    .objectStore("sites")
    .index("by_sitecode");
    var getSite = db.get(x);
    var getKey = db.getKey(x);

    getSite.onsuccess = function() {
      getKey.onsuccess = function() {
        if (getSite.result) {
          var siteID = {
            cieid:getSite.result.cieid
          }
          getCompanyName(siteID).then(function(ciename){
            $('#tblsearchsites tbody').append(
              '<tr id="'+getKey.result+'" onclick="openSite('+getKey.result+');" >'+
              '<td align="center" class="col-xs-3">'+getSite.result.sitecode+'</td>'+
              '<td align="center" class="col-xs-6">'+getSite.result.name+'</td>'+
              '<td align="center" class="col-xs-3">'+ciename+'</td></tr>');
          });
        } else {
          alert("No site found");
        }
      };
    };
  };
}

function readAllSites() {
  var sitecpt = 0;
  var sitestart = 0;
  var request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    $('#tblsearchsites tbody').empty();
    $('#tblsearchsites tfoot').empty();
    var db = request.result
    .transaction("sites", "readwrite")
    .objectStore("sites");
    db.count().onsuccess = function(event) {
      count = event.target.result;
      $('#tblsearchsites tfoot').append(
        '<tr><td coslpan="4" align="right">'+
        (nbsite + 1)+' à '+(nbsite + 50)+' de '+count+' '+
        '<button onclick="previous()" width="100px" class="btn btn-primary btn-width" id="previousb" type="button">Précédent </button>'+
        '&nbsp<button onclick="next()" width="200px" class="btn btn-primary btn-width" id="nextb" type="button">Suivant </button>'+
        '</td></tr>');
      if((nbsite + 50) >= count){
        document.getElementById("nextb").disabled = true;
      }
      if(nbsite <= 0 ){
        document.getElementById("previousb").disabled = true;
      }
    };
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor){
        if (sitestart < nbsite) {
          sitestart = nbsite;
          cursor.advance(nbsite);
        } else {
          var siteInfo = {
            name:cursor.value.name,
            code:cursor.value.sitecode,
            cieid:cursor.value.cieid,
            key:cursor.key
          }
          if (sitecpt < 50) {
            getCompanyName(siteInfo).then(function(ciename){
              $('#tblsearchsites tbody').append(
                '<tr id="'+siteInfo.key+'" onclick="openSite('+siteInfo.key+');" >'+
                '<td align="center" class="col-xs-3">'+siteInfo.code+'</td>'+
                '<td align="center" class="col-xs-6">'+siteInfo.name+'</td>'+
                '<td align="center" class="col-xs-3">'+ciename+'</td></tr>');
            });
            sitecpt = sitecpt + 1;
            cursor.continue();
          }
        }
      }
    };
  };
}

function loadCie(cie) {
  var selectedcie;
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var fcie = $('#fcie',window.parent.document);
    fcie.empty();
    fcie.append('<option value="0"></option>');
    db = event.target.result
    .transaction("companies", "readwrite")
    .objectStore("companies");
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        if(cie == cursor.key){
          selectedcie = "Selected";
        } else {
          selectedcie = "";
        }
        fcie.append('<option value="'+cursor.key+'" '+selectedcie+'>'+cursor.value.name+'</option>');
        cursor.continue();
      }
    };
  };
}

function addSite() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var code = document.getElementById("fsitecode").value;
    var name = document.getElementById("fsitename").value;
    var cieid = document.getElementById("fcie").value;
    if (code != "" && name != "" && cieid != 0){
      var db = request.result.transaction(["sites"], "readwrite")
      .objectStore("sites")
      .add({ sitecode: code, name: name, cieid: parseInt(cieid)});

      db.onsuccess = function(event) {
        alert(code + " has been added to your database.");
        addAdd(event.target.result,"sites", name).then(function(modif){
          openSearchSite();
        });
      };
      db.onerror = function(event) {
        alert("Error")
      }
    } else {
      alert("Missing field(s)");
    }
  };
}

function updateSite() {
  var cookieValue = $.cookie("siteid");
  var site = parseInt(cookieValue);
  cookieValue = $.cookie("name");
  var name = cookieValue;
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var code = document.getElementById("fsitecode").value;
    var name = document.getElementById("fsitename").value;
    var cie = parseInt(document.getElementById("fcie").value);
    var db = event.target.result.transaction(["sites"], "readwrite")
    .objectStore("sites");
    var getSite = db.get(site);

    getSite.onsuccess = function() {
      var data = getSite.result;
      data.sitecode = code;
      data.name = name;
      data.cieid = cie;
      var updatedSite = db.put(data);
      alert(code + " has been updated to your database.");
      addModif("sitecode",site,String(code),"sites", name).then(function(modif){
        addModif("name",site,String(name),"sites", name).then(function(modif){
          addModif("cieid",site,String(cie),"sites", name).then(function(modif){
            openSearchSite();
          });
        });
      });
    };
    getSite.onerror = function(event) {
       alert("Unable to update this site! ");
    }
  };
}
//delete un item
function checkItem(){
  var cookieValue = $.cookie("siteid");
  var site = parseInt(cookieValue);
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result.transaction(["itemsite"], "readwrite")
    .objectStore("itemsite");
    db.openCursor().onsuccess = function(event){
      var cursor = event.target.result;
      if (cursor){
        if (cursor.value.siteid == site){
          alert("This site is use");
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
  var cookieValue = $.cookie("siteid");
  var site = parseInt(cookieValue);
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result.transaction(["itemserial"], "readwrite")
    .objectStore("itemserial");
    db.openCursor().onsuccess = function(event){
      var cursor = event.target.result;
      if (cursor){
        if (cursor.value.siteid == site){
          alert("This site is use");
          return;
        }
        cursor.continue();
      } else {
        remove();
      }
    };
  };
}

function remove(){
  if (confirm("Are you sure you want to delete this site?")){
    var cookieValue = $.cookie("siteid");
    var site = parseInt(cookieValue);
    cookieValue = $.cookie("name");
    var name = cookieValue;
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result.transaction(["sites"], "readwrite")
      .objectStore("sites")
      .delete(site);

      db.onsuccess = function(event) {
        alert("Site deleted");
        addDel(site,"sites",name).then(function(modif){
          getLocation(site);
        });
      };
    };
  }
}

function getLocation(site){
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result.transaction(["locations"], "readwrite")
    .objectStore("locations");
    db.openCursor().onsuccess = function(event){
      var cursor = event.target.result;
      if (cursor){
        if (cursor.value.siteid == site){
          removeLoc(cursor.key, cursor.value.Name);
        }
        cursor.continue();
      } else {
        openSearchSite();
      }
    };
  };
}

function removeLoc(id, name){
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result.transaction(["locations"], "readwrite")
    .objectStore("locations")
    .delete(id);
    db.onsuccess = function(event) {
      addDel(id,"locations",name).then(function(modif){
        console.log("location "+id+" deleted");
      });
    };
  };
}

function readInfoSite() {
  var cookieValue = $.cookie("siteid");
  var site = parseInt(cookieValue);
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    if(site == 0) {
      loadCie(0);
      $('#tblinfosite tbody').append(
        '<tr><td colspan="6" align="center">'+
        '<button onclick="addSite()" class="btn btn-primary" type="button">Ajouter site</button></td>'+'</tr>');
    } else {
      var db = event.target.result
      .transaction("sites", "readwrite")
      .objectStore("sites");
      var getSite = db.get(site);
      getSite.onsuccess = function() {
        $.cookie("name", getSite.result.name);
        $('#fsitecode').val(''+getSite.result.sitecode+'');
        $('#fsitename').val(''+getSite.result.name+'');
        loadCie(getSite.result.siteid);
        $('#tblinfosite tbody').append(
          '<tr><td colspan="6" align="center">'+
          '<button onclick="updateSite()" class="btn btn-primary" type="button">Modifier item</button>'+
          ' &nbsp<button onclick="checkItem()" class="btn btn-primary" type="button">Supprimer</button>'+
          '</td></tr>');
      };
    }
  };
}
