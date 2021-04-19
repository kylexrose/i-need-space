const loc = document.querySelector("#address");
loc.addEventListener("keyup", () => {
    if (loc.value.length >= 3){
        autoComplete();
    }else if(loc.value.length < 3){
        document.querySelector("#autoComplete").innerHTML = "";
    }
})
document.querySelector("#search").addEventListener('click', () => searchForSatellites())

function searchForSatellites(){
    key = document.querySelector("#api-key").value;
    let address = encodeURI(loc.value);
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

function autoComplete(){
    let autoArray = [];
    key = document.querySelector("#api-key").value;
    let address = encodeURI(loc.value);
    const geoURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${key}`
    fetch(geoURL)
        .then((res) => res.json())
        .then((data) => {
            autoArray = [];
            for(let i = 0; i < data.features.length; i++){
                autoArray.push(data.features[i].place_name)
            }
            console.log(autoArray);
            autoPopulate(autoArray)
        })
}

function autoPopulate(array){
    const autoField = document.querySelector("#autoComplete");
    let autoHTML = "";
    for(let i = 0; i < array.length; i++){
        autoHTML += `<p class="autoComplete" id="choice${i}">${array[i]}</p>`
    }
    autoField.innerHTML = autoHTML;
    document.querySelectorAll(".autoComplete").forEach(element => element.addEventListener("click", ()=>{
        loc.value = element.innerHTML;
        autoField.innerHTML = "";
    }))
}