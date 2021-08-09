let colNames = [];
let orig_data = [];
let data = [];
let filterData = [];
let gridObj;

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

getJSON('./data/output.json', function (markers) {
  colNames = Object.keys(markers[0]);
  orig_data = markers;
  data = getContent(markers);
  filterData = data;
  colNames.forEach((elem) => {
    let option = document.createElement('option');
    option.value = elem;
    option.text = elem;
    document.getElementById('filter-options').appendChild(option);
  });
  gridObj = new gridjs.Grid({
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
  });
  gridObj.render(document.getElementById('inner_table'));
});

// tranform objects array to array array
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

let filter = function () {
  new Promise((resolve, reject) => {
    console.log('filter');
    let colName = document.getElementById('filter-options').value;
    let value = document.getElementById('filter-val').value;
    let ret = [];
    if (colName !== 'none') {
      orig_data.forEach((record) => {
        if (record[colName].toString() === value) {
          ret.push(record);
        }
      });
      let nData = getContent(ret);
      console.log(nData[1]);
      resolve(nData);
    } else {
      resolve(data);
    }
  }).then((data) => {
    filterData = data;
    refresh();
  });
};

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
