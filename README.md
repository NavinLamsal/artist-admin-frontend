# Artist Admin Frontend

Artist Admin Frontend is built using **React + TypeScript + Vite** .This Frontend is designed to handle data management for an artist admin management system.


# Tech Stack

### Core
- React
- TypeScript
- Vite

### Styling & UI
- TailwindCSS
- shadcn/ui
- lucide-react (icons)

### State & Data Management
- TanStack React Query
- Axios

### Forms & Validation
- React Hook Form
- Yup

### Routing
- React Router DOM

### Utilities
- React Dropzone (file uploads)
- React Toastify (notifications)

---


# Prerequisites

Make sure the following tools are installed on your system before running the project.

## 1. Node.js

You must have **Node.js (v18 or later)** installed.

Check your version:

```bash
node -v
```

Download Node.js if not installed:

https://nodejs.org/

---

## 2. npm or Yarn

The project uses **npm** by default.

Check npm version:

```bash
npm -v
```

npm is installed automatically with Node.js.

Alternatively you can use **Yarn**:

```bash
yarn -v
```

Install Yarn globally if needed:

```bash
npm install -g yarn
```

---

# Project Setup

Follow the steps below to run the project locally.

---

## 1. Clone the Repository

```bash
git clone git clone https://github.com/navinlamsal/artist-admin-frontend
cd artist-admin-frontend
```

---

## 2. Install Dependencies

Using **npm**

```bash
npm install
```

or using **yarn**

```bash
yarn install
```

---

## 3. Setup Environment Variables

Create a `.env` file in the root of the project.


Example `.env` file:

```env
VITE_BASE_URL='http://localhost:5000/api'
```



## 4. Run Development Server

Start the Vite development server.

```bash
npm run dev
```
or

```bash
yarn dev
```
Example output:

```
VITE v5.x.x  ready in 300 ms

➜  Local:   http://localhost:5173/
```

---

## 5. Preview the application

```
Local:   http://localhost:5173/
```