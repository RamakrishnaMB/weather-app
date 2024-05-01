import React, { useState, useEffect } from 'react';
import {readAllJsonFiles} from "./utilities/fileUtils";

const LoadJsonWeather: React.FC = () => {
    const [jsonData, setJsonData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await readAllJsonFiles();
                setJsonData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>JSON Data</h2>
    <ul>
    {jsonData.map((data, index) => (
            <li key={index}>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                </li>
        ))}
    </ul>
    </div>
);
};

export default LoadJsonWeather;
