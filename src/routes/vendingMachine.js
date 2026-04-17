const express = require('express');
const router = express.Router();

const inventory = [5, 5, 5] // 3 types of beverages, initially stocked with 5 each
const NUM_BEVS_STOCKED = inventory.length;

let quarters = 0;

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

// GET /inventory (Get stock of all items in machine)
router.get('/inventory', (req, res) => {
    return res.status(200).json([...inventory]);
});

// GET /inventory/:id (Get stock of specified item :id in machine)
router.get('/inventory/:id', (req, res) => {
    const bevId = parseInt(req.params.id);

    if (Number.isNaN(bevId) || bevId < 0 || bevId >= NUM_BEVS_STOCKED) {
        console.warn(`GET /inventory/${req.params.id}: invalid item id`);
        return res.status(404).json({ error: `Item (ID: ${req.params.id}) not found.` });
    }

    return res.status(200).json(inventory[bevId]);
});

// PUT /inventory/:id (Purchase specified item :id from machine)



module.exports = router;