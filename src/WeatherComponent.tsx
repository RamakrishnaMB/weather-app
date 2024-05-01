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
    TextField,
} from '@mui/material';

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
    const [filterDate, setFilterDate] = useState<string>('');

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
                const groupedData: {
                    [key: string]: { date: string; countries: { country: string; data: WeatherData }[] }
                } = {};
                fileContents.forEach(({ country, data}) => {
                    data.forecast.forecastday.forEach(({ date: forecastDate}: {
                        date: string;
                        hour: {
                            time: string;
                            condition: { icon: string; text: string; };
                            temp_c: number;
                            temp_f: number;
                        }[]
                    }) => { // Specify the type of date and hour
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
        return date.toLocaleString('en-US', { hour: 'numeric', hour12: true });
    };

    const handleDateFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterDate(event.target.value);
    };

    const getMinDate = (): string => {
        const today = new Date();
        const lastSevenDays = new Date(today);
        lastSevenDays.setDate(lastSevenDays.getDate() - 6); // Subtract 6 days to get the last 7 days
        return lastSevenDays.toISOString().split('T')[0];
    };

    const getMaxDate = (): string => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Get today's date
    };
    return (
        <div style={{ margin: '30px' }}>
            <div>
                <TextField
                    label="Filter by Last 7 Days"
                    type="date"
                    value={filterDate}
                    onChange={handleDateFilterChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        min: getMinDate(),
                        max: getMaxDate(),
                    }}
                    sx={{ mb: 2 }}
                    variant="outlined"
                />
            </div>

            {data.map(({ date, countries }) => (
                <div key={date}>
                    {(!filterDate || date === filterDate) && (
                        <>
                            <Typography variant="h6" gutterBottom>{date}</Typography>
                            {countries.map(({ country, data }) => (
                                <Paper key={`${country}-${date}`} sx={{ mb: 2 }}>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Country</TableCell>
                                                    {data.forecast.forecastday.find(forecast => forecast.date === date)?.hour.filter((hour, index) => index % 3 === 0).map(hour => (
                                                        <TableCell key={hour.time}>{formatTime(hour.time)}</TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>{country}</TableCell>
                                                    {data.forecast.forecastday.find(forecast => forecast.date === date)?.hour.filter((hour, index) => index % 3 === 0).map(hour => (
                                                        <TableCell key={hour.time}>
                                                            <img src={hour.condition.icon} alt={hour.condition.text} style={{ maxWidth: '50px', marginRight: '10px' }} />
                                                            {hour.temp_c}&#176;C / {hour.temp_f}&#176;F
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            ))}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default WeatherComponent;
