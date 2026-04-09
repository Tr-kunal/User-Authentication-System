# Production-Ready Authentication & User Profile System

A clean, secure, production-inspired authentication and user profile backend system.
## Features
- **User Registration**: Secure password hashing, validations, role assumptions.
- **JWT Authentication**: Login to receive token. Tokens protect routes.
- **Profile Management**: Users can update their profiles or soft-delete accounts.
- **Admin Endpoints**: Role-based access control protecting admin paths. Admin can list, block, unblock, and soft-delete users.
- **Security Checkmarks**: Uses `bcrypt`, `cors`, `helmet`, `express-rate-limit`.

## Tech Stack
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **JWT** (`jsonwebtoken`) & `bcryptjs`
- `express-validator`

## Folder Structure
```
src/
│── config/        # Environment and DB config
│── controllers/   # Route handlers by domain
│── middleware/    # Auth, Validation, Errors, Roles
│── models/        # Mongoose schema definitions
│── routes/        # Router files binding handlers
│── utils/         # Helper functions for repeated logic
│── validators/    # Field requirement blueprints
│── app.js         # App bootstrapping
└── server.js      # TCP listener module
```

## Installation & Running Locally

1. Clone or copy contents.
2. `npm install`
3. Rename `.env.example` to `.env` and fill in properties (importantly `MONGO_URI` and `JWT_SECRET`).
4. `npm run dev` or `node src/server.js`

## Environment Variables
- `PORT`: TCP port that the Express app binds to (default 5000)
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: The cryptographic key used for signing JSON Web Tokens.
- `JWT_EXPIRES_IN`: e.g. `1d` for token duration.
- `CLIENT_URL`: Cross-Origin bounds if operating under specific endpoints.

## Future Improvements
- Refresh Tokens for hardened auth cycles.
- Redis invalidation layer for token blocks.
- Cloudinary profile picture uploads.
- Standardized Swagger docs.
