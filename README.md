# Vend-O-Matic

An HTTP-based vending machine service that simulates coin insertion, inventory management, and beverage purchases.

## Overview

Vend-O-Matic is a small Express.js service that models a physical beverage vending machine. It exposes a REST API that a frontend (or any HTTP client) can use to insert coins, check inventory, purchase beverages, and cancel transactions. State is held in memory for the lifetime of the server process.

## Constraints

- Only US quarters are accepted — one per request
- Each beverage costs 2 quarters
- The machine holds 3 beverages at 5 units each
- Only one beverage is dispensed per transaction
- Extra coins beyond the purchase price are returned automatically
- All requests and responses use `application/json`

## Tech

- Node.js
- Express.js

## Setup & Run

From the root directory, run:

```bash
npm install
npm start
```

Then open http://localhost:3000 in your browser. The frontend is served automatically.

## API

### Insert coin
`PUT /`
```json
{ "coin": 1 }
```
- `204 No Content`
- `X-Coins` header → total quarters currently held

### Cancel transaction
`DELETE /`
- `204 No Content`
- `X-Coins` header → quarters returned

### Get inventory
`GET /inventory`
- `200 OK`
- Body: `[5, 5, 5]` (array of quantities, one per beverage)

### Get single item
`GET /inventory/:id`
- `200 OK`
- Body: quantity as integer

### Purchase item
`PUT /inventory/:id`

Success:
- `200 OK`
- `X-Coins` header → change returned
- `X-Inventory-Remaining` header → updated stock for that item
- Body: `{ "quantity": 1 }`

Errors:
- `403` — fewer than 2 quarters inserted (`X-Coins` → current balance)
- `404` — item out of stock (`X-Coins` → coins still held)

## Additional Considerations

### Restock endpoint
There is no restock API endpoint. This is intentional — the person restocking the machine is not the same person using it, and that operation would realistically happen physically, not over HTTP. A restock endpoint could be added later if the use case changes, but it is out of scope for this implementation.

### Database / persistence
State resets every time the server restarts. A database was deliberately not added — nobody logs into a vending machine, so there is no meaningful user data to persist. Inventory could be persisted to survive restarts, but for a machine that gets physically restocked anyway, this adds complexity without a clear benefit at this stage.

### Beverage count constant
The number of beverages is implicitly determined by the `beverages` array defined at the top of the router. If you want to add a fourth option, you add it to that array and add the corresponding row and button to `index.html`. 

One thing to keep in mind: the array is a snapshot at startup. If you were to push a new item into it at runtime, nothing in the HTML would exist to display it. This is a non-issue in practice since adding a new beverage requires a code change and a restart anyway — but it is worth knowing if you plan to scale this out. A restock endpoint would not solve this for the reasons above; it is more of an architectural consideration for future growth.