import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import textRoutes from './routes/textRoutes.js'

dotenv.config() // 꼭 이거 있어야 .env가 적용됨

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use('/api/genai', textRoutes)

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
