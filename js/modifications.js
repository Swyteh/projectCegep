var modif = 'modifications';
var newdata = 'newdata';
function openModifs() {
  windowItem = window.open("modifications.html", "_blank", "width=700,height=500,menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
}
var tableStructure = {
  "sites":
    ["cieid","name","sitecode"],
  "locations":
    ["cieid","Name","isdefault","locCode","siteid"],
  "items":
    ["cieid","descr","isActive","isserialno","isserialnoqty","itemcode","locid","siteid","uomid"],
  "itemserial":
    ["cieid","itemid","isActive","locid","qtyonhand","serialno","siteid"]
  }


function showAdd() {
  console.log();
  var table;
  var request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    $('#tblajout tbody').empty();
    var db = request.result
    .transaction("newdata", "readwrite")
    .objectStore("newdata")
    db.openCursor().onsuccess = function(event) {

      var cursor = event.target.result;
      if (cursor){
        var newdataInfo = {
          tablename:cursor.value.tablename,
          id:cursor.value.addid,
          key:cursor.key
        }

        table =     '<tr id="'+newdataInfo.key+'" >';
        table +=      '<td align="center">'+newdataInfo.id+'</td>';
        table +=      '<td align="center">'+newdataInfo.tablename+'</td>';
        table +=      '<td align="center">'+newdataInfo.tablename+'PH' + '</td>';

        table +=      '<td><a onclick="removeAdd('+newdataInfo.key+');"  class="btn btn-primary btn-width" type="button">Delete</a></td>';


        table +=    '</tr>';
        $('#tblajout tbody').append(table);


        cursor.continue();

      }
    };

    db.openCursor().onerror = function(event) {
      alert("error noob");
      console.log(event);
    };

  }
}
function showDel() {
  console.log();
  var table;
  var request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    $('#tbldelete tbody').empty();
    var db = request.result
    .transaction("deldata", "readwrite")
    .objectStore("deldata")
    db.openCursor().onsuccess = function(event) {

      var cursor = event.target.result;
      if (cursor){
        var newdataInfo = {
          tablename:cursor.value.tablename,
          id:cursor.value.delid ,
          key:cursor.key
        }

        table =     '<tr id="'+newdataInfo.key+'" >';
        table +=      '<td align="center">'+newdataInfo.id+'</td>';
        table +=      '<td align="center">'+newdataInfo.tablename+'</td>';
        table +=      '<td><a onclick="removeDel('+newdataInfo.key+');"  class="btn btn-primary btn-width" type="button">Delete</a></td>';

        table +=    '</tr>';
        $('#tbldelete tbody').append(table);
        cursor.continue();
      }
    };

    db.openCursor().onerror = function(event) {
      alert("error noob");
      console.log(event);
    };

  }
}
function showModifs() {

  var table;
  var request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    $('#tblsearchitems tbody').empty();
    var db = request.result
    .transaction("modifications", "readwrite")
    .objectStore("modifications")
    db.openCursor().onsuccess = function(event) {

      var cursor = event.target.result;
      if (cursor){
        var modifInfo = {
          tablename:cursor.value.name,
          field:cursor.value.field,
          id:cursor.value.id,
          oldvalue:cursor.value.oldvalue,
          newvalue:cursor.value.newvalue,
          key:cursor.key
        }
        //getCompanyName(modifInfo).then(function(ciename){

        //  console.log(siteInfo);
        table =     '<tr id="'+cursor.key+'" >';
        //table +=      '<td align="center">'+cursor.value.id+'</td>';
        table +=      '<td align="center">'+cursor.value.tablename+'</td>';
        table +=      '<td align="center">'+cursor.value.field+'</td>';
        table +=      '<td align="center">'+cursor.value.oldvalue+'</td>';
        table +=      '<td align="center">'+cursor.value.newvalue+'</td>';
        table +=      '<td align="center"><button onclick="removeModif('+cursor.key+');" class="btn btn-primary btn-width" type="button">Delete</td>';

        table +=    '</tr>';
        $('#tblsearchitems tbody').append(table);

        //  });


        cursor.continue();

      }
    };

    db.openCursor().onerror = function(event) {
      alert("error noob");
      console.log(event);
    };

  }
  showAdd();
  showDel();
}
function removeModif(id) {
  if (confirm('Voulez-vous vraiment supprimer cette modification?')) {
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result.transaction(["modifications"], "readwrite")
      .objectStore("modifications")
      .delete(id);
      db.onsuccess = function(event) {
        showModifs();
      };
    };
  }
}

function removeAdd(id) {
  if (confirm('Voulez-vous vraiment supprimer cet ajout?')) {
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result.transaction(["newdata"], "readwrite")
      .objectStore("newdata")
      .delete(id);
      db.onsuccess = function(event) {
        showModifs();
      };
    };
  }
}
function removeDel(id) {
  if (confirm('Voulez-vous vraiment annuler cet action?')) {
    request = window.indexedDB.open("prextraDB",2);
    request.onsuccess = function(event) {
      var db = event.target.result.transaction(["deldata"], "readwrite")
      .objectStore("deldata")
      .delete(id);
      db.onsuccess = function(event) {
        showModifs();
      };
    };
  }
}
function endSync(){
  //alert('oh man');
  endSyncAjouts();
  endSyncDel();
  var tablename;
  var tdid = 1;
  var id;
  var field;
  var value;
  var tableid;
  var request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = request.result
    .transaction("modifications", "readwrite")
    .objectStore("modifications")
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor){
        //  console.log(siteInfo);
        tablename = cursor.value.tablename;
        id = cursor.value.id;
        field = cursor.value.field;
        value = cursor.value.newvalue;

        switch(tablename) {
          case "sites":
          tableid = "siteid";
          break;
          case "items":
          tableid = "siteid";
          break;
          case "locations":
          tableid = "locid";
          break;
          case "companies":
          tableid = "cieid";
          break;

          default:
          tableid = "error";

        }

        console.log("Update " + tablename + " set " + field + " = '" + value + "' where " + tableid + " = " + id);

        $.ajax({

          //alert('ajax');
          type: "POST",
          url: 'synchroBrowser/modifications.php',
          dataType: 'json',
          data: {tablename:tablename, field:field, value:value, tableid:tableid, id:id},

          success: function (data) {
            if (data.state == 1 && alertMsg == true){
              var x = document.getElementById("tblsearchitems").getElementsByTagName("tr");
              x[tdid].style.backgroundColor = "#00cc00";
              tdid += 1;

            }
            if (data.state == 0){
              alert("Erreur");
            }
          }
        });
        cursor.continue();

      }
      else{
        console.log("finished");
      }

    };
    db.openCursor().onerror = function(event) {
      alert("error noob");
      console.log(event);
    };

  };
}
function endSyncAjouts(){
  var tables=[];
  var addids=[];
  var tablename;
  var tdid = 1;
  var addid;
  var fields;
  var request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = request.result
    .transaction("newdata", "readwrite")
    .objectStore("newdata")
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor){
        //  console.log(siteInfo);
        tables.push(cursor.value.tablename);
        addids.push(cursor.value.addid);
        tablename = cursor.value.tablename;
        console.log(tablename);
        addid = cursor.value.addid;
        //CHECKER POUR QUE SA FASSE PAS LOCATIONS 2 FOIS
        getAddTableFields(tablename,addid).then(function(object){
          console.log(object.string + " " + object.tablename)
          switch(object.tablename) {
            case "sites":
            fields = "(cieid,name,sitecode)";
            break;
            case "items":
            fields = "(cieid,descr,isActive,isserialno,isserialnoqty,itemcode,locid,siteid,uomid)";
            break;
            case "locations":
            fields = "(cieid,Name,isdefault,locCode,siteid)";
            break;
            case "itemserial":
            fields = "(cieid,itemid,isActive,locid,qtyonhand,serialno,siteid)";
            break;
            default:
            tableid = "error";
          }
          //  console.log(values + " " + currentTableName + " " + fields);

            $.ajax({
              //alert('ajax');
              type: "POST",
              url: 'synchroBrowser/ajouts.php',
              dataType: 'json',
              data: {tablename:object.tablename, fields:fields, values:object.string},
              success: function (data) {
                if (data.state == 1) {
                  //alert("OKAYYYYY");
                  var x = document.getElementById("tblajout").getElementsByTagName("tr");
                  x[tdid].style.backgroundColor = "#00cc00";
                  tdid += 1;

                }
                else{
                  console.log(data.state);
                  console.log(data.query);
                }
              }
            });
        });
        cursor.continue();

      }
    };
    db.openCursor().onerror = function(event) {
      alert("error noob");
      console.log(event);
    };
  };

}

function getAddTableFields(tablename,addid)
{
  return new Promise(function(resolve,reject){
  request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = event.target.result
    .transaction(tablename, "readwrite")
    .objectStore(tablename);
    var getData = db.get(parseInt(addid));
    getData.onsuccess = function() {
        if (getData.result) {
          var arrayValue=[];
          for(var fieldNameIndex in tableStructure[tablename]){
            var fieldName = tableStructure[tablename][fieldNameIndex];
            //console.log(fieldName);
            arrayValue.push("'"+getData.result[fieldName]+"'")
          }
          var string = arrayValue.join(",");
          string = "(" + string + ")";
          var object = {
            string:string,
            tablename:tablename
          }
          resolve(object);
      }
    };
  };
});
}
function endSyncDel(){
  var tablename;
  var delid;
  var fields;
  var tdid = 1;

  var request = window.indexedDB.open("prextraDB",2);
  request.onsuccess = function(event) {
    var db = request.result
    .transaction("deldata", "readwrite")
    .objectStore("deldata")
    db.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor){
        //  console.log(siteInfo);
        tablename = cursor.value.tablename;
        console.log(tablename);
        delid = cursor.value.delid;
        switch(tablename) {
          case "sites":
          fields = "siteid";
          break;
          case "items":
          fields = "itemid";
          break;
          case "locations":
          fields = "locid";
          break;
          case "itemserial":
          fields = "itemserialid";
          break;
          default:
          tableid = "error";
        }
        $.ajax({
          //alert('ajax');
          type: "POST",
          url: 'synchroBrowser/delete.php',
          dataType: 'json',
          data: {tablename:tablename, fields:fields, values:delid},
          success: function (data) {
            if (data.state == 1) {
              var x = document.getElementById("tbldelete").getElementsByTagName("tr");
              x[tdid].style.backgroundColor = "#00cc00";
              tdid += 1;

            }
            else{
              var x = document.getElementById("tbldelete").getElementsByTagName("tr");
              x[tdid].style.backgroundColor = "#f44242";
              tdid += 1;
              console.log(data.state);
              console.log(data.query);
            }
          }
        });
        cursor.continue();

      }
    };
    db.openCursor().onerror = function(event) {
      alert("error noob");
      console.log(event);
    };
  };

}
