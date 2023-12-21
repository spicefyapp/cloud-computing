import express from "express";
import rempah from "./routesRempah.js";
import market from "./routesMarket.js";
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/rempah', rempah);
app.use('/market', market);

app.get('/', (req, res) => {
    res.send('API MAIN Rempah is working!');
});
app.get('/rempah', (req, res) => {
    res.send('API Data Rempah is working!');
});
app.get('/market', (req, res) => {
    res.send('API Market Rempah is working!');
});

// Error Handling
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
