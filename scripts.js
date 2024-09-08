document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map
    const map = L.map('map-container').setView([51.505, -0.09], 13); // Default coordinates

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    let currentLocation = { lat: 51.505, lon: -0.09 }; // Default location
    const contactSelect = document.getElementById("contacts");
    let savedContacts = JSON.parse(localStorage.getItem('savedContacts')) || [];

    // Load saved contacts
    function loadContacts() {
        contactSelect.innerHTML = '<option value="">Select Contact</option>'; // Reset dropdown
        savedContacts.forEach(contact => {
            const option = document.createElement("option");
            option.value = contact.number;
            option.textContent = `${contact.name} (${contact.number})`;
            contactSelect.appendChild(option);
        });
    }
    loadContacts();

    // Save contact
    document.getElementById("saveContact").addEventListener("click", function () {
        const contactName = document.getElementById("contactName").value.trim();
        const contactNumber = document.getElementById("contactNumber").value.trim();
        if (contactName && contactNumber) {
            const existingIndex = savedContacts.findIndex(contact => contact.number === contactNumber);
            if (existingIndex > -1) {
                savedContacts[existingIndex] = { name: contactName, number: contactNumber };
            } else {
                savedContacts.push({ name: contactName, number: contactNumber });
            }
            localStorage.setItem('savedContacts', JSON.stringify(savedContacts));
            loadContacts();
            alert("Contact saved successfully!");
        } else {
            alert("Please enter a valid contact name and phone number.");
        }
    });

    // Delete contact
    document.getElementById("deleteContact").addEventListener("click", function () {
        const contactNumber = contactSelect.value;
        if (contactNumber) {
            savedContacts = savedContacts.filter(contact => contact.number !== contactNumber);
            localStorage.setItem('savedContacts', JSON.stringify(savedContacts));
            loadContacts();
            alert("Contact deleted successfully!");
        } else {
            alert("Please select a contact to delete.");
        }
    });

    // Get current location
    document.getElementById("getLocation").addEventListener("click", function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                currentLocation.lat = position.coords.latitude;
                currentLocation.lon = position.coords.longitude;
                map.setView([currentLocation.lat, currentLocation.lon], 13);
                L.marker([currentLocation.lat, currentLocation.lon]).addTo(map).bindPopup("You are here").openPopup();
            }, function (error) {
                console.error("Error getting location:", error);
                alert("Failed to get your location.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });

    // Share location
    document.getElementById("shareLocation").addEventListener("click", function () {
        const locationUrl = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lon}`;
        const whatsappUrl = `https://wa.me/?text=I'm%20at%20this%20location:%20${encodeURIComponent(locationUrl)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Panic alert
    document.getElementById("panicAlert").addEventListener("click", function () {
        const contactNumber = contactSelect.value;
        if (contactNumber) {
            const phoneUrl = `tel:${contactNumber}`;
            window.location.href = phoneUrl;
        } else {
            alert("No contact selected. Please select a contact first.");
        }
    });
});
