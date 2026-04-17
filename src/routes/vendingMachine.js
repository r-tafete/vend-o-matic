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
router.put('/inventory/:id', (req, res) => {
    const bevId = parseInt(req.params.id);

    // case: invalid beverage id provided
    if (Number.isNaN(bevId) || bevId < 0 || bevId >= NUM_BEVS_STOCKED) {
        console.warn(`PUT /inventory/${req.params.id}: invalid item id`);
        return res.status(404).json({ error: `Item (ID: ${req.params.id}) not found.` });
    }

    // case: insufficient funds
    if (quarters < 2) {
        console.warn(`PUT /inventory/${req.params.id}: insufficient funds. Current number of quarters: ${quarters}`);
        res.set('X-Coins', String(quarters)).status(403);
        return res.send();
    }

    // case: beverage out of stock
    if (inventory[bevId] < 1) {
        console.warn(`PUT /inventory/${req.params.id}: beverage (ID ${bevId}) is out of stock. Please select another beverage`);
        res.set('X-Coins', String(quarters)).status(404);
        return res.send();
    }

    // case: success
    const change = quarters - 2;
    quarters = 0;
    inventory[bevId] -= 1;

    res.set('X-Coins', String(change));
    res.set('X-Inventory-Remaining', inventory[bevId]);
    return res.status(200).json({
        "quantity": 1
    });
});


module.exports = router;