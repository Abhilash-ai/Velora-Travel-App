export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}

const MOCK_WEATHER: Record<string, WeatherData> = {
  'kerala': { temp: 28, condition: 'Sunny', icon: '01d' },
  'ladakh': { temp: 12, condition: 'Clear', icon: '01d' },
  'goa': { temp: 32, condition: 'Cloudy', icon: '03d' },
  'andaman': { temp: 30, condition: 'Rain', icon: '10d' },
  'rajasthan': { temp: 38, condition: 'Sunny', icon: '01d' },
  'uttarakhand': { temp: 15, condition: 'Snow', icon: '13d' }
};

export const fetchWeatherForDestination = async (destinationId: string): Promise<WeatherData | null> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    console.log("No OpenWeatherMap API key found, returning mock weather.");
    // Return mock data for known destinations, or a random one
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_WEATHER[destinationId] || { temp: 25, condition: 'Clear', icon: '01d' };
  }

  try {
    // We would ideally use lat/lng, but for simplicity, we'll try to query by destination name
    const query = destinationId.replace('-', ' ');
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query},IN&units=metric&appid=${apiKey}`);
    if (!res.ok) throw new Error('Failed to fetch weather');
    
    const data = await res.json();
    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      icon: data.weather[0].icon
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return MOCK_WEATHER[destinationId] || { temp: 25, condition: 'Clear', icon: '01d' };
  }
};
