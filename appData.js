let colNames = [];
let orig_data = [];
let data = [];
let filterData = [];
let gridObj;
let table = document.getElementById('table-content');
let hideButton = document.getElementById('toggle_button');
let displayTable = true;

/*
  control the display of the table
*/
let tableToggle = function () {
  if (displayTable) {
    hideButton.innerHTML = 'display table';
    table.style.display = 'none';
    displayTable = false;
  } else {
    hideButton.innerHTML = 'hide table';
    table.style.display = 'block';
    displayTable = true;
  }
};

/*
  Load the JSON file
*/
let getJSON = function (url, successHandler, errorHandler) {
  var xhr =
    typeof XMLHttpRequest != 'undefined'
      ? new XMLHttpRequest()
      : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('get', url, true);
  xhr.onreadystatechange = function () {
    var status;
    var data;
    if (xhr.readyState == 4) {
      status = xhr.status;
      if (status == 200) {
        data = JSON.parse(xhr.responseText);
        successHandler && successHandler(data);
      } else {
        errorHandler && errorHandler(status);
      }
    }
  };
  xhr.send();
};

/*
  tranform an object array to a 2d array for display
*/
let getContent = function (items) {
  let ret = [];
  items.forEach((element) => {
    let record = [];
    for (let key of Object.keys(element)) {
      record.push(element[key]);
    }
    ret.push(record);
  });
  return ret;
};

/*
  filter data function
*/
let filter = function () {
  new Promise((resolve, reject) => {
    let country = document.getElementById('country-options').value;
    let colName = document.getElementById('filter-options').value;
    let value = document.getElementById('filter-val').value;
    let ret = [];
    if (colName !== 'none' || country != 'none') {
      pMarkers.forEach((maker) => {
        maker.visible = false;
      });
      for (let i = 0; i < data.length; i++) {
        if (
          (country === 'none' ||
            data[i][colNames.indexOf('country')] === country) &&
          (colName === 'none' ||
            data[i][colNames.indexOf(colName)].toString() === value)
        ) {
          ret.push(data[i]);
          pMarkers[i].visible = true;
        }
      }
      renderer.render(container);
      resolve(ret);
    } else {
      pMarkers.forEach((maker) => {
        maker.visible = true;
      });
      renderer.render(container);
      resolve(data);
    }
  }).then((data) => {
    filterData = data;
    refresh();
  });
};

/*
  reload the table using filtered data as input
*/
let refresh = function () {
  gridObj
    .updateConfig({
      columns: colNames,
      data: filterData,
      pagination: {
        enabled: true,
        limit: 5,
        summary: false,
      },
      sort: true,
      search: {
        enabled: true,
      },
    })
    .forceRender();
};
