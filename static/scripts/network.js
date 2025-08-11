// Function to fetch components from the backend
export async function fetchComponents() {
    try {
        const response = await fetch('/api/components');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
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

export async function add_component(data) {
    try {
        const response = await fetch('/api/add_component', {
            method: 'POST', // Specify the request method
            headers: {
                'Content-Type': 'application/json', // Indicate the content type
            },
            body: JSON.stringify(data), // Convert the data to JSON
        });

        const resp = await response.json();
        const resp_id = resp["id"];
        console.log(`Server serponse: ${JSON.stringify(resp)}, resp_id = ${resp_id}`);
        return resp_id;
    } catch (error) {
        console.error('Error posting components:', error);
    }
}