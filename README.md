Running the React Frontend Application

To run the React frontend application, follow these steps:

    Clone the Project:
    Clone the project repository using one of the following methods:
        Unzip the attachment provided.
        Or clone the Git repository from the URL: https://github.com/RamakrishnaMB/weather-app.git.

    Verify Node.js Installation:
    Before running the React app, ensure that Node.js is installed on your system. You can verify the installation by running the following commands in your terminal or command prompt:

    node -v
    npm -v
    
    Copy Data from Backend Console Application:
    As per the requirements specified in the assessment document, the React app must load data from the backend console
    application. Therefore, before running the React app, ensure that country-wise JSON files generated in the backend
    console application (located at bin\Debug\net8.0\weatherforecastdata) are copied to the public folder of the React
    project (path: weather-app\public\weatherdata).
    Note: If these files are not copied before running the application, no data will be displayed.
    
    Install Dependencies:
    Once the project is cloned successfully, navigate to the project's root directory (e.g., D:\weather-app) in your
    terminal or command prompt. Then, run the following command to install project dependencies:
    
    npm install
    
    Run the Project:
    After installing the dependencies, use the following command to run the project:
    
    npm start
    
    Access the Application:
    Open your web browser and navigate to the URL http://localhost:3000/ to access the React application.

Docker Setup Instructions for FE

To run the React frontend application using Docker, follow these steps:

    Navigate to React App Root Directory:
    Go to the root folder of the React app where the Dockerfile is located and open it in the terminal.

    Build Docker Image:
    Run the following command in the terminal to build the Docker image:

    docker build . -t react-weather-app
    
    This command will build the Docker image named react-weather-app based on the Dockerfile.
    
    Run Docker Container:
    Once the Docker build process is successfully completed, execute the following command to run the application in a Docker container:
    
    arduino
    
    docker run -d -p 3000:3000 react-weather-app
    
    This command will run the Docker container in detached mode (-d) and map port 3000 of the host to port 3000 of the container, allowing access to the React application.
    
    View Application Logs:
    To view the localhost URL for the application, run the following command:
    
    css
    
    docker logs [container_id]
    
    Replace [container_id] with the actual ID of the Docker container. This command will display the logs, which typically include the localhost URL for accessing the application.
    
    Access the Application:
    Use the URL http://localhost:3000/ to open the app in the browser.