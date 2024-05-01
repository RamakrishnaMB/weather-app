import React, {useState, useEffect} from 'react';
import {readAllJsonFiles} from "./utilities/fileUtils";


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
                // Fetch the list of JSON files from the metadata file
                const fileList = await fetch('/weatherdata/files.json').then(response => response.json());

                // Fetch and parse each JSON file and include country and date information
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
                <div key={`${item.country}-${item.date}`}>
                    <h2>{item.date}</h2>
                    <h3>Country: {item.country}</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Time</th>
                            <th>Icon</th>
                            <th>Temperature (&#176;C / &#176;F)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {item.data.forecast.forecastday[0].hour.map(hour => (
                            <tr key={hour.time}>
                                <td>{hour.time}</td>
                                <td>
                                    <img src={hour.condition.icon} alt={hour.condition.text} />
                                </td>
                                <td>
                                    {hour.temp_c}&#176;C / {hour.temp_f}&#176;F
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default WeatherComponent;