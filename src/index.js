import './styles.css';

const inputCity = document.querySelector('#miasto');
const butSubmit = document.querySelector('#submit');
const body = document.querySelector('body');

async function fetchData(city) {
  try {
    const data = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=LNS28BQ7EPYZHDVYPC8926YAL&contentType=json`,
      { mode: 'cors' },
    );
    const cityData = await data.json();

    return {
      address: cityData.address,
      resolvedAddress: cityData.resolvedAddress,
      temperature: cityData.currentConditions.temp,
      humidity: cityData.currentConditions.humidity,
      description: cityData.description,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

function isContainerExist() {
  return document.querySelector('.container');
}

async function modifyContainer(fdata) {
  if (isContainerExist()) {
    await refreshContainer(fdata);
  } else {
    await createContainer(fdata);
  }
}

async function createContainer(fdata) {
  const container = document.createElement('div');
  container.classList.add('container');
  container.classList.add('unvisible');
  const cityName = fdata.resolvedAddress;
  const weatherDesc = fdata.description;
  const weatherTemp = fdata.temperature;
  const weatherHum = fdata.humidity;

  const divsNames = ['divName', 'divDesc', 'divTemp', 'divHum'];
  const divs = {};
  divsNames.forEach((name) => {
    divs[name] = document.createElement('div');
    divs[name].classList.add(name);
  });

  const pNames = ['pName', 'pDesc', 'pTemp', 'pHum'];
  const pars = {};
  pNames.forEach((name) => {
    pars[name] = document.createElement('div');
    pars[name].classList.add(name);
  });

  pars.pName.textContent = cityName;
  pars.pDesc.textContent = weatherDesc;
  pars.pTemp.textContent = weatherTemp;
  pars.pHum.textContent = weatherHum;

  const svgsnames = ['location_city', 'thermostat', 'water_drop'];
  const svgs = {};
  svgsnames.forEach((name) => {
    svgs[name] = document.createElement('span');
    svgs[name].classList.add('material-icons');
    svgs[name].classList.add(name);
    svgs[name].textContent = name;
  });

  divs.divName.appendChild(svgs.location_city);
  divs.divName.appendChild(pars.pName);
  divs.divDesc.appendChild(pars.pDesc);
  divs.divTemp.appendChild(svgs.thermostat);
  divs.divTemp.appendChild(pars.pTemp);
  divs.divHum.appendChild(svgs.water_drop);
  divs.divHum.appendChild(pars.pHum);

  Object.values(divs).forEach((elem) => {
    container.appendChild(elem);
  });

  body.appendChild(container);

  setTimeout(() => {
    container.classList.add('visible');
  }, 1500);
}

async function refreshContainer(fdata) {
  const container = document.querySelector('.container');
  container.classList.remove('visible');
  container.classList.add('unvisible');

  const pName = document.querySelector('.pName');
  const pDesc = document.querySelector('.pDesc');
  const pTemp = document.querySelector('.pTemp');
  const pHum = document.querySelector('.pHum');

  setTimeout(() => {
    const cityName = fdata.resolvedAddress;
    const weatherDesc = fdata.description;
    const weatherTemp = fdata.temperature;
    const weatherHum = fdata.humidity;

    pName.textContent = cityName;
    pDesc.textContent = weatherDesc;
    pTemp.textContent = weatherTemp;
    pHum.textContent = weatherHum;
    container.classList.add('visible');
    container.classList.remove('unvisible');
  }, 2000);
}

butSubmit.addEventListener('click', async (e) => {
  e.preventDefault();

  const form = document.querySelector('form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const city = inputCity.value.trim();
  const fetchedData = await fetchData(city);
  form.classList.add('move-up');
  modifyContainer(fetchedData);
  console.log(fetchedData);
  setTimeout(() => {
    form.style.transition = 'none';
  }, 1500);
  form.reset();
});
