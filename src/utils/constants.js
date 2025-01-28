// URL de l'API : backend local pour développement ou backend déployé pour production
const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:4000'
  : 'https://projet6-d35d.onrender.com';

export const API_ROUTES = {
  SIGN_UP: `${API_URL}/api/auth/signup`,
  SIGN_IN: `${API_URL}/api/auth/login`,
  BOOKS: `${API_URL}/api/books`,
  BEST_RATED: `${API_URL}/api/books/bestrating`,
};

// Autres routes liées à l'application
export const APP_ROUTES = {
  SIGN_UP: '/Inscription',
  SIGN_IN: '/Connexion',
  ADD_BOOK: '/Ajouter',
  BOOK: '/livre/:id',
  UPDATE_BOOK: 'livre/modifier/:id',
};
