import React from 'react';
import WeatherComponent from "./WeatherComponent";
import { Typography } from '@mui/material';

function App() {
    return (
        <div>
            <Typography variant="h5" sx={{ backgroundColor: '#3073d1', color: 'white', padding: '10px' }}>Weather Historical Forecast</Typography>
            <WeatherComponent />
        </div>
    );
}

export default App;
