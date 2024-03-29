mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/dark-v10', // style URL
        zoom: 3, // starting zoom
        center: [-100, 40] // starting center
    }
);

const grades = [100, 500, 1000, 2000, 5000, 10000],
    colors = ['#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026'],
    radii = [0.5, 1, 3, 5, 7, 9];

map.on('load', () => {
    map.addSource('us-covid-counts', {
        type: 'geojson',
        data: 'assets/us-covid-counts.geojson'
    });

    map.addLayer({
            'id': 'us-covid-counts-layer',
            'type': 'circle',
            'source': 'us-covid-counts',
            'minizoom': 5,
            'paint': {
                // increase the radius of the circle as the zoom level and dbh value increases
                'circle-color': [
                    'step',
                    ['get', 'cases'],          
                    '#FED976',   
                    100,          
                    '#FEB24C',   
                    500,         
                    '#FD8D3C',   
                    1000,         
                    '#FC4E2A',   
                    2000,         
                    '#E31A1C',   
                    5000,        
                    '#BD0026',   
                    10000,        
                    "#800026"
                ],
                'circle-radius': [
                    'step',
                    ['get', 'cases'],
                    0.5,
                    100,
                    1,
                    500,
                    3,
                    1000,
                    5,
                    2000,
                    7,
                    5000,
                    9,
                    10000,
                    11
                ],
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        },
        'waterway-label'
    );
    
    map.on('click', 'us-covid-counts-layer', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>Cases:</strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });
    
});

// create legend
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>US Covid-19 Cases</strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');

}
// add the data source
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NY Times</a></p>';
// combine all the html codes.
legend.innerHTML = labels.join('') + source;
