import express from "express";
import bodyParser from "body-parser";

import todosRoutes from "./routes/todos.js";

const app = express();

// MW for parsing Json:
app.use(bodyParser.json());

// MW for using the routes:
app.use(todosRoutes);

app.listen(3000);
