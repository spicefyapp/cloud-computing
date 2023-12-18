import express from "express";
import routes from "./routes.js";

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Error Handling
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
