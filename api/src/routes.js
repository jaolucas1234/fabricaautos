const express = require('express');
const router = express.Router();

// Example routes
router.get('/', (req, res) => {
    res.json({ titulo: 'Fabrica de automoveis 2025' });
});

module.exports = router;
