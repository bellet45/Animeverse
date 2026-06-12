import axios from 'axios';

const api = axios.create({
  baseURL: 'https://animeverse-c8bj.onrender.com/api',
});

export const search = async (query) => {
  const { data } = await api.get('/search', { params: { q: query } });
  return data;
};

export const getAnimeInfo = async (id) => {
  const { data } = await api.get(`/anime/${id}`);
  return data;
};

export const getLatestEpisodes = async () => {
  const { data } = await api.get('/latest');
  return data;
};

export const getLatestAnimeAdded = async () => {
  const { data } = await api.get('/latest-anime');
  return data;
};

export const filterAnime = async (opts) => {
  const { data } = await api.post('/filter', opts);
  return data;
};

export const getLinks = async (id) => {
  const { data } = await api.get(`/episode/${id}`);
  return data;
};
