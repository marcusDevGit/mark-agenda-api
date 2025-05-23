// index.js
import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
});
