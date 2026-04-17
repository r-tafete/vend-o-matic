import express from 'express'
import vendingMachine from './routes/vendingMachine';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', vendingMachine);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;