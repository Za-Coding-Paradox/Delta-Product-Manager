# Installation Guide: React Store Manager

Welcome to the setup guide for the React Store Manager! This application is built using React and Vite. Follow these steps to get your local development environment up and running.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
* **Node.js** (v14.18.0 or higher) - [Download here](https://nodejs.org/)
* A package manager like **npm** (comes with Node.js) or **yarn**.

---

## Step 1: Scaffold the Project

We will use Vite to create a blazing-fast React boilerplate. Open your terminal and run:

```bash
npm create vite@latest store-manager -- --template react
```

*Note: You can replace `store-manager` with your preferred folder name.*

## Step 2: Install Dependencies

Navigate into your newly created project directory and install the required React packages:

```bash
cd store-manager
npm install
```

## Step 3: Clean Up Boilerplate

Vite provides some default files we don't need for this specific app. 

1. Navigate to the `src/` directory.
2. **Delete** the following files and folders:
   * `App.css`
   * `index.css`
   * `assets/` folder

## Step 4: Add the Application Code

Now, recreate the component structure and paste the code provided previously.

1. Inside `src/`, create a new file named `App.css` and paste the custom CSS.
2. Replace the contents of `src/App.jsx` with the new logic.
3. Replace the contents of `src/main.jsx` with the updated entry code.
4. Inside `src/`, create a new folder named `components/`.
5. Create the following files inside `src/components/` and paste their respective code:
   * `ProductForm.jsx`
   * `ProductList.jsx`
   * `ProductCard.jsx`
   * `Cart.jsx`
   * `CartItem.jsx`
   * `CartSummary.jsx`

## Step 5: Start the Development Server

You are all set! Boot up the local server by running:

```bash
npm run dev
```

Open your browser and navigate to the local URL provided in your terminal (usually `http://localhost:5173`).

---
**Happy coding!** 🚀