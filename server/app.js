import express from 'express';
import cors from 'cors';
import genaiRoutes from './routes/genai.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use('/api/genai', genaiRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
