document.querySelector("#search").addEventListener('click', () => searchForSatellites())

function searchForSatellites(){
    const key = document.querySelector("#api-key").value;
    let address = encodeURI(document.querySelector("#address").value);
    //address = 'pk.eyJ1Ijoia29vbG1pbmlzdGVyIiwiYSI6ImNrbmhvbGJyNTA3am4yb3FyMGtqOGgzbmgifQ.6Sakt1E00RQ0_aVIbu8Dxg'
    const geoURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${key}`
    const norad = document.querySelector("#norad").value;
    fetch(geoURL)
    .then((res) => res.json())
    .then((data) => {
        const coords = data.features[0].center;
        findSatellites(norad, coords[0], coords[1])
    })
}

function findSatellites(satellite, lat, lon){
    const satURL = `https://satellites.fly.dev/passes/${satellite}?lat=${lat}&lon=${lon}&limit=1`;
    fetch(satURL)
        .then((response) => (response.json()))
        .then((data) =>{
            let satellite = {
                rise: data[0].rise.utc_datetime.split('.')[0].split(' '),
                culmination: data[0].culmination.utc_datetime.split('.')[0].split(' '),
                set: data[0].set.utc_datetime.split('.')[0].split(' ')
            }
            return satellite;
        })
        .then((timesObj)=>{
            console.log(timesObj)
            for(let data in timesObj){
            document.querySelector(`#${data}Date`).innerHTML = timesObj[data][0];
            document.querySelector(`#${data}Time`).innerHTML = timesObj[data][1];
            }
            document.querySelector("table").hidden=false;
        })
}   
