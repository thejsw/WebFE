import React, {useEffect, useState} from "react";
import axios from "axios";
import "./weather.css";
import API_KEY from "./security.js";

const WeatherComponent = () => {
	const [weatherResult, setWeatherResult] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const api = `https://api.openweathermap.org/data/2.5/weather?lat=37.5665&lon=126.978&appid=${API_KEY}`;

	useEffect(() => {
		const fetchWeather = async () => {
			try {
				const response = await axios.get(api);
				setWeatherResult(response.data);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		fetchWeather();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	const CelsiusTemp = Math.round(parseFloat(weatherResult.main.temp - 273.15));

	return (
		<div className="weather-container">
			<h1 className="weather-title">{weatherResult.name} Weather</h1>
			<p className="weather-temp">현재기온: {CelsiusTemp} °C</p>
			<p className="weather-description">현재날씨: {weatherResult.weather[0].main}</p>
			<img
				// className="weather-icon"
				src={`http://openweathermap.org/img/wn/${weatherResult.weather[0].icon}.png`}
				alt={weatherResult.weather[0].main}
			/>
		</div>
	);
};

export default WeatherComponent;
