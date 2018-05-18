//sort un item selon le code
var cptitemsite = 0;
var itemsiteids = [];
var nbitem = 0;
var count = 0
var locLine = 0;

checkByItem();

function checkByItem(){
  var cookieValue = $.cookie("byitem");
  var byitem = parseInt(cookieValue);
  if (byitem == 1){
    readSerialByItem(0);
  }
}

checkExists();

function next() {
  if((nbitem + 50) < count){
    nbitem = nbitem + 50;
    readAllItems();
  }
}

function previous() {
  if (nbitem > 0) {
    nbitem = nbitem - 50;
    readAllItems();
  }
}

function checkItemCode() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var code = document.getElementById("fitem").value;
    var db = event.target.result
    .transaction("items", "readwrite")
    .objectStore("items")
    .index("by_itemcode")
    .getKey(code);
    db.onsuccess = function(event) {
      if (db.result){
        readSerialByItem(db.result);
      }
    };
  };
}

function readItem() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    $('#tblsearchitems tbody').empty();
    $('#tblsearchitems tfoot').empty();
    var x = document.getElementById("fitem").value;
    var active = document.getElementById("factifslm").checked;
    var db = event.target.result
    .transaction("itemserial", "readwrite")
    .objectStore("itemserial")
    .index("by_serial");
    var getItem = db.get(x);
    var getKey = db.getKey(x);

    getItem.onsuccess = function() {
      getKey.onsuccess = function() {
        if (getItem.result) {
          var itemInfo = {
            serial:getItem.result.serialno,
            itemid:getItem.result.itemid,
            serialid:getItem.result.itemserialid,
            qte:getItem.result.qtyonhand,
            key:getKey.result
          }
          if (active) {
            if (getItem.result.isactive == 1) {
              getItemCode(itemInfo).then(function(codereturn){
                getItemDescr(itemInfo).then(function(descrreturn){
                  $('#tblsearchitems tbody').append(
                    '<tr id="'+itemInfo.key+'" onclick="openItemSerial('+itemInfo.key+');" >'+
                    '<td align="center" class="col-xs-2">'+itemInfo.serial+'</td>'+
                    '<td align="center" class="col-xs-2">'+codereturn+'</td>'+
                    '<td align="left" class="col-xs-5">'+descrreturn+'</td>'+
                    '<td align="center" class="col-xs-2">'+itemInfo.qte+'</td>'+
                    '<td align="center" class="col-xs-1">Oui</td></tr>');
                });
              });
            }
          } else {
            getItemCode(itemInfo).then(function(codereturn){
              getItemDescr(itemInfo).then(function(descrreturn){
                $('#tblsearchitems tbody').append(
                  '<tr id="'+itemInfo.key+'" onclick="openItemSerial('+itemInfo.key+');" >'+
                  '<td align="center" class="col-xs-2">'+itemInfo.serial+'</td>'+
                  '<td align="center" class="col-xs-2">'+codereturn+'</td>'+
                  '<td align="left" class="col-xs-5">'+descrreturn+'</td>'+
                  '<td align="center" class="col-xs-2">'+itemInfo.qte+'</td>'+
                  '<td align="center" class="col-xs-1">Non</td></tr>');
              });
            });
          }
        } else {
          alert("No serial number found");
        }
      };
    };
  };
}
function readAllItems() {
  var itemcpt = 0;
  var itemstart = 0;
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var active = document.getElementById("factifslm").checked;
    var ouiNon = "Oui";
    $('#tblsearchitems tbody').empty();
    $('#tblsearchitems tfoot').empty();
    var db = event.target.result
    .transaction(["itemserial"], "readonly")
    .objectStore("itemserial");
    db.count().onsuccess = function(event) {
      count = event.target.result;
      $('#tblsearchitems tfoot').append(
        '<tr><td coslpan="4" align="right">'+
        (nbitem + 1)+' à '+(nbitem + 50)+' de '+count+' '+
        '<button onclick="previous()" width="100px" class="btn btn-primary btn-width" id="previousb" type="button">Précédent </button>'+
        '&nbsp<button onclick="next()" width="200px" class="btn btn-primary btn-width" id="nextb" type="button">Suivant </button>'+
        '</td></tr>');
      if((nbitem + 50) >= count){
        document.getElementById("nextb").disabled = true;
      }
      if(nbitem <= 0 ){
        document.getElementById("previousb").disabled = true;
      }
    };
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        if (itemstart < nbitem) {
          itemstart = nbitem;
          cursor.advance(nbitem);
        } else {
          var itemInfo = {
            serial:cursor.value.serialno,
            itemid:cursor.value.itemid,
            serialid:cursor.value.itemserialid,
            qte:cursor.value.qtyonhand,
            key:cursor.key
          }
          if (active) {
            if (cursor.value.isactive == 1) {
              if (itemcpt < 50) {
                getItemCode(itemInfo).then(function(codereturn){
                  getItemDescr(itemInfo).then(function(descrreturn){
                    $('#tblsearchitems tbody').append(
                      '<tr id="'+itemInfo.key+'" onclick="openItemSerial('+itemInfo.key+');" >'+
                      '<td align="center" class="col-xs-2">'+itemInfo.serial+'</td>'+
                      '<td align="center" class="col-xs-2">'+codereturn+'</td>'+
                      '<td align="left" class="col-xs-5">'+descrreturn+'</td>'+
                      '<td align="center" class="col-xs-2">'+itemInfo.qte+'</td>'+
                      '<td align="center" class="col-xs-1">Oui</td></tr>');
                  });
                });
                itemcpt = itemcpt + 1;
                cursor.continue();
              }
            }
          } else {
            if (cursor.value.isactive == 1){
              ouiNon = "Oui";
            } else{
             ouiNon = "Non";
            }
            if (itemcpt < 50) {
              getItemCode(itemInfo).then(function(codereturn){
                getItemDescr(itemInfo).then(function(descrreturn){
                  $('#tblsearchitems tbody').append(
                    '<tr id="'+itemInfo.key+'" onclick="openItemSerial('+itemInfo.key+');" >'+
                    '<td align="center" class="col-xs-2">'+itemInfo.serial+'</td>'+
                    '<td align="center" class="col-xs-2">'+codereturn+'</td>'+
                    '<td align="left" class="col-xs-5">'+descrreturn+'</td>'+
                    '<td align="center" class="col-xs-2">'+itemInfo.qte+'</td>'+
                    '<td align="center" class="col-xs-1">'+ouiNon+'</td></tr>');
                });
              });
              itemcpt = itemcpt + 1;
              cursor.continue();
            }
          }
        }
      }
    };
  };
}

function readSerialByItem(id) {
  if (id == 0){
    var cookieValue = $.cookie("byitemid");
    var itemid = parseInt(cookieValue);
  } else {
    var itemid = id;
  }
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var active = document.getElementById("factifslm").checked;
    var ouiNon = "Oui";
    $('#tblsearchitems tbody').empty();
    $('#tblsearchitems tfoot').empty();
    var db = event.target.result
    .transaction(["itemserial"], "readonly")
    .objectStore("itemserial");
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        if (cursor.value.itemid == itemid) {
          var itemInfo = {
            serial:cursor.value.serialno,
            itemid:cursor.value.itemid,
            serialid:cursor.value.itemserialid,
            qte:cursor.value.qtyonhand,
            key:cursor.key
          }
          if (active) {
            if (cursor.value.isactive == 1) {
              getItemCode(itemInfo).then(function(codereturn){
                getItemDescr(itemInfo).then(function(descrreturn){
                  $('#tblsearchitems tbody').append(
                    '<tr id="'+itemInfo.key+'" onclick="openItemSerial('+itemInfo.key+');" >'+
                    '<td align="center" class="col-xs-2">'+itemInfo.serial+'</td>'+
                    '<td align="center" class="col-xs-2">'+codereturn+'</td>'+
                    '<td align="left" class="col-xs-5">'+descrreturn+'</td>'+
                    '<td align="center" class="col-xs-2">'+itemInfo.qte+'</td>'+
                    '<td align="center" class="col-xs-1">Oui</td></tr>');
                });
              });
            }
          } else {
            if (cursor.value.isactive == 1){
              ouiNon = "Oui";
            } else{
             ouiNon = "Non";
            }
            getItemCode(itemInfo).then(function(codereturn){
              getItemDescr(itemInfo).then(function(descrreturn){
                $('#tblsearchitems tbody').append(
                  '<tr id="'+itemInfo.key+'" onclick="openItemSerial('+itemInfo.key+');" >'+
                  '<td align="center" class="col-xs-2">'+itemInfo.serial+'</td>'+
                  '<td align="center" class="col-xs-2">'+codereturn+'</td>'+
                  '<td align="left" class="col-xs-5">'+descrreturn+'</td>'+
                  '<td align="center" class="col-xs-2">'+itemInfo.qte+'</td>'+
                  '<td align="center" class="col-xs-1">'+ouiNon+'</td></tr>');
              });
            });
          }
        }
        cursor.continue();
      }
    };
  };
}

function loadSite(siteid){
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var selected = "";
    var fsite = $('#fsite',window.parent.document);
    fsite.empty();
    fsite.append('<option value="0"></option>');
    var db = event.target.result
    .transaction("sites", "readwrite")
    .objectStore("sites");
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        if (cursor.key == siteid){
          selected = "SELECTED";
        } else {
          selected = "";
        }
        fsite.append('<option value="'+cursor.key+'" '+selected+'>'+cursor.value.name+'</option>');
        cursor.continue();
      }
    };
  };
}

function loadLoc(siteID, locID){
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var selected = "";
    var floc = $('#floc',window.parent.document);
    floc.empty();
    floc.append('<option value="0"></option>');
    var db = event.target.result
    .transaction("locations", "readwrite")
    .objectStore("locations");
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        if (cursor.value.siteid == siteID) {
          if (cursor.key == locID){
            selected = "SELECTED";
          } else {
            selected = "";
          }
          floc.append('<option value="'+cursor.key+'" '+selected+'>'+cursor.value.Name+'</option>');
        }
        cursor.continue();
      }
    };
  };
}
//ajout d'un item
function addItem() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var item = document.getElementById("fitemid").value;
    var serial = document.getElementById("fserial").value;
    var site = document.getElementById("fsite").value;
    var location = document.getElementById("floc").value;
    var qte = document.getElementById("fqte").value;
    var active = document.getElementById("fitemactif").checked;
    if (active) {
      var actif = 1;
    } else {
      var actif = 0;
    }
    if (item != "" && serial != "" && site != 0 && location != 0 && qte != ""){
      var db = event.target.result.transaction(["itemserial"], "readwrite")
      .objectStore("itemserial")
      .add({ itemid: parseInt(item), serialno: serial, isactive: parseInt(actif), siteid: parseInt(site), locid: parseInt(location), qtyonhand: parseInt(qte)});
      db.onsuccess = function(event) {
         alert(serial + " added to your database.");
         addAdd(event.target.result, "itemserial", serial).then(function(modif){
           openSearchItemSerial(false);
         });
      };

      db.onerror = function(event) {
         alert("Error");
      };
    } else {
      alert("Missing field(s)");
    }
  };
}

function updateItem() {
  var cookieValue = $.cookie("serialid");
  var itemserial = parseInt(cookieValue);
  cookieValue = $.cookie("name");
  var name = cookieValue;
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var site = parseInt(document.getElementById("fsite").value);
    var location = parseInt(document.getElementById("floc").value);
    var qte = parseInt(document.getElementById("fqte").value);
    var active = document.getElementById("fitemactif").checked;
    if (active) {
      var actif = 1;
    } else {
      var actif = 0;
    }
    var db = event.target.result.transaction(["itemserial"], "readwrite")
    .objectStore("itemserial");
    var getItem = db.get(itemserial);

    getItem.onsuccess = function() {
      var data = getItem.result;
      data.isactive = actif;
      data.siteid = site;
      data.locid = location;
      data.qtyonhand = qte;
      var updatedItem = db.put(data);
      alert(data.serialno + " has been updated to your database.");

      addModif("siteid",itemserial,String(site),"itemserial", name).then(function(modif){
        addModif("locid",itemserial,String(location),"itemserial", name).then(function(modif){
          addModif("qtyonhand",itemserial,String(qte),"itemserial", name).then(function(modif){
            addModif("isactive",itemserial,String(actif),"itemserial", name).then(function(modif){
              openSearchItemSerial(false);
            });
          });
        });
      });
    };
    getItem.onerror = function(event) {
       alert("Unable to update this item! ");
    };
  };
}

//delete un item
function remove() {
  if (confirm("Are you sure you want to delete this serial number?")){
    var cookieValue = $.cookie("serialid");
    var item = parseInt(cookieValue);
    cookieValue = $.cookie("name");
    var name = cookieValue;
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result.transaction(["itemserial"], "readwrite")
      .objectStore("itemserial")
      .delete(item);
      db.onsuccess = function(event) {
        alert(db.result.serialno);
        alert("Serial number deleted");
        addDel(item,"itemserial",name).then(function(modif){
          openSearchItemSerial(false);
        });
      };
    };
  }
}

function readInfoItem() {
  var cookieValue = $.cookie("serialid");
  var item = parseInt(cookieValue);
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    //var x = document.getElementById("fitem").value;
    if(item == 0) {
      loadSite(0);
      $('#fsite').on('change', function() {
        loadLoc( this.value, 0 );
      });
      $('#fitem').on('change', function() {
        checkCode( this.value );
      });
      $('#addLine').append(
        '<tr><td colspan="6" align="center">'+
        '<button onclick="addItem()" class="btn btn-primary" type="button">Ajouter item</button></td></tr>');
    } else {
      var db = event.target.result
      .transaction("itemserial", "readwrite")
      .objectStore("itemserial");
      var getItem = db.get(item);
      var getKey = db.getKey(item);
      getItem.onsuccess = function() {
        getKey.onsuccess = function() {
          var itemInfo = {
            isactive:getItem.result.isactive,
            serial:getItem.result.serialno,
            itemid:getItem.result.itemid,
            serialid:getItem.result.itemserialid,
            qte:getItem.result.qtyonhand,
            siteid:getItem.result.siteid,
            locid:getItem.result.locid,
            key:getKey.result
          }
          var isActive = itemInfo.isactive;
          if(isActive == 1){
            isActive = true;
          } else {
            isActive = false;
          }
          $.cookie("name", itemInfo.serial);
          getItemCode(itemInfo).then(function(codereturn){
            $('#fitem').val(codereturn);
            $('#fitem').prop('disabled', true);
          });
          $('#fserial').val(itemInfo.serial);
          $('#fserial').prop('disabled', true);
          $('#fitemactif').prop('checked', isActive);
          $('#fqte').val(itemInfo.qte);
          $('#addLine').append(
            '<tr><td colspan="6" align="center">'+
            '<button onclick="updateItem();" class="btn btn-primary" type="button">Modifier item</button>'+
            ' &nbsp<button onclick="remove();" class="btn btn-primary" type="button">Supprimer</button>'+
            '</td></tr>');
          loadSite(itemInfo.siteid);
          $('#fsite').on('change', function() {
            loadLoc( this.value, 0 );
          });
          loadLoc(itemInfo.siteid, itemInfo.locid);
        };
      };
    }
  };
}

function checkCode(itemcode){
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result
    .transaction("items", "readwrite")
    .objectStore("items")
    .index("by_itemcode");
    var getItem = db.get(itemcode);
    var getKey = db.getKey(itemcode);
    getItem.onsuccess = function() {
      getKey.onsuccess = function() {
        if (getItem.result) {
        $('#fitemid').val(getKey.result);
        } else {
          alert("This serial number does not exist");
          $('#fitem').val("");
          $('#fitem').focus();
        }
      };
    };
  };
}
