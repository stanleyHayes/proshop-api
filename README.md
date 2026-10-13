# proshop-api

E-Commerce Application. proshop api is an application containing JavaScript. The checked-in dependency manifests use Express, MongoDB via Mongoose. Source modules cover `order`, `product`, `review`, `user`, `authentication`, `orders`, `products`, `reviews`, `users`.

## Repository layout

- `middleware/` — 1 tracked file(s); source examples: `middleware/auth.js`.
- `models/` — 4 tracked file(s); source examples: `models/order.js`, `models/product.js`.
- `routes/` — 5 tracked file(s); source examples: `routes/authentication.js`, `routes/orders.js`.

## Local setup

Run each package setup block from the repository root. For workspace repositories, install dependencies at the root before running application-specific scripts.

Clone this repository and enter its directory:

```sh
git clone https://github.com/stanleyHayes/proshop-api.git
cd proshop-api
```

### Node package: `package.json`

Use Node.js and npm.

```sh
npm install
```

- `npm run start` — runs the declared `start` script (`node server.js`).
- The package test script is a placeholder and exits with an error; it does not run an automated test suite.

## Configuration

The application declares `dotenv`. Review environment-variable references in the source and supply your own local values before starting it. Keep credentials out of Git; do not reuse committed credentials.

## Source entry points

- [middleware/auth.js](middleware/auth.js)
- [models/order.js](models/order.js)
- [models/product.js](models/product.js)
- [models/review.js](models/review.js)
- [models/user.js](models/user.js)
- [products.js](products.js)
- [routes/authentication.js](routes/authentication.js)
- [routes/orders.js](routes/orders.js)

## Development notes

Commands above come from the tracked manifests and source layout. External services and runtime configuration may be required. Documentation updates do not establish that the application is deployed or that its tests pass.
