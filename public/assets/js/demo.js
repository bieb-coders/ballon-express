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

    initDocumentationCharts: function () {
        /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

        dataDailySalesChart = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
                [12, 17, 7, 17, 23, 18, 38]
            ]
        };

        optionsDailySalesChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        }

        var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        md.startAnimationForLineChart(dailySalesChart);
    },

    initGraphCharts: function () {

        /* ----------==========     Temeperature Chart    ==========---------- */

        dataTemperatureChart = {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            series: [
                [2, 2, -4, -3, 0, 1, -1]
            ]
        };

        optionsTemperatureChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: -10,
            high: 20, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        }

        var temperatureChart = new Chartist.Line('#temperatureChart', dataTemperatureChart, optionsTemperatureChart);

        md.startAnimationForLineChart(temperatureChart);



        /* ----------==========     Humidity Chart    ==========---------- */

        dataHumidityChart = {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            series: [
                [78, 85, 86, 73, 92, 78, 84, 82]
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


        /* ----------==========     Pressure Chart    ==========---------- */

        var dataPressureChart = {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            series: [
                [780, 850, 860, 730, 920, 780, 840, 820]

            ]
        };
        var optionsPressureChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 600,
            high: 1100, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        };
        
        var pressureChart = new Chartist.Line('#pressureChart', dataPressureChart, optionsPressureChart);

        //start animation for the Emails Subscription Chart
        md.startAnimationForLineChart(pressureChart);

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
    /*
    initGoogleMaps: function () {
        var myLatlng = new google.maps.LatLng(40.748817, -73.985428);
        var mapOptions = {
            zoom: 13,
            center: myLatlng,
            scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
            styles: [{
                "featureType": "water",
                "stylers": [{
                    "saturation": 43
                }, {
                    "lightness": -11
                }, {
                    "hue": "#0088ff"
                }]
            }, {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{
                    "hue": "#ff0000"
                }, {
                    "saturation": -100
                }, {
                    "lightness": 99
                }]
            }, {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#808080"
                }, {
                    "lightness": 54
                }]
            }, {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ece2d9"
                }]
            }, {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ccdca1"
                }]
            }, {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#767676"
                }]
            }, {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#ffffff"
                }]
            }, {
                "featureType": "poi",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [{
                    "visibility": "on"
                }, {
                    "color": "#b8cb93"
                }]
            }, {
                "featureType": "poi.park",
                "stylers": [{
                    "visibility": "on"
                }]
            }, {
                "featureType": "poi.sports_complex",
                "stylers": [{
                    "visibility": "on"
                }]
            }, {
                "featureType": "poi.medical",
                "stylers": [{
                    "visibility": "on"
                }]
            }, {
                "featureType": "poi.business",
                "stylers": [{
                    "visibility": "simplified"
                }]
            }]

        }
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            title: "Hello World!"
        });

        // To add the marker to the map, call setMap();
        marker.setMap(map);
    },
    */

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
            data: { id: clickedButton.id },
            success: function (result) {
                demo.showNotification('bottom', 'center', clickedButton.name + " " + action, 'success');
            },
            error: function (result) {
                demo.showNotification('bottom', 'center', 'Bericht niet juist verzonden!', 'danger');
            }
        });
    }
}