mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/dark-v10', // style URL
        zoom: 3, // starting zoom
        center: [-100, 40] // starting center
    }
);

async function geojsonFetch() { 
    let response = await fetch('assets/us-covid-rates.geojson');
    let us_covid_rates = await response.json();
    map.on('load', function loadingData() {
        // add layer
        // add legend
        map.addSource('us_covid_rates', {
            type: 'geojson',
            data: us_covid_rates
        });

        map.addLayer({
            'id': 'us_covid_rates-layer',
            'type': 'fill',
            'source': 'us_covid_rates',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#FFEDA0',   
                    10,          
                    '#FED976',   
                    20,          
                    '#FEB24C',   
                    50,         
                    '#FD8D3C',   
                    100,         
                    '#FC4E2A',   
                    200,         
                    '#E31A1C',   
                    500,        
                    '#BD0026',   
                    1000,        
                    "#800026"
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });
    });
    const layers = [
        '0-9',
        '10-19',
        '20-49',
        '50-99',
        '100-199',
        '200-499',
        '500-999',
        '1000 and more'
    ];
    const colors = [
        '#FFEDA070',
        '#FED97670',
        '#FEB24C70',
        '#FD8D3C70',
        '#FC4E2A70',
        '#E31A1C70',
        '#BD002670',
        '#80002670'
    ];
    
    const legend = document.getElementById('legend');
    const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NY Times</a></p>';
    legend.innerHTML = "<b>Covid-19 rates<br><br>" + source;

    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });

    map.on('mousemove', ({point}) => {
        const state = map.queryRenderedFeatures(point, {
            layers: ['us_covid_rates-layer']
        });
        document.getElementById('text-description').innerHTML = state.length ?
            `<h3>${state[0].properties.county}, ${state[0].properties.state}</h3><p><strong><em>${state[0].properties.rates}</strong> cases per 1000 people</em></p>` :
            `<p>Hover over a state!</p>`;
    });
};

geojsonFetch();