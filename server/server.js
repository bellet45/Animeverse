import express from 'express';
import cors from 'cors';
import * as animeflv from 'animeflv-api';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Funciones a implementar:
// Buscar animes, Obtener detalles, Obtener episodios, Obtener últimos episodios, Obtener animes populares, Obtener anime por género, Obtener enlaces de reproducción

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    const results = await animeflv.searchAnime(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/anime/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`https://www3.animeflv.net/anime/${id}`);
    const $ = cheerio.load(data);
    
    const title = $('h1.Title').text();
    const cover = 'https://animeflv.net' + $('.AnimeCover .Image figure img').attr('src');
    const synopsis = $('.Description p').text();
    const rating = $('#votes_prmd').text();
    const status = $('.AnmStts span').text();
    
    const episodesMatch = data.match(/var episodes = (\[\[.*\]\]);/);
    let episodes = [];
    if (episodesMatch) {
      const episodesArr = JSON.parse(episodesMatch[1]);
      episodes = episodesArr.map(ep => ({
        episode: ep[0],
        id: ep[1]
      })).reverse(); // Reverse to have episode 1 first or keep it if we want latest first. Let's keep it descending as animeflv-api does, or reverse to match standard ascending. Actually, let's reverse so Watch.jsx shows episodes in order, wait animeflv-api returns ascending or descending? The UI usually shows them ascending or descending. Let's return ascending by reversing.
      // Wait, animeflv-api's getAnimeInfo returned them ascending (1, 2, 3...)
      episodes.reverse();
    }
    
    res.json({
      id,
      title,
      cover,
      synopsis,
      rating,
      status,
      episodes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/latest', async (req, res) => {
  try {
    const latest = await animeflv.getLatest();
    const formatted = latest.map(ep => {
      // url format: https://www3.animeflv.net/ver/anime-id-episode
      const parts = ep.url.split('/ver/')[1];
      const chapterMatch = parts.match(/^(.*)-(\d+(?:\.\d+)?)$/);
      const id = chapterMatch ? chapterMatch[1] : parts;
      return {
        ...ep,
        id
      };
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/latest-anime', async (req, res) => {
  try {
    const latest = await animeflv.searchAnimesByFilter({ statuses: ["En emision"] });
    res.json(latest ? latest.data : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/filter', async (req, res) => {
  try {
    const opts = req.body;
    const results = await animeflv.searchAnimesByFilter(opts);
    res.json(results ? results.data : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/episode/:id', async (req, res) => {
  try {
    const { id } = req.params; // format: anime-id-episode
    const { data } = await axios.get(`https://www3.animeflv.net/ver/${id}`);
    const videosMatch = data.match(/var videos = (\{[^;]+\});/);
    if (videosMatch) {
      const videos = JSON.parse(videosMatch[1]);
      res.json(videos.SUB || videos.LAT || []);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Animeverse API Proxy running on http://localhost:${port}`);
});
