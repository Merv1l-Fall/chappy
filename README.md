# Chappy

A small full‑stack chat app (React + TypeScript frontend, Express + TypeScript backend, DynamoDB).  
Frontend lives in `src/`, backend in `srcServer/`.

## Whats in the repo?
- Frontend: React + Typescript, Vite
- Backend: Express + Typescript

## What do you need to run it?
- Node.js
- npm
- AWS credentials for dynamoDB

## .env file
Create a `.env` in the root with
- JWT_SECRET= your_jwt_secret
- TABLE_NAME = your_table_name
- ACCESS_KEY = your_AWS_access_key
- SECRET_ACCESS_KEY = your_secret_AWS_access_key
- PORT = a_port

## Install and run
From project root

1. install deps
```bash
npm install
```
2. Run the server
```bash
npm run restart-server
```
3. Go to localhost:<your_port> in your browser

## License
Created by Vilmer Fall