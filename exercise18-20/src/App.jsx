import axios from 'axios'
import { useState, useEffect } from 'react'

const CountryDisplay = ({ countries }) => {
    const [singleView, setSingleView] = useState(null)

    const listStyle = {
        listStyle: 'none',
        margin: '0',
        padding: '0'
    }

    if (singleView) {
        return (
            <div>
                <button onClick={() => {
                    setSingleView(null)
                }}>Back</button>
                <h1>{singleView.name.common}</h1>
                <p>Capital: {singleView.capital} <br /> Area: {singleView.area}</p>
                <h2>Languages:</h2>
                <ul>
                    {Object.values(singleView.languages).map(value => {
                        return (
                            <li key={value}>{value}</li>
                        )
                    })}
                </ul>
                <img src={singleView.flags.png} />
                <WeatherDisplay country={singleView} />
            </div>
        )
    } else if (countries.length > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    } else if (countries.length === 1) {
        const country = countries[0]
        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital: {country.capital} <br /> Area: {country.area}</p>
                <h2>Languages:</h2>
                <ul>
                    {Object.values(country.languages).map(value => {
                        return (
                            <li key={value}>{value}</li>
                        )
                    })}
                </ul>
                <img src={country.flags.png} />
                <WeatherDisplay country={country} />
            </div>
        )
    } else {
        return (
            <ul style={listStyle}>
                {
                    countries.map(country => {
                        return (
                            <div key={country.name.common}>
                                <li>{country.name.common}<button onClick={
                                    () => {
                                        setSingleView(country)
                                    }
                                }>Show</button></li>
                            </div>
                        )
                    })
                }
            </ul>
        )
    }
}

const WeatherDisplay = ({ country }) => {
    const [weatherInfo, setWeatherInfo] = useState(null)

    useEffect(() => {
        console.log('Weather is called HERE')
        const request = `https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&units=metric&appid=${import.meta.env.VITE_WEATHER_KEY}`
        axios
            .get(request)
            .then(response => {
                setWeatherInfo(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    if (weatherInfo === null) {
        return (
            <div>
                Getting weather api...
            </div>
        )
    }
    return (
        <div>
            <h2>Weather in {country.name.common}</h2>
            <p>Temperature:{weatherInfo.main.temp}&deg;C</p>
            <img src={`https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@4x.png`} />
            <p>Wind speed: {weatherInfo.wind.speed} m/s</p>
        </div>
    )
}

const App = () => {
    const [countries, setCountries] = useState(null)
    const [input, setInput] = useState('')

    const handleInput = (event) => {
        setInput(event.target.value)
        // console.log(event.target.value)
    }

    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(response => {
                // console.log(response.data)
                const newList = response.data.filter(country => country.name.common.toLowerCase().includes(input.toLowerCase().trim()))
                setCountries(newList)
            })
            .catch(error => {
                console.log(error)
            })
    }, [input])

    if (countries === null) {
        return (
            <div>
                <div>
                    find countries <input onChange={handleInput} value={input} />
                </div>
                Connecting to api...
            </div>
        )
    }

    return (
        <div>
            <div>
                find countries <input onChange={handleInput} value={input} />
            </div>
            <CountryDisplay countries={countries} />
        </div>
    )
}

export default App