import { useEffect, useState } from 'react';
import axios from 'axios';

const Filter = ({onChange, filter}) => (
  <input onChange={onChange} value={filter}/>
)  

const Countries = ({selectedCountries, showSelectedCountry, weather, setWeather}) => {
  if (selectedCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (selectedCountries.length === 1) {
    const country = selectedCountries[0];
    return <Country country={country} weather={weather} setWeather={setWeather} />
  } else {
    return (
      selectedCountries
        .map(country => (
          <p key={country.name.common}>              
            <span>{country.name.common} </span>
            <button id={country.name.common} onClick={showSelectedCountry}>show</button>           
          </p>
        ))
    )
  }
}

const Weather = ({capital}) => {
  const [weather, setWeather] = useState(0);
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  useEffect(() => {
    axios
    .get(`http://api.openweathermap.org/geo/1.0/direct?q={${capital}}&appid=${process.env.REACT_APP_WEATHER_API}`)
    .then(response => {
      setLat(response.data[0].lat);
      setLon(response.data[0].lon);
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API}&units=metric`)
        .then(response => {
          console.log(response.data);
          setWeather(response.data);
        })
    });    
  }, []);

  return (
    <>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {weather && weather.main.temp} Celsius</p>      
    </>
  )
}

const Country = ({country, weather, setWeather}) => (
  <>
    <h2>{country.name.common}</h2>
    <p>capital {country.capital}</p>
    <p>area {country.area}</p>
    <p><b>languages:</b></p>
    <ul>
      {Object.values(country.languages).map(language => {
        return <li key={language}>{language}</li>
      })}
    </ul>
    <img src={country.flags.png} />
    <Weather capital={country.capital} weather={weather} setWeather={setWeather}/>
  </>
)

function App() {

  const [filter, setFilter] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [weather, setWeather] = useState([]);

  const onFilterChange = (event) => {
    const query = event.target.value.toLowerCase();
    setFilter(query);
    setSelectedCountries(countries.filter(country => {
      return country.name.common.toLowerCase().includes(query);
    }));
  }

  const showSelectedCountry = (event) => {
    const name = event.target.id;
    const selectedCountry = countries.filter(country => {
      return country.name.common === name;
    })

    setSelectedCountries(selectedCountry);
  }

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
      });
  }, [])

  return (
    <div>
      <Filter onChange={onFilterChange} filter={filter} />
      <Countries selectedCountries={selectedCountries}
                 showSelectedCountry={showSelectedCountry}
                 weather={weather}
                 setWeather={setWeather} />
    </div>
  );
}

export default App;
