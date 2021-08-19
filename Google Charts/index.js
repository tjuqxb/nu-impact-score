var data_arr = [['Country', 'Impact Score']]

fetch('./MOCK_DATA.json')
  .then(response => response.json())
  .then(obj => {
    console.log(obj)

    for (i in obj) {
      data_arr.push([obj[i].location, obj[i].i_score])
    }

    console.log(data_arr[10]);

    google.charts.load('current', {
      'packages': ['geochart'],
    });
    google.charts.setOnLoadCallback(drawRegionsMap);

    function drawRegionsMap() {
      var data = google.visualization.arrayToDataTable(data_arr);

      var options = {};

      var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

      chart.draw(data, options);

    }
  })
