


function ajaxItemsData(resolve,reject) {
//console.log("ajaxItems");
  $.ajax({
      type: "Post",
      url: "synchroBrowser/getItems.php",
      data: 'text',
      success: function(data){
        if(data)
        {
        //  console.log(data);
          resolve(JSON.parse(data));
        }
      },
      error: function(result)
      {
        console.log("error getting items");
      }
    });
}

function ajaxLocationsData(resolve,reject) {
//console.log("ajaxLocations");
  $.ajax({
      type: "Post",
      url: "synchroBrowser/getLocations.php",
      data: 'text',
      success: function(data){
        if(data)
        {
          resolve(JSON.parse(data));
        }
      },
      error: function(result)
      {
        console.log("error getting Locations");
      }
    });
}

function ajaxSitesData(resolve,reject) {
//console.log("ajaxSites");
  $.ajax({
      type: "Post",
      url: "synchroBrowser/getSites.php",
      data: 'text',
      success: function(data){
        if(data)
        {
          //console.log(data);
          resolve(JSON.parse(data));
        }
      },
      error: function(result)
      {
        console.log("error getting sites");
      }
    });
}
function ajaxCompaniesData(resolve,reject) {
//console.log("ajaxComapnies");
  $.ajax({
      type: "Post",
      url: "synchroBrowser/getCompanies.php",
      data: 'text',
      success: function(data){
        if(data)
        {
          //console.log(data);
          resolve(JSON.parse(data));
        }
      },
      error: function(result)
      {
        console.log("error getting comapnies");
      }
    });
}

function ajaxItemserialData(resolve,reject) {
//console.log("ajaxitemserial");
  $.ajax({
      type: "Post",
      url: "synchroBrowser/getItemserial.php",
      data: 'text',
      success: function(data){
        if(data)
        {
        //  console.log(data);
          resolve(JSON.parse(data));
        }
      },
      error: function(result)
      {
        console.log("error getting itemserials");
      }
    });
}

function ajaxItemsiteData(resolve,reject) {
//console.log("ajaxitemsite");
  $.ajax({
      type: "Post",
      url: "synchroBrowser/getItemsite.php",
      data: 'text',
      success: function(data){
        if(data)
        {
          //console.log(data);
          resolve(JSON.parse(data));
        }
      },
      error: function(result)
      {
        console.log("error getting itemsite");
      }
    });
}

function ajaxUomData(resolve,reject) {
//console.log("ajaxitemsite");
  $.ajax({
      type: "Post",
      url: "synchroBrowser/getUom.php",
      data: 'text',
      success: function(data){
        if(data)
        {
          //console.log(data);
          resolve(JSON.parse(data));
        }
      },
      error: function(result)
      {
        console.log("error getting uom");
      }
    });
}
