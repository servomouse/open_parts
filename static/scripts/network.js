// Function to fetch components from the backend
export async function fetchComponents() {
    try {
        const response = await fetch('/api/components');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
        // displayComponents(components);
    } catch (error) {
        console.error('Error fetching components:', error);
        return {};
    }
}

export async function upate_component(data) {
    try {
        const response = await fetch('/api/update_component', {
            method: 'POST', // Specify the request method
            headers: {
                'Content-Type': 'application/json', // Indicate the content type
            },
            body: JSON.stringify(data), // Convert the data to JSON
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error posting components:', error);
    }
}