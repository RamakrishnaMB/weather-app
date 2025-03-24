import React, {useState, useEffect} from 'react';
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
    Select,
    MenuItem,
    SelectChangeEvent,
    Button
} from '@mui/material';

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

// WeatherComponent functional component
export const WeatherComponent: React.FC = () => {
    // State variables to manage data and filters
    const [data, setData] = useState<{ date: string; countries: { country: string; data: WeatherData }[] }[]>([]);
    const [filterDate, setFilterDate] = useState<string>('');
    const [filterCountry, setFilterCountry] = useState<string>('');

    // Fetch data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch file list from server
                const fileList = await fetch('/weatherdata/files.json').then(response => response.json());
                // Fetch content of each file and store it in fileContents
                const fileContents = await Promise.all(
                    fileList.map(async (fileName: string) => {
                        const response = await fetch(`/weatherdata/${fileName}`);
                        const jsonData = await response.json();
                        const country = jsonData.location.country;
                        // Get the date of the first forecast day
                        const date: string = jsonData.forecast.forecastday[0].date;
                        return {country, data: jsonData, date};
                    })
                );

                // Group data by date
                const groupedData: {
                    [key: string]: { date: string; countries: { country: string; data: WeatherData }[] }
                } = {};
                fileContents.forEach(({country, data}) => {
                    data.forecast.forecastday.forEach(({date: forecastDate}: {
                        date: string;
                        hour: {
                            time: string;
                            condition: { icon: string; text: string; };
                            temp_c: number;
                            temp_f: number;
                        }[]
                    }) => {
                        if (!groupedData[forecastDate]) {
                            groupedData[forecastDate] = {date: forecastDate, countries: []};
                        }
                        groupedData[forecastDate].countries.push({country, data});
                    });
                });

                setData(Object.values(groupedData));
            } catch (error) {
                console.error('Error reading JSON files:', error);
            }
        };

        fetchData();
    }, []);

    // Function to format time
// Event handler for date filter change
    const handleDateFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterDate(event.target.value);
    };

    // Event handler for country filter change
    const handleCountryFilterChange = (event: SelectChangeEvent<{ value: unknown }>) => {
        setFilterCountry(event.target.value as string);
    };

    // Event handler to clear filters
    const handleClearFilter = () => {
        setFilterDate('');
        setFilterCountry('');
    };

    // Function to get the minimum date for date filter
    const getMaxDate = (): string => {
        const today = new Date();
        const lastSevenDays = new Date(today);
        lastSevenDays.setDate(lastSevenDays.getDate() + 6); // Subtract 6 days to get the last 7 days
        return lastSevenDays.toISOString().split('T')[0];
    };

    // Function to get the maximum date for date filter
    const getMinDate = (): string => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Get today's date
    };

    // JSX structure of the component
    return (
        <div style={{margin: '30px'}}>
            <div>
                {/* Text field for date filter */}
                <TextField
                    label="Select Forecast Date"
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
                    sx={{mb: 2, marginRight: '10px'}}
                    variant="outlined"
                />
                {/* Select dropdown for country filter */}
                <Select
                    value={filterCountry as ""}
                    onChange={handleCountryFilterChange}
                    displayEmpty
                    sx={{mb: 2, marginRight: '10px'}}
                    variant="outlined"
                >
                    <MenuItem value="">
                        Select Country
                    </MenuItem>
                    <MenuItem value="Indonesia">Indonesia</MenuItem>
                    <MenuItem value="Malaysia">Malaysia</MenuItem>
                    <MenuItem value="Singapore">Singapore</MenuItem>
                    <MenuItem value="India">India</MenuItem>
                </Select>
                {/* Button to clear filters */}
                <Button variant="outlined" sx={{mb: 2, marginRight: '10px', backgroundColor: '#3073d1', color: 'white'}}
                        onClick={handleClearFilter}>Clear</Button>
            </div>

            {/* Render data */}
            {data.map(({date, countries}) => (
                <div key={date}>
                    {(!filterDate || date === filterDate) && (!filterCountry || countries.some(({country: countryData}) => countryData === filterCountry)) && (
                        <>
                            <Typography variant="h6" gutterBottom>{date}</Typography>
                            <Paper sx={{mb: 2}}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Country</TableCell>
                                                <TableCell align="center">12 AM</TableCell>
                                                <TableCell align="center">3 AM</TableCell>
                                                <TableCell align="center">6 AM</TableCell>
                                                <TableCell align="center">9 AM</TableCell>
                                                <TableCell align="center">12 PM</TableCell>
                                                <TableCell align="center">3 PM</TableCell>
                                                <TableCell align="center">6 PM</TableCell>
                                                <TableCell align="center">9 PM</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {countries
                                            .filter(({country: countryData}) => !filterCountry || countryData === filterCountry)
                                            .map(({country, data}) => (
                                                <TableBody key={country}>
                                                    <TableRow>
                                                        <TableCell align="center">{country}</TableCell>
                                                        {data.forecast.forecastday.find(forecast => forecast.date === date)?.hour.filter((hour, index) => index % 3 === 0).map(hour => (
                                                            <TableCell key={hour.time} align="center">
                                                                <div style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    <div style={{marginBottom: '5px'}}>
                                                                        <img src={hour.condition.icon}
                                                                             alt={hour.condition.text}
                                                                             style={{maxWidth: '50px'}}/>
                                                                    </div>
                                                                    <div>
                                                                        {hour.temp_c}&#176;C / {hour.temp_f}&#176;F
                                                                    </div>
                                                                </div>
                                                            </TableCell>

                                                        ))}
                                                    </TableRow>
                                                </TableBody>
                                            ))}
                                    </Table>
                                </TableContainer>
                            </Paper>

                        </>
                    )}
                </div>
            ))}
        </div>
    );
};


