document.addEventListener('DOMContentLoaded', function () {
    const dataContainer = document.getElementById('data-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const sortAscButton = document.getElementById('sort-asc');
    const sortDescButton = document.getElementById('sort-desc');
    const createButton = document.getElementById('create-button');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');

    const BASE_URL = 'https://tankstellen-backend.onrender.com'; // Update to match deployed backend
    let tankstellenData = [];

    async function fetchData() {
        try {
            const response = await fetch(`${BASE_URL}/streets`);
            if (!response.ok) throw new Error('Failed to fetch data');
            tankstellenData = await response.json();
            displayData(tankstellenData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please try again later.');
        }
    }

    function displayData(data) {
        dataContainer.innerHTML = '';
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
            dataContainer.appendChild(streetItem);
        });
    }

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredData = searchTerm ? tankstellenData.filter(item => item.adresse?.toLowerCase().includes(searchTerm)) : tankstellenData;
        displayData(filteredData);
    });

    sortAscButton.addEventListener('click', () => displayData([...tankstellenData].sort((a, b) => a.adresse.localeCompare(b.adresse))));
    sortDescButton.addEventListener('click', () => displayData([...tankstellenData].sort((a, b) => b.adresse.localeCompare(a.adresse))));

    async function handleCRUD(method, endpoint, body = null) {
        try {
            const options = { method, headers: { 'Content-Type': 'application/json' } };
            if (body) options.body = JSON.stringify(body);
            const response = await fetch(`${BASE_URL}${endpoint}`, options);
            if (!response.ok) throw new Error((await response.json()).message || 'Operation failed');
            alert('Operation successful!');
            fetchData();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    createButton.addEventListener('click', () => {
        const adresse = prompt('Enter the street address:');
        const geometry = prompt('Enter coordinates as JSON (e.g., {"x": 6.9606, "y": 50.9161}):');
        if (adresse && geometry) handleCRUD('POST', '/streets', { adresse, geometry: JSON.parse(geometry) });
    });

    updateButton.addEventListener('click', () => {
        const id = prompt('Enter the street ID to update:');
        const adresse = prompt('Enter the new street address:');
        const geometry = prompt('Enter new coordinates as JSON:');
        if (id && adresse && geometry) handleCRUD('PUT', `/streets/${id}`, { adresse, geometry: JSON.parse(geometry) });
    });

    deleteButton.addEventListener('click', () => {
        const id = prompt('Enter the street ID to delete:');
        if (id) handleCRUD('DELETE', `/streets/${id}`);
    });

    fetchData();
});
