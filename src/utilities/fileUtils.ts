async function readAllJsonFiles(): Promise<any[]> {
    try {
        // Fetch the list of JSON files from the metadata file
        const fileList = await fetch('/weatherdata/files.json').then(response => response.json());

        // Fetch and parse each JSON file
        const fileContents = await Promise.all(
            fileList.map(async (fileName: string) => {
                const response = await fetch(`/weatherdata/${fileName}`);
                return response.json();
            })
        );

        return fileContents;
    } catch (error) {
        console.error('Error reading JSON files:', error);
        return [];
    }
}

export { readAllJsonFiles };



