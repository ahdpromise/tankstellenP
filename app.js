document.addEventListener('DOMContentLoaded', function () {
    const dataContainer = document.getElementById('data-container');
    const searchInput = document.getElementById('search-input');
    const sortAscButton = document.getElementById('sort-asc');
    const sortDescButton = document.getElementById('sort-desc');
    const createButton = document.getElementById('create-button');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');

    // ✅ Backend URL (Render)
    const BASE_URL = 'https://tankstellen-backend.onrender.com';

    let tankstellenData = [];

    // 🔄 Fetch data from backend
    async function fetchData() {
        try {
            const response = await fetch(`${BASE_URL}/streets`);
            if (!response.ok) throw new Error('Failed to fetch data');

            tankstellenData = await response.json();
            displayData(tankstellenData);
        } catch (error) {
            console.error('Error fetching data:', error);
            dataContainer.innerHTML = '<p>Failed to load data.</p>';
        }
    }

    // 🖥️ Display data
    function displayData(data) {
        dataContainer.innerHTML = '';

        if (!data || data.length === 0) {
            dataContainer.innerHTML = '<p>No data found.</p>';
            return;
        }

        data.forEach(item => {
            const streetItem = document.createElement('div');
            streetItem.className = 'street-item';

            streetItem.innerHTML = `
                <strong>ID:</strong> ${item._id}<br>
                <strong>Address:</strong> ${item.address}<br>
                <strong>Latitude:</strong> ${item.coordinates?.latitude ?? '-'}<br>
                <strong>Longitude:</strong> ${item.coordinates?.longitude ?? '-'}
            `;

            dataContainer.appendChild(streetItem);
        });
    }

    // 🔍 Search
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        const filteredData = searchTerm
            ? tankstellenData.filter(item =>
                item.address?.toLowerCase().includes(searchTerm)
            )
            : tankstellenData;

        displayData(filteredData);
    });

    // 🔼 Sort A–Z
    sortAscButton.addEventListener('click', () => {
        const sorted = [...tankstellenData].sort((a, b) =>
            a.address.localeCompare(b.address)
        );
        displayData(sorted);
    });

    // 🔽 Sort Z–A
    sortDescButton.addEventListener('click', () => {
        const sorted = [...tankstellenData].sort((a, b) =>
            b.address.localeCompare(a.address)
        );
        displayData(sorted);
    });

    // 🔧 CRUD Helper
    async function handleCRUD(method, endpoint, body = null) {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' }
            };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(`${BASE_URL}${endpoint}`, options);
            if (!response.ok) throw new Error('Operation failed');

            alert('Operation successful');
            fetchData();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    // ➕ Create
    createButton.addEventListener('click', () => {
        const address = prompt('Enter street address');
        const latitude = prompt('Enter latitude');
        const longitude = prompt('Enter longitude');

        if (address && latitude && longitude) {
            handleCRUD('POST', '/streets', {
                address,
                coordinates: {
                    latitude: Number(latitude),
                    longitude: Number(longitude)
                }
            });
        }
    });

    // ✏️ Update
    updateButton.addEventListener('click', () => {
        const id = prompt('Enter street ID');
        const address = prompt('Enter new address');
        const latitude = prompt('Enter new latitude');
        const longitude = prompt('Enter new longitude');

        if (id && address && latitude && longitude) {
            handleCRUD('PUT', `/streets/${id}`, {
                address,
                coordinates: {
                    latitude: Number(latitude),
                    longitude: Number(longitude)
                }
            });
        }
    });

    // ❌ Delete
    deleteButton.addEventListener('click', () => {
        const id = prompt('Enter street ID to delete');
        if (id) handleCRUD('DELETE', `/streets/${id}`);
    });

    // ▶️ Init
    fetchData();
});
