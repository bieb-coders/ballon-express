type = ['', 'info', 'success', 'warning', 'danger'];


demo = {
    initPickColor: function () {
        $('.pick-class-label').click(function () {
            var new_class = $(this).attr('new-class');
            var old_class = $('#display-buttons').attr('data-class');
            var display_div = $('#display-buttons');
            if (display_div.length) {
                var display_buttons = display_div.find('.btn');
                display_buttons.removeClass(old_class);
                display_buttons.addClass(new_class);
                display_div.attr('data-class', new_class);
            }
        });
    },

    initGraphCharts: function () {

        /* ----------==========     Temeperature Chart    ==========---------- */

        $.getJSON('/graphs/sensors/temp', (data) => {
            dataTemperatureChart = {
                labels: data.labels,
                series: [
                    data.series
                ]
            };
    
            optionsTemperatureChart = {
                lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                }),
                low: Math.floor(Math.min(...data.series) * 0.9),
                high: Math.floor(Math.max(...data.series) * 1.1), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                chartPadding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                axisX: {
                    labelInterpolationFnc: (value, index) => {
                        return index % 2 === 0 ? moment(value).format('HH:mm') : null;
                    }
                }
            }
    
            var temperatureChart = new Chartist.Line('#temperatureChart', dataTemperatureChart, optionsTemperatureChart);
    
            md.startAnimationForLineChart(temperatureChart);
        });

        /* ----------==========     Battery Chart    ==========---------- */

        $.getJSON('/graphs/sensors/bat', (data) => {
            
            dataBatteryChart = {
                labels: data.labels.map(l => Date.parse(l)),
                series: [
                    data.series
                ]
            };
    
            optionsBatteryChart = {
                lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                }),
                low: 0,
                high: Math.floor(Math.max(...data.series) * 1.1), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                chartPadding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                axisX: {
                    labelInterpolationFnc: (value, index) => {
                        return index % 2 === 0 ? moment(value).format('HH:mm') : null;
                      }
                }
            }
    
            var batteryChart = new Chartist.Line('#batteryChart', dataBatteryChart, optionsBatteryChart);
    
            md.startAnimationForLineChart(batteryChart);

        });


        /* ----------==========     Humidity Chart    ==========---------- */

        $.getJSON('/graphs/sensors/hum', (data)=> {
            dataHumidityChart = {
                labels: data.labels,
                series: [
                    data.series
                ]
            };
    
            optionsHumidityChart = {
                lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                }),
                low: 50,
                high: 100, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                chartPadding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            }
    
            var humidityChart = new Chartist.Line('#humidityChart', dataHumidityChart, optionsHumidityChart);
    
            // start animation for the Completed Tasks Chart - Line Chart
            md.startAnimationForLineChart(humidityChart);
        });

        /* ----------==========     Pressure Chart    ==========---------- */

        $.getJSON('/graphs/sensors/press', (data) => {
            
            dataPressureChart = {
                labels: data.labels.map(l => Date.parse(l)),
                series: [
                    data.series
                ]
            };
    
            optionsPressureChart = {
                lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                }),
                low: Math.floor(Math.min(...data.series) * 0.9),
                high: Math.floor(Math.max(...data.series) * 1.1), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                chartPadding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                axisX: {
                    labelInterpolationFnc: (value, index) => {
                        return index % 2 === 0 ? moment(value).format('HH:mm') : null;
                      }
                }
            }
    
            var pressureChart = new Chartist.Line('#pressureChart', dataPressureChart, optionsPressureChart);
    
            md.startAnimationForLineChart(pressureChart);

        });
        /* ----------==========     Speed Chart    ==========---------- */

        dataSpeedChart = {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            series: [
                [15, 17, 23, 11, 7, 5, 2]
            ]
        };

        optionsSpeedChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 30, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        }

        var speedChart = new Chartist.Line('#speedChart', dataSpeedChart, optionsSpeedChart);

        md.startAnimationForLineChart(speedChart);

    },

    showNotification: function (from, align, text, type) {
        //color = Math.floor((Math.random() * 4) + 1);

        $.notify({
            icon: "notifications",
            message: text

        }, {
                type: type,
                timer: 4000,
                placement: {
                    from: from,
                    align: align
                }
            });
    },

    initLeafletMap: function(lat, lon, zoom) {
        var map = L.map('map').setView([lat, lon], zoom);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        $.getJSON('/map/layers', function (result) {
            $.each(result, function (i, mlayer) {
              $.getJSON('/map/layers/' + mlayer.id, function (data) {
                //console.log(data);
                var leaf_layer;
                if (data.type == "Feature") {
                    var geoType = data.geometry.type;
                    // Kijk naar Geometry type en set de juiste layer
                    switch(geoType) {
                        case 'LineString':
                            leaf_layer = L.geoJson(data);
                            leaf_layer.bindPopup(data.properties.name);
                            leaf_layer.addTo(map); 
                            break;
                        case 'MultiPoint':
                            leaf_layer = L.geoJson(data);
                            leaf_layer.bindPopup(data.properties.name);
                            leaf_layer.addTo(map); 
                            break;
                        default:
                            //do noting for other documents in collection 
                    }
                }
               });
            });
        });
    },

    addLeafletLayer: function(layer, id) {
            var leaf_layer;
            if (layer.type == "Feature") {
                var geoType = layer.geometry.type;
                // Kijk naar Geometry type en set de juiste layer
                switch(geoType) {
                    case 'LineString':
                        leaf_layer = L.geoJson(layer);
                        leaf_layer.bindPopup(layer.properties.name);
                        leaf_layer.addTo(map); 
                        break;
                    case 'MultiPoint':
                        leaf_layer = L.geoJson(layer);
                        leaf_layer.bindPopup(layer.properties.name);
                        leaf_layer.addTo(map); 
                        break;
                    default:
                        //do noting for other documents in collection 
                }
            }
        
    },

    sendBallonCommand: function (element, urlToSend) {
        var clickedButton = element;
        var commandType = clickedButton.id.split('_')[0];
        var action = "";
        switch(commandType) {
            case "ballon":
                action = "geknald!";
                break;
            case "ballast":
                action = "laten vallen!";
                break;
            default:
                action = "oepsie";
        }
        $.ajax({
            type: "POST",
            url: urlToSend,
            dataType: "json",
            data: { id: clickedButton.id, used: true },
            success: function (result) {
                demo.showNotification('bottom', 'center', clickedButton.name + " " + action, 'success');
                lastUpdated = new Date(result.lastModified);
                document.getElementById(result.id + '_updated').textContent = lastUpdated.toLocaleTimeString('nl-NL');
            },
            error: function (result) {
                demo.showNotification('bottom', 'center', 'Bericht niet juist verzonden!', 'danger');
            }
        });
    }
}