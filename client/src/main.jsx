import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import { Layout } from './Layout.jsx'
import { Recipes } from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout title="Рецепты">
        <Recipes />
      </Layout>
    ),
  },
  {
    path: "*/",
    action: () => redirect('/'),
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
