function dropdownToggle(element) {
    const dropdown = element.parentElement.querySelector('.dropdown-content');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

const BASE_URL = "https://join-94aa0-default-rtdb.europe-west1.firebasedatabase.app/";

fetch(BASE_URL + "users/guest/tasks.json")
    .then(response => response.json())
    .then(data => console.log(data));

