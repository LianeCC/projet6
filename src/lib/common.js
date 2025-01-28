import axios from 'axios';

// URL de l'API : backend local pour développement ou backend déployé pour production
const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:4000'
  : 'https://projet6-d35d.onrender.com';

export const API_ROUTES = {
  BOOKS: `${API_URL}/api/books`,
  BEST_RATED: `${API_URL}/api/books/bestrating`,
  // autres routes ici
};

// Fonction pour formater les livres
function formatBooks(bookArray) {
  return bookArray.map((book) => {
    const newBook = { ...book };
    // eslint-disable-next-line no-underscore-dangle
    newBook.id = newBook._id;
    return newBook;
  });
}

// Stocker les informations d'utilisateur dans le localStorage
export function storeInLocalStorage(token, userId) {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
}

// Récupérer une valeur depuis le localStorage
export function getFromLocalStorage(item) {
  return localStorage.getItem(item);
}

// Récupérer l'utilisateur authentifié
export async function getAuthenticatedUser() {
  const defaultReturnObject = { authenticated: false, user: null };
  try {
    const token = getFromLocalStorage('token');
    const userId = getFromLocalStorage('userId');
    if (!token) {
      return defaultReturnObject;
    }
    return { authenticated: true, user: { userId, token } };
  } catch (err) {
    console.error('getAuthenticatedUser, Something Went Wrong', err);
    return defaultReturnObject;
  }
}

// Récupérer la liste des livres
export async function getBooks() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BOOKS}`,
    });
    const books = formatBooks(response.data);
    return books;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Récupérer un livre par son ID
export async function getBook(id) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BOOKS}/${id}`,
    });
    const book = response.data;
    // eslint-disable-next-line no-underscore-dangle
    book.id = book._id;
    return book;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Récupérer les livres les mieux notés
export async function getBestRatedBooks() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BEST_RATED}`,
    });
    return formatBooks(response.data);
  } catch (e) {
    console.error(e);
    return [];
  }
}

// Supprimer un livre
export async function deleteBook(id) {
  try {
    await axios.delete(`${API_ROUTES.BOOKS}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Ajouter une note à un livre
export async function rateBook(id, userId, rating) {
  const data = {
    userId,
    rating: parseInt(rating, 10),
  };

  try {
    const response = await axios.post(`${API_ROUTES.BOOKS}/${id}/rating`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const book = response.data;
    // eslint-disable-next-line no-underscore-dangle
    book.id = book._id;
    return book;
  } catch (e) {
    console.error(e);
    return e.message;
  }
}

// Ajouter un livre
export async function addBook(data) {
  const userId = localStorage.getItem('userId');
  const book = {
    userId,
    title: data.title,
    author: data.author,
    year: data.year,
    genre: data.genre,
    ratings: [{
      userId,
      grade: data.rating ? parseInt(data.rating, 10) : 0,
    }],
    averageRating: parseInt(data.rating, 10),
  };
  const bodyFormData = new FormData();
  bodyFormData.append('book', JSON.stringify(book));
  bodyFormData.append('image', data.file[0]);

  try {
    return await axios({
      method: 'post',
      url: `${API_ROUTES.BOOKS}`,
      data: bodyFormData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  } catch (err) {
    console.error(err);
    return { error: true, message: err.message };
  }
}

// Mettre à jour un livre
export async function updateBook(data, id) {
  const userId = localStorage.getItem('userId');

  let newData;
  const book = {
    userId,
    title: data.title,
    author: data.author,
    year: data.year,
    genre: data.genre,
  };
  if (data.file[0]) {
    newData = new FormData();
    newData.append('book', JSON.stringify(book));
    newData.append('image', data.file[0]);
  } else {
    newData = { ...book };
  }

  try {
    const newBook = await axios({
      method: 'put',
      url: `${API_ROUTES.BOOKS}/${id}`,
      data: newData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return newBook;
  } catch (err) {
    console.error(err);
    return { error: true, message: err.message };
  }
}
