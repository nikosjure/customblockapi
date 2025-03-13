async function getAccessToken() {
    try {
      const response = await fetch('/getToken', {
        method: 'POST'
      });
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  }
  
  async function fetchDataExtensionData(accessToken) {
    try {
      const response = await fetch('/dataExtension', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      console.log('Data received:', data); // Add this line
      return data.items;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  function populateDropdown(data) {
    const dropdown = document.getElementById('dataExtensionDropdown');
    dropdown.innerHTML = ''; // Clear existing options
    console.log('Populating dropdown with:', data); // Add this line
    data.forEach(item => {
      console.log('Item:', item); // Add this line
      const option = document.createElement('option');
      option.value = item.keys.id;
      option.textContent = item.values.name;
      dropdown.appendChild(option);
    });
  }
  
  async function init() {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const data = await fetchDataExtensionData(accessToken);
      if (data) {
        populateDropdown(data);
      }
    }
  }
  
  window.addEventListener('load', init);
  