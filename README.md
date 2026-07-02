# Nova - Marketing Digital Platform

Plateforme SaaS complète pour optimiser et gérer tous les aspects du marketing digital.

## 📁 Structure du Projet

```
Nova/
├── frontend/                 # Application React + Vite
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                  # API Hono + tRPC + Drizzle
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── drizzle.config.ts
│   └── .env
│
├── docker-compose.yml        # Dev avec Docker
└── README.md
```

## 🚀 Quick Start

### Installation

```bash
# Frontend
cd frontend
npm install

# Backend (dans un autre terminal)
cd backend
npm install
```

### Configuration

```bash
# Backend - Créer .env
cd backend
cp .env.example .env
```

### Démarrer le développement

```bash
# Terminal 1 - Frontend (port 5173)
cd frontend
npm run dev

# Terminal 2 - Backend (port 3000)
cd backend
npm run dev
```

### Docker Compose

```bash
docker-compose up
```

## 📚 Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## 🔧 Stack Technique

### Frontend
- React 19 + TypeScript
- Vite 7.2
- Tailwind CSS + Shadcn/ui
- React Router 7

### Backend
- Hono 4.8
- tRPC 11.8
- Drizzle ORM 0.45
- MySQL 8
