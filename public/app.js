const beverages = [
    { id: 0, name: 'Water' },
    { id: 1, name: 'Coke' },
    { id: 2, name: 'Sprite' },
];

let coins = 0;
let inventory = [0, 0, 0];

async function init() {
    const res = await fetch('/inventory');
    inventory = await res.json();
    renderInventory();
}

function renderInventory() {
    beverages.forEach(({ id }) => {
        const qty = inventory[id];
        document.getElementById(`qty-${id}`).textContent = qty > 0 ? `${qty}` : 'Sold out';
        document.getElementById(`row-${id}`).classList.toggle('sold-out', qty == 0);
        document.getElementById(`btn-${id}`).disabled = (qty == 0);
        document.getElementById(`btn-${id}`).classList.toggle('sold-out', qty == 0);
    });

    document.getElementById('drink-section').classList.toggle('hidden', coins < 2);
}

function updateCoinDisplay() {
    document.getElementById('coin-count').textContent = coins;
    document.getElementById('quarters-needed').textContent = Math.max(0, 2 - coins);
    document.getElementById('drink-section').classList.toggle('hidden', coins < 2);
}

async function insertCoin() {
    const res = await fetch('/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coin: 1 })
    });
    coins = parseInt(res.headers.get('X-Coins'), 10);
    updateCoinDisplay();
}

async function cancelTransaction() {
    const res = await fetch('/', { method: 'DELETE' });
    const refund = parseInt(res.headers.get('X-Coins'));
    coins = 0;
    updateCoinDisplay();

    if (refund > 0) {
        document.getElementById('refund-message').textContent = `${refund} quarter${refund !== 1 ? 's' : ''} refunded.`;
        document.getElementById('refund-banner').classList.remove('hidden');
    }
}

async function buyItem(id) {
    const res = await fetch(`/inventory/${id}`, { method: 'PUT' });

    if (res.status == 200) {
        const change = parseInt(res.headers.get('X-Coins'));
        const remaining = parseInt(res.headers.get('X-Inventory-Remaining'));
        coins = 0;
        inventory[id] = remaining;
        updateCoinDisplay();
        renderInventory();

        document.getElementById('refund-message').textContent = `Purchase successful! ${change} quarter${change !== 1 ? 's' : ''} refunded.`;
        document.getElementById('refund-banner').classList.remove('hidden');

        return;
    }

    if (res.status == 403) {
        return;
    }

    if (res.status == 404) {
        const inventoryRes = await fetch('/inventory');
        inventory = await inventoryRes.json();
        renderInventory();
    }
}

init();