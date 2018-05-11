//sort un item selon le code
var cptitemsite = 0;
var itemsiteids = [];
var nbitem = 0;
var count = 0
var locLine = 0;

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

function readItem() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    $('#tblsearchitems tbody').empty();
    $('#tblsearchitems tfoot').empty();
    var x = document.getElementById("fitem").value;
    var active = document.getElementById("factifslm").checked;
    var db = event.target.result
    .transaction("items", "readwrite")
    .objectStore("items")
    .index("by_itemcode");
    var getItem = db.get(x);
    var getKey = db.getKey(x);

    getItem.onsuccess = function() {
      getKey.onsuccess = function() {
        if (getItem.result) {
          var itemInfo = {
            name:getItem.result.descr,
            id:getItem.result.itemid,
            code:getItem.result.itemcode,
            key:getKey.result
          }
          if (active) {
            if (getItem.result.isActive == 1) {
              checkIsSerial(itemInfo).then(function(serialreturn){
                isserial = serialreturn;
                if (isserial) {
                  getqteserial(itemInfo).then(function(qtereturn){
                    $('#tblsearchitems tbody').append(
                      '<tr id="'+itemInfo.key+'" onclick="openSearchItemSerial('+true+','+itemInfo.key+');" >'+
                      '<td align="center" class="col-xs-3">'+itemInfo.code+'</td>'+
                      '<td align="left" class="col-xs-6">'+itemInfo.name+'</td>'+
                      '<td align="center" class="col-xs-2">'+qtereturn+'</td>'+
                      '<td align="center" class="col-xs-1">Oui</td></tr>');
                  });
                } else {
                  getqte(itemInfo).then(function(qtereturn){
                    $('#tblsearchitems tbody').append(
                      '<tr id="'+itemInfo.key+'" onclick="openItem('+itemInfo.key+');" >'+
                      '<td align="center" class="col-xs-3">'+itemInfo.code+'</td>'+
                      '<td align="left" class="col-xs-6">'+itemInfo.name+'</td>'+
                      '<td align="center" class="col-xs-2">'+qtereturn+'</td>'+
                      '<td align="center" class="col-xs-1">Oui</td></tr>');
                  });
                }
              });
            }
          } else {
            checkIsSerial(itemInfo).then(function(serialreturn){
              isserial = serialreturn;
              if (isserial) {
                getqteserial(itemInfo).then(function(qtereturn){
                  $('#tblsearchitems tbody').append(
                    '<tr id="'+itemInfo.key+'" onclick="openSearchItemSerial('+true+','+itemInfo.key+');" >'+
                    '<td align="center" class="col-xs-3">'+itemInfo.code+'</td>'+
                    '<td align="left" class="col-xs-6">'+itemInfo.name+'</td>'+
                    '<td align="center" class="col-xs-2">'+qtereturn+'</td>'+
                    '<td align="center" class="col-xs-1">Non</td></tr>');
                });
              } else {
                getqte(itemInfo).then(function(qtereturn){
                  $('#tblsearchitems tbody').append(
                    '<tr id="'+itemInfo.key+'" onclick="openItem('+itemInfo.key+');" >'+
                    '<td align="center" class="col-xs-3">'+itemInfo.code+'</td>'+
                    '<td align="left" class="col-xs-6">'+itemInfo.name+'</td>'+
                    '<td align="center" class="col-xs-2">'+qtereturn+'</td>'+
                    '<td align="center" class="col-xs-1">Non</td></tr>');
                });
              }
            });
          }
        } else {
          alert("Aucun item trouvé");
        }
      };
    };
  };
}
//sort tout les items et tris si seulement actif est coché
//function getqte ne fonctionne pas pour l'instant
function readAllItems() {
  var itemcpt = 0;
  var itemstart = 0;
  var qtereturn = 0;
  var isserial = false;
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var active = document.getElementById("factifslm").checked;
    var ouiNon = "Oui";
    $('#tblsearchitems tbody').empty();
    $('#tblsearchitems tfoot').empty();
    var db = event.target.result
    .transaction(["items"], "readonly")
    .objectStore("items");
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
            name:cursor.value.descr,
            id:cursor.value.itemid,
            code:cursor.value.itemcode,
            key:cursor.key
          }
          if (active) {
            if (cursor.value.isActive == 1) {
              if (itemcpt < 50) {
                checkIsSerial(itemInfo).then(function(serialreturn){
                  isserial = serialreturn;
                  if (isserial) {
                    getqteserial(itemInfo).then(function(qtereturn){
                      $('#tblsearchitems tbody').append(
                        '<tr id="'+itemInfo.key+'" onclick="openSearchItemSerial('+true+','+itemInfo.key+');" >'+
                        '<td align="center" class="col-xs-3">'+itemInfo.code+'</td>'+
                        '<td align="left" class="col-xs-6">'+itemInfo.name+'</td>'+
                        '<td align="center" class="col-xs-2">'+qtereturn+'</td>'+
                        '<td align="center" class="col-xs-1">'+ouiNon+'</td></tr>');
                    });
                  } else {
                    getqte(itemInfo).then(function(qtereturn){
                      $('#tblsearchitems tbody').append(
                        '<tr id="'+itemInfo.key+'" onclick="openItem('+itemInfo.key+');" >'+
                        '<td align="center" class="col-xs-3">'+itemInfo.code+'</td>'+
                        '<td align="left" class="col-xs-6">'+itemInfo.name+'</td>'+
                        '<td align="center" class="col-xs-2">'+qtereturn+'</td>'+
                        '<td align="center" class="col-xs-1">'+ouiNon+'</td></tr>');
                    });
                  }
                });
                itemcpt = itemcpt + 1;
                cursor.continue();
              }
            }
          } else {
            if (cursor.value.isActive == 1){
              ouiNon = "Oui";
            } else{
             ouiNon = "Non";
            }
            if (itemcpt < 50) {
              checkIsSerial(itemInfo).then(function(serialreturn){
                isserial = serialreturn;
                if (isserial){
                  getqteserial(itemInfo).then(function(qtereturn){
                    $('#tblsearchitems tbody').append(
                      '<tr id="'+itemInfo.key+'" onclick="openSearchItemSerial('+true+','+itemInfo.key+');" >'+
                      '<td align="center" class="col-xs-3">'+itemInfo.code+'</td>'+
                      '<td align="left" class="col-xs-6">'+itemInfo.name+'</td>'+
                      '<td align="center" class="col-xs-2">'+qtereturn+'</td>'+
                      '<td align="center" class="col-xs-1">'+ouiNon+'</td></tr>');
                  });
                } else {
                  getqte(itemInfo).then(function(qtereturn){
                    $('#tblsearchitems tbody').append(
                      '<tr id="'+itemInfo.key+'" onclick="openItem('+itemInfo.key+');" >'+
                      '<td align="center" class="col-xs-3">'+itemInfo.code+'</td>'+
                      '<td align="left" class="col-xs-6">'+itemInfo.name+'</td>'+
                      '<td align="center" class="col-xs-2">'+qtereturn+'</td>'+
                      '<td align="center" class="col-xs-1">'+ouiNon+'</td></tr>');
                  });
                }
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

function checkIsSerial(object){
  var id = object.id;
  var qte = 0;
  return new Promise(function(resolve,reject){
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result
      .transaction(["itemserial"], "readonly")
      .objectStore("itemserial")
      .index("by_itemid")
      .get(id);
      db.onsuccess = function(){
        if (db.result) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
    };
    request.onerror = function(event){
      reject(request.error);
    };
  });
}

//Load les combobox du add items
function loadAdd(uom) {
  var selecteduom;
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var fuom = $('#fuom',window.parent.document);
    fuom.empty();
    fuom.append('<option value="0"></option>');
    db = event.target.result
    .transaction("uom", "readwrite")
    .objectStore("uom");
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        if(uom == cursor.key){
          selecteduom = "Selected";
        } else {
          selecteduom = "";
        }
        fuom.append('<option value="'+cursor.key+'" '+selecteduom+'>'+cursor.value.name+'</option>');
        cursor.continue();
      }
    };
  };
}
//ajout d'un item
function addItem() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var code = document.getElementById("fitemcode").value;
    var descr = document.getElementById("fitemdescr").value;
    var active = document.getElementById("fitemactif").checked;
    if (active) {
      var actif = 1;
    } else {
      var actif = 0;
    }
    var uom = document.getElementById("fuom").value;
    if (code != "" && descr != ""){
      var db = event.target.result.transaction(["items"], "readwrite")
      .objectStore("items");
      var getItemCode = db.index("by_itemcode").get(code);
      getItemCode.onsuccess = function() {
        if (getItemCode.result) {
          alert("Ce code existe déjà");
        } else {
          var addItem = db.add({ itemcode: code, descr: descr, isActive: parseInt(actif), uomid: parseInt(uom)});
          addItem.onsuccess = function(event) {
             alert(code + " has been added to your database.");
             addAdd(event.target.result,"items").then(function(modif){
               openSearchItem();
             });
           }
         }
        db.onerror = function(event) {
          alert("Erreur");
        };
      };
    } else {
      alert("Données manquantes");
    }
  };
}

function updateItem() {
  var cookieValue = $.cookie("itemid");
  var item = parseInt(cookieValue);
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var code = document.getElementById("fitemcode").value;
    var descr = document.getElementById("fitemdescr").value;
    var active = document.getElementById("fitemactif").checked;
    if (active) {
      var actif = 1;
    } else {
      var actif = 0;
    }
    var uom = document.getElementById("fuom").value;
    var db = event.target.result.transaction(["items"], "readwrite")
    .objectStore("items");
    var getItem = db.get(item);

    getItem.onsuccess = function() {
      var data = getItem.result;
      data.itemcode = code;
      data.descr = descr;
      data.isActive = actif;
      data.uomid = uom;
      var updatedItem = db.put(data);
      alert(code + " has been updated to your database.");
      addModif("itemcode",item,String(code),"items").then(function(modif){
        addModif("descr",item,String(descr),"items").then(function(modif){
          addModif("uom",item,String(uom),"items").then(function(modif){
            addModif("isactive",item,String(actif),"items").then(function(modif){
              openSearchItem();
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

function updateloc(){
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    itemsiteids.forEach(function(id){
      var input = document.getElementById("loc"+id).value;
      var db = event.target.result.transaction(["itemsite"], "readwrite")
      .objectStore("itemsite");
      var getItemSite = db.get(id);
      getItemSite.onsuccess = function() {
        var data = getItemSite.result;
        data.qtyonhand = input;
        var updateItemSite = db.put(data);
        addModif("qtyonhand",id,String(input),"itemsite").then(function(modif){
          updateItem();
        });
      };
      db.onerror = function(event) {
         alert("Unable to update this itemsite! ");
      };
    });
  };
}

//delete un item
function remove() {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet item?")){
    var cookieValue = $.cookie("itemid");
    var item = parseInt(cookieValue);
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {

      itemsiteids.forEach(function(id){
        var db = event.target.result.transaction(["itemsite"], "readwrite")
        .objectStore("itemsite")
        .delete(id);
        db.onsuccess = function(event) {
          console.log("itemsiteid"+id+" deleted");
        };
      });

      var db = event.target.result.transaction(["items"], "readwrite")
      .objectStore("items")
      .delete(item);
      db.onsuccess = function(event) {
        addDel(item,"items").then(function(modif){
          getSerial(item);
        });
      };
    };
  }
}

function getSerial(itemid){
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result.transaction(["itemserial"], "readwrite")
    .objectStore("itemserial");
    db.openCursor().onsuccess = function(event){
      var cursor = event.target.result;
      if (cursor){
        if (cursor.value.itemid == itemid){
          removeSerial(cursor.key);
        }
        cursor.continue();
      } else {
        openSearchItem();
      }
    };
  };
}

function removeSerial(id){
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result.transaction(["itemserial"], "readwrite")
    .objectStore("itemserial")
    .delete(id);
    db.onsuccess = function(event) {
      console.log("itemserial"+id+" deleted");
    };
  };
}

function readInfoItem() {
  var cookieValue = $.cookie("itemid");
  var item = parseInt(cookieValue);
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    if(item == 0) {
      loadAdd(0);
      $('#addLine').append('<tr><td colspan="4" align="center">'+
      '<button onclick="addItem()" class="btn btn-primary" type="button">Ajouter item</button></td></tr>');
    } else {
      var db = event.target.result
      .transaction("items", "readwrite")
      .objectStore("items");
      var getItem = db.get(item);
      getItem.onsuccess = function() {
        var isActive = getItem.result.isActive;
        if(isActive == 1){
          isActive = true;
        } else {
          isActive = false;
        }
        $('#fitemcode').val(''+getItem.result.itemcode+'');
        $('#fitemdescr').val(''+getItem.result.descr+'');
        $('#fitemactif').prop('checked', isActive);
        loadAdd(getItem.result.uomid);
        $('#addLine').append(
          '<tr><td colspan="4" align="center">'+
          '<button onclick="updateloc();" class="btn btn-primary" type="button">Modifier item</button>'+
          ' &nbsp<button onclick="remove();" class="btn btn-primary" type="button">Supprimer</button>'+
          '</td></tr>');
        document.getElementById("tblinfoitemsite").style.display = "";
        loadLocLine();
        $('#fsite').on('change', function() {
          addLocLineLoc( this.value );
        });
        addLocLineSite();
      };
    }
  };
}

// function loadItem(item,isserial){
//   request = window.indexedDB.open("prextraDB",2);
//   request.onsuccess = function(event) {
//     if (isserial) {
//       openSearchItemSerial(true);
//     } else {
//       if(item == 0) {
//         loadAdd(0);
//         $('#addLine').append('<tr><td colspan="4" align="center">'+
//         '<button onclick="addItem()" class="btn btn-primary" type="button">Ajouter item</button></td></tr>');
//       } else {
//         var db = event.target.result
//         .transaction("items", "readwrite")
//         .objectStore("items");
//         var getItem = db.get(item);
//         getItem.onsuccess = function() {
//           var isActive = getItem.result.isActive;
//           if(isActive == 1){
//             isActive = true;
//           } else {
//             isActive = false;
//           }
//           $('#fitemcode').val(''+getItem.result.itemcode+'');
//           $('#fitemdescr').val(''+getItem.result.descr+'');
//           $('#fitemactif').prop('checked', isActive);
//           loadAdd(getItem.result.uomid);
//           $('#addLine').append(
//             '<tr><td colspan="4" align="center">'+
//             '<button onclick="updateloc();" class="btn btn-primary" type="button">Modifier item</button>'+
//             ' &nbsp<button onclick="remove();" class="btn btn-primary" type="button">Supprimer</button>'+
//             '</td></tr>');
//           document.getElementById("tblinfoitemsite").style.display = "";
//           loadLocLine();
//           $('#fsite').on('change', function() {
//             addLocLineLoc( this.value );
//           });
//           addLocLineSite();
//         };
//       }
//     }
//   };
// }

function loadLocLine() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var cookieValue = $.cookie("itemid");
    var item = parseInt(cookieValue);
    var db = event.target.result
    .transaction("itemsite", "readwrite")
    .objectStore("itemsite");
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        if (cursor.value.itemid == item) {
          var itemInfo = {
            itemsiteid:cursor.key,
            siteid:cursor.value.siteid,
            locid:cursor.value.locid,
            qte:cursor.value.qtyonhand
          }
          getSiteName(itemInfo).then(function(sitename){
            getLocName(itemInfo).then(function(locname){
              $('#locLine').append(
                '<tr>'+
                '<td align="center">'+sitename+'</td>'+
                '<td align="center">'+locname+'</td>'+
                '<td align="center"><input type="number" id="loc'+itemInfo.itemsiteid+'" value="'+itemInfo.qte+'" min="0"></td>'+
                '<td align="center"><button onclick="deleteLoc('+itemInfo.itemsiteid+')" class="btn btn-primary" type="button">Supprimer</button></tr>');
              cptitemsite = cptitemsite + 1;
              itemsiteids.push(itemInfo.itemsiteid);
            });
          });
        }
        cursor.continue();
      }
    };
  };
}

function deleteLoc(itemsiteid) {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result.transaction(["itemsite"], "readwrite")
    .objectStore("itemsite")
    .delete(itemsiteid);
    db.onsuccess = function(event) {
      $('#loc'+itemsiteid).remove();
    };
  };
}

function addLocLineSite(){
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var fsite = $('#fsite',window.parent.document);
    fsite.empty();
    fsite.append('<option value="0"></option>');
    var db = event.target.result
    .transaction("sites", "readwrite")
    .objectStore("sites");
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        fsite.append('<option value="'+cursor.key+'">'+cursor.value.name+'</option>');
        cursor.continue();
      }
    };
  };
}


function addLocLineLoc(siteID){
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
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
          floc.append('<option value="'+cursor.key+'">'+cursor.value.Name+'</option>');
        }
        cursor.continue();
      }
    };
  };
}

function addLoc() {
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var cookieValue = $.cookie("itemid");
    var item = parseInt(cookieValue);
    var site = document.getElementById("fsite").value;
    var loc = document.getElementById("floc").value;
    var qte = document.getElementById("fqte").value;
    if (site != 0 && loc != 0 && loc != "" && qte != "") {
      var db = event.target.result.transaction(["itemsite"], "readwrite")
      .objectStore("itemsite")
      .add({ itemid: parseInt(item), siteid: parseInt(site), locid: parseInt(loc), qtyonhand: parseInt(qte)});
      db.onsuccess = function(event) {
        addAdd(event.target.result,"itemsite").then(function(modif){
          document.getElementById("fsite").selectedIndex = "0";
          document.getElementById("floc").selectedIndex = "0";
          document.getElementById("fqte").value = 0;
          location.reload();
        });
      };
      db.onerror = function(event) {
         alert("Erreur");
      }

    } else {
      alert("données manquantes");
    }
  };
}
