const express = require('express');
const router = express.Router();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost${port}`);
});