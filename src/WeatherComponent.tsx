import React, {useState, useEffect} from 'react';
import {readAllJsonFiles} from "./utilities/fileUtils";
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
    const [data, setData] = useState<{ country: string; date: string; data: WeatherData }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fileList = await fetch('/weatherdata/files.json').then(response => response.json());
                const fileContents = await Promise.all(
                    fileList.map(async (fileName: string) => {
                        const response = await fetch(`/weatherdata/${fileName}`);
                        const jsonData = await response.json();
                        const country = jsonData.location.country;
                        const date = jsonData.forecast.forecastday[0].date;
                        return { country, date, data: jsonData };
                    })
                );
                setData(fileContents);
            } catch (error) {
                console.error('Error reading JSON files:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {data.map(item => (
                <Paper key={`${item.country}-${item.date}`} style={{ marginBottom: '20px', padding: '20px' }}>
                    <Typography variant="h5">{item.date}</Typography>
                    <Typography variant="subtitle1">Country: {item.country}</Typography>
                    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Icon</TableCell>
                                    <TableCell>Temperature (&#176;C / &#176;F)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {item.data.forecast.forecastday[0].hour.map(hour => (
                                    <TableRow key={hour.time}>
                                        <TableCell>{hour.time}</TableCell>
                                        <TableCell>
                                            <img src={hour.condition.icon} alt={hour.condition.text} style={{ maxWidth: '50px' }} />
                                        </TableCell>
                                        <TableCell>
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
    );
};

export default WeatherComponent;