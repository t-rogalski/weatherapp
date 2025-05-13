import './styles.css';

const inputCity = document.querySelector('#miasto');
const butSubmit = document.querySelector('#submit');

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

butSubmit.addEventListener('click', async (e) => {
  e.preventDefault();

  const form = document.querySelector('form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const city = inputCity.value.trim();
  const wawa = await fetchData(city);
  console.log(wawa.resolvedAddress);
  form.reset();
});
