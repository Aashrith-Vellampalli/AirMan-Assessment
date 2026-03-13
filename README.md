# AirMan EPR

Full-stack application for managing **pilot training performance records (EPRs)**.
---

# Tech Stack

## Backend
- Node.js
- Express
- PostgreSQL
- TypeORM
- TypeScript

## Frontend
- React
- TypeScript
- TailwindCSS

---

# 1. Database Setup

### Install PostgreSQL

Download from:

https://www.postgresql.org/download/

Create a database:

```sql
CREATE DATABASE airman;
```
# 2. Backend Setup
- ```bash
  cd backend
- ```bash
  npm install
- check .env.example file and create .env accordingly
- ```bash
  npm run dev
- above command runs backend
# 3. Database Migration
- ```bash
  npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts
- this command creates tables
# 4. Frontend Setup
- ```bash
  cd frontend
- ```bash
  npm install
- check .env.example file and create .env accordingly
- ```bash
  npm run dev
- above command runs frontend

## AI Tools Used

- GitHub Copilot was used for UI improvements and generating some frontend boilerplate code.
- The backend architecture, API design, database schema, and core backend implementation were written entirely by me.
- Frontend state management and application logic were also implemented by me.
- AI tools were primarily used to improve visual styling and UI polish.
