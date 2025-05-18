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

    // Zwróć jako obiekt
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

  const pName = document.createElement('p');
  pName.classList.add('pname');
  const pDesc = document.createElement('p');
  pDesc.classList.add('pdesc');
  const pTemp = document.createElement('p');
  pTemp.classList.add('ptemp');
  const pHum = document.createElement('p');
  pHum.classList.add('phum');

  pName.textContent = cityName;
  pDesc.textContent = weatherDesc;
  pTemp.textContent = weatherTemp;
  pHum.textContent = weatherHum;

  container.appendChild(pName);
  container.appendChild(pDesc);
  container.appendChild(pTemp);
  container.appendChild(pHum);

  body.appendChild(container);

  setTimeout(() => {
    container.classList.add('visible');
  }, 1500);
}

async function refreshContainer(fdata) {
  const container = document.querySelector('.container');
  container.classList.remove('visible');
  container.classList.add('unvisible');

  const pName = document.querySelector('.pname');
  const pDesc = document.querySelector('.pdesc');
  const pTemp = document.querySelector('.ptemp');
  const pHum = document.querySelector('.phum');

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
