import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { WeatherComponent } from "./WeatherComponent";
import { WeatherApiComponent } from "./WeatherApiComponent";
import { useState } from 'react';

const App = () => {
  const [activeComponent, setActiveComponent] = useState<'WeatherFromConsole' | 'WeatherFromApi'>('WeatherFromConsole');

  const handleMenuClick = (componentName: 'WeatherFromConsole' | 'WeatherFromApi') => {
    setActiveComponent(componentName);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button
            color="inherit"
            onClick={() => handleMenuClick('WeatherFromConsole')}
            sx={{ color: activeComponent === 'WeatherFromConsole' ? 'white' : 'inherit' }}
          >
            WeatherFromConsole
          </Button>
          <Button
            color="inherit"
            onClick={() => handleMenuClick('WeatherFromApi')}
            sx={{ color: activeComponent === 'WeatherFromApi' ? 'white' : 'inherit' }}
          >
            WeatherFromApi
          </Button>
          </Typography>
         
        </Toolbar>
      </AppBar>
      {activeComponent === 'WeatherFromConsole' && (
        <div>
          <WeatherComponent />
        </div>
      )}
      {activeComponent === 'WeatherFromApi' && (
        <div>
          <WeatherApiComponent />
        </div>
      )}
    </div>
  );
};

export default App;