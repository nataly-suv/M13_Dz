// import { fetchUsers } from './users.js';



// Функция получения данных с API
async function fetchUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users = await response.json();

    users.forEach((user) => {
      console.log(user.name);
    });

    return users;
  } catch (error) {
    console.error("Произошла ошибка при получении данных:", error);
    throw error;
  }
}


// Инициализация функции
fetchUsers()
  .then(() => console.log("Данные получены"))
  .catch((error) => console.error("Ошибка:", error));
