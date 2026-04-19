import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('Mood Playlist Generator API is running!');
});

app.listen(app.get('port'), () => {
  console.log(`Server is running at http://localhost:${app.get('port')}`);
});