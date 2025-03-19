document.addEventListener('DOMContentLoaded', function () {
    const dataContainer = document.getElementById('data-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const sortAscButton = document.getElementById('sort-asc');
    const sortDescButton = document.getElementById('sort-desc');
    const createButton = document.getElementById('create-button');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');

    let tankstellenData = [];

    // Fetch data from the backend
    async function fetchData() {
        try {
            const response = await fetch('http://localhost:5000/streets');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log('Fetched data:', data); // Debugging: Log fetched data
            tankstellenData = data;
            displayData(tankstellenData); // Display all streets
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please try again later.');
        }
    }

    // Display data in the container
    function displayData(data) {
        dataContainer.innerHTML = ''; // Clear the container before adding new data
        if (data.length === 0) {
            dataContainer.innerHTML = '<p>No data found.</p>';
            return;
        }
        data.forEach(item => {
            const streetItem = document.createElement('div');
            streetItem.className = 'street-item';
            streetItem.innerHTML = `
                <strong>ID:</strong> ${item._id} <br>
                <strong>Address:</strong> ${item.adresse} <br>
                <strong>Coordinates:</strong> ${JSON.stringify(item.geometry)}
            `;
            dataContainer.appendChild(streetItem); // Add each street to the container
        });
    }

    // Search functionality (dynamic as you type)
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase(); // Trim and convert to lowercase
        console.log('Search term:', searchTerm); // Debugging: Log search term
        if (!searchTerm) {
            // If the search term is empty, display all streets
            displayData(tankstellenData);
            return;
        }
        const filteredData = tankstellenData.filter(item => {
            console.log('Checking item:', item.adresse); // Debugging: Log each item's address
            return item.adresse && item.adresse.toLowerCase().includes(searchTerm); // Case-insensitive search
        });
        console.log('Filtered data:', filteredData); // Debugging: Log filtered data
        if (filteredData.length === 0) {
            dataContainer.innerHTML = '<p>No matching streets found.</p>'; // Display a message if no results are found
        } else {
            displayData(filteredData); // Display filtered streets
        }
    });

    // Sort ascending
    sortAscButton.addEventListener('click', () => {
        const sortedData = [...tankstellenData].sort((a, b) => a.adresse.localeCompare(b.adresse));
        displayData(sortedData); // Display sorted streets (without updating tankstellenData)
    });

    // Sort descending
    sortDescButton.addEventListener('click', () => {
        const sortedData = [...tankstellenData].sort((a, b) => b.adresse.localeCompare(a.adresse));
        displayData(sortedData); // Display sorted streets (without updating tankstellenData)
    });

    // Create new street
    createButton.addEventListener('click', async () => {
        const address = prompt('Enter the street address:');
        if (!address) {
            alert('Address is required.');
            return;
        }
        const coordinates = prompt('Enter the coordinates (JSON format, e.g., {"x": 6.9606, "y": 50.9161}):');
        if (!coordinates) {
            alert('Coordinates are required.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/streets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ adresse: address, geometry: JSON.parse(coordinates) })
            });
            if (!response.ok) {
                const errorData = await response.json(); // Get error details from the backend
                throw new Error(errorData.message || 'Failed to create street');
            }
            alert('Street created successfully!');
            fetchData(); // Refresh the data after creating a new street
        } catch (error) {
            console.error('Error creating street:', error);
            alert(`Failed to create street: ${error.message}`);
        }
    });

    // Update street
    updateButton.addEventListener('click', async () => {
        const id = prompt('Enter the street ID to update:');
        if (!id) {
            alert('ID is required.');
            return;
        }
        const address = prompt('Enter the new street address:');
        if (!address) {
            alert('Address is required.');
            return;
        }
        const coordinates = prompt('Enter the new coordinates (JSON format, e.g., {"x": 6.9606, "y": 50.9161}):');
        if (!coordinates) {
            alert('Coordinates are required.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/streets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ adresse: address, geometry: JSON.parse(coordinates) })
            });
            if (!response.ok) {
                const errorData = await response.json(); // Get error details from the backend
                throw new Error(errorData.message || 'Failed to update street');
            }
            alert('Street updated successfully!');
            fetchData(); // Refresh the data after updating a street
        } catch (error) {
            console.error('Error updating street:', error);
            alert(`Failed to update street: ${error.message}`);
        }
    });

    // Delete street
    deleteButton.addEventListener('click', async () => {
        const id = prompt('Enter the street ID to delete:');
        if (!id) {
            alert('ID is required.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/streets/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json(); // Get error details from the backend
                throw new Error(errorData.message || 'Failed to delete street');
            }
            alert('Street deleted successfully!');
            fetchData(); // Refresh the data after deleting a street
        } catch (error) {
            console.error('Error deleting street:', error);
            alert(`Failed to delete street: ${error.message}`);
        }
    });

    // Initial data fetch
    fetchData(); // Fetch and display data when the page loads
});