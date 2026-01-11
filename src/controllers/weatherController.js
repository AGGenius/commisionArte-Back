require('dotenv').config();

const getWeatherReportForCurrentDay = async (req, res) => {
    try {
        const WEATHER_KEY = process.env.OPENWEATHER_API_KEY;
        const { lat, lon } = req.query;

        if (!WEATHER_KEY) {
            return res.status(500).json({ error: "no correct API key configured" });
        }

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
        const data = await response.json();

        const weatherReport = {
            city: data.name,
            temperature: data.main.temp,
            feels_like: data.main.feels_like
        };

        res.json(weatherReport);

    } catch {
        res.status(500).json({ error: "Error obteniendo el tiempo" });
    };
};

module.exports = { getWeatherReportForCurrentDay }