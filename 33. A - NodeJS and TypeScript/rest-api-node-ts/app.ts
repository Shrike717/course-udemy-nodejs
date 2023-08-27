import express from "express";

import todosRoutes from "./routes/todos";

const app = express();

// MW for using the routes:
app.use(todosRoutes);

app.listen(3000);
