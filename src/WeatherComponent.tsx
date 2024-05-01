import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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

const WeatherComponent: React.FC = () => {
    const [data, setData] = useState<{ date: string; countries: { country: string; data: WeatherData }[] }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fileList = await fetch('/weatherdata/files.json').then(response => response.json());
                const fileContents = await Promise.all(
                    fileList.map(async (fileName: string) => {
                        const response = await fetch(`/weatherdata/${fileName}`);
                        const jsonData = await response.json();
                        const country = jsonData.location.country;
                        const date: string = jsonData.forecast.forecastday[0].date; // Specify the type of date as string
                        return { country, data: jsonData, date };
                    })
                );

                // Group data by date
                const groupedData: { [key: string]: { date: string; countries: { country: string; data: WeatherData }[] } } = {};
                fileContents.forEach(({ country, data, date }) => {
                    data.forecast.forecastday.forEach(({ date: forecastDate, hour }: { date: string; hour: { time: string; condition: { icon: string; text: string; }; temp_c: number; temp_f: number; }[] }) => { // Specify the type of date and hour
                        if (!groupedData[forecastDate]) { // Change variable name from date to forecastDate
                            groupedData[forecastDate] = { date: forecastDate, countries: [] }; // Change variable name from date to forecastDate
                        }
                        groupedData[forecastDate].countries.push({ country, data });
                    });
                });

                setData(Object.values(groupedData));
            } catch (error) {
                console.error('Error reading JSON files:', error);
            }
        };

        fetchData();
    }, []);

    const formatTime = (time: string) => {
        const date = new Date(time);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    return (
        <div>
            {data.map(({ date, countries }) => (
                <div key={date}>
                    <Typography variant="h5">{date}</Typography>
                    {countries.map(({ country, data }) => (
                        <Paper key={`${country}-${date}`} style={{ marginBottom: '20px', padding: '20px' }}>
                            <Typography variant="subtitle1">Country: {country}</Typography>
                            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Time</TableCell>
                                            <TableCell>Icon & Temperature (&#176;C / &#176;F)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.forecast.forecastday.find(forecast => forecast.date === date)?.hour.map(hour => (
                                            <TableRow key={hour.time}>
                                                <TableCell>{formatTime(hour.time)}</TableCell>
                                                <TableCell>
                                                    <img src={hour.condition.icon} alt={hour.condition.text} style={{ maxWidth: '50px', marginRight: '10px' }} />
                                                    {hour.temp_c}&#176;C / {hour.temp_f}&#176;F
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default WeatherComponent;
