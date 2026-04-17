const express = require('express');
const router = express.Router();

let quarters = 0;
const inventory = [5, 5, 5] // 3 types of beverages, initially stocked with 5 each

// PUT / (Put 1 quarter in the machine)
router.put('/', (req, res) => {
    quarters += 1;
    res.set('X-Coins', String(quarters)).status(204);
    return res.send();
});

// DELETE / (Return all quarters)
router.delete('/', (req, res) => {
    res.set('X-Coins', String(quarters)).status(204);
    quarters = 0;
    return res.send();
});

export default router;