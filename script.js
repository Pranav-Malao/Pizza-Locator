const map = L.map('map').setView([22.9074872, 79.07306671], 5);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, PriMe is PM';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(map);

function generateStoresList() {
    const ul = document.querySelector('.list');
    storeList.forEach((store) => {
        const li = document.createElement('li');
        const div = document.createElement('div');
        const a = document.createElement('a');
        const p = document.createElement('p');

        a.addEventListener('click', () => {
            flyToStore(store);
        });

        div.classList.add('shop-item');
        a.innerText = store.properties.name;
        a.setAttribute('href', '#');
        p.innerText = store.properties.address;

        div.append(a, p);
        li.appendChild(div);
        ul.appendChild(li);
    });
}
generateStoresList();

// marker
const icon = L.icon({
    iconUrl: './images/pizzaMarker.png',
    iconSize: [30, 37.5], //4:5 image
    iconAnchor: [15, 37.5], //tip of marker, top-left is [0,0]
    popupAnchor: [0, -37.5], //relative to icon-anchor
    tooltipAnchor: [15, -18.75] //same
});

function makePopUp (store) {
    return `
        <div>
            <h4>${store.properties.name}</h4>
            <p>${store.properties.address}</p>
            <div class="phone-number">
                <a href="tel:${store.properties.phone}">${store.properties.phone}</a>
            </div>
        </div>
    `;
}

function onEachFeature(feature, layer) { //feature is every single object from the storeList array.
    layer.bindPopup(makePopUp(feature), {closeButton: false});
    // layer.bindTooltip('my tooltip text').openTooltip();
}
const storesLayer = L.geoJSON(storeList, {
    onEachFeature,
    pointToLayer: function (feature, latlng) { //icons print
        return L.marker(latlng, { icon: icon });
    }
})
storesLayer.addTo(map);

function flyToStore (store) {
    [lat, lng] = [...store.geometry.coordinates];
    map.flyTo([lng, lat], 14, {duration: 2}); //longlat

    setTimeout(() => {
        L.popup({closeButton: false, offset: L.point(0, -30)}).setLatLng([lng, lat]).setContent(makePopUp(store)).openOn(map);
    }, 2000);
}