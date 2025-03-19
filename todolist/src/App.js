import "./App.css";
import React, {useEffect, useState} from "react";
import axios from "axios";
import TodoList from "./todolist";
import API_KEY from "./security.js";

const WeatherComponent = () => {
	const [weather, setWeather] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const api = `https://api.openweathermap.org/data/2.5/weather?lat=37.5665&lon=126.978&appid=${API_KEY}`;

	useEffect(() => {
		const fetchWeather = async () => {
			try {
				const response = await axios.get(api);
				setWeather(response.data);
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

	return (
		<>
			<h1>Weather info</h1>
			<h1>{weather.name}</h1>
			<p>Weather: {weather.weather[0].icon}</p>
			<p>Temperature: {weather.main.temp}</p>
			<p>Weather: {weather.weather[0].description}</p>
		</>
	);
};

function App() {
	return (
		<>
			<TodoList></TodoList>
			<WeatherComponent />
		</>
	);
}

export default App;
