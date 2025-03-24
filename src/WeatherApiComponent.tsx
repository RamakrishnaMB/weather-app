import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';

// Define the structure of the weather data
interface WeatherData {
  location: {
    country: string;
  };
  forecast: {
    forecastday: {
      date: string;
      hour: {
        time: string;
        condition: {
          icon: string;
          text: string;
        };
        temp_c: number;
        temp_f: number;
      }[];
    }[];
  };
}

const WeatherApiComponent: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<WeatherData[]>('https://localhost:7070/WeatherForecast/FetchWeatherData');
        console.log(response.data);
        setWeatherData(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ margin: '30px' }}>
      <Typography variant="h4" gutterBottom>
        Weather Data from API
      </Typography>
      {weatherData.map((weatherItem, index) => (
        <div key={index}>
          <Typography variant="h6" gutterBottom>
            {weatherItem.location.country}
          </Typography>
          {weatherItem.forecast.forecastday.map((day) => (
            <div key={day.date}>
              <Typography variant="subtitle1" gutterBottom>
                {day.date}
              </Typography>
              <Paper sx={{ mb: 2 }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Time</TableCell>
                        <TableCell align="center">Condition</TableCell>
                        <TableCell align="center">Temp (C)</TableCell>
                        <TableCell align="center">Temp (F)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {day.hour.map((hour) => (
                        <TableRow key={hour.time}>
                          <TableCell align="center">{hour.time.split(' ')[1]}</TableCell>
                          <TableCell align="center">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={hour.condition.icon} alt={hour.condition.text} style={{ maxWidth: '50px' }} />
                              <div>{hour.condition.text}</div>
                            </div>
                          </TableCell>
                          <TableCell align="center">{hour.temp_c}</TableCell>
                          <TableCell align="center">{hour.temp_f}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export { WeatherApiComponent };