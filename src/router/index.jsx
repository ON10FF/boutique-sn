// src/router/index.jsx
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from '../components/layout/MainLayout'
import AdminLayout from '../components/layout/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import LoadingScreen from '../components/ui/LoadingScreen'

// Lazy loading par route = code splitting auto
const Home            = lazy(() => import('../pages/Home'))
const Shop            = lazy(() => import('../pages/Shop'))
const ProductDetail   = lazy(() => import('../pages/ProductDetail'))
const Cart            = lazy(() => import('../pages/Cart'))
const Checkout        = lazy(() => import('../pages/Checkout'))
const OrderTracking   = lazy(() => import('../pages/OrderTracking'))
const OrderSuccess    = lazy(() => import('../pages/OrderSuccess'))
const Login           = lazy(() => import('../pages/auth/Login'))
const Register        = lazy(() => import('../pages/auth/Register'))

// Admin
const AdminDashboard  = lazy(() => import('../pages/admin/Dashboard'))
const AdminProducts   = lazy(() => import('../pages/admin/Products'))
const AdminOrders     = lazy(() => import('../pages/admin/Orders'))
const AdminDeliveries = lazy(() => import('../pages/admin/Deliveries'))
const AdminCustomers  = lazy(() => import('../pages/admin/Customers'))
const AdminSettings   = lazy(() => import('../pages/admin/Settings'))

const wrap = (Component) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true,                     element: wrap(Home) },
      { path: 'boutique',                element: wrap(Shop) },
      { path: 'produit/:slug',           element: wrap(ProductDetail) },
      { path: 'panier',                  element: wrap(Cart) },
      { path: 'commande',                element: wrap(Checkout) },
      { path: 'commande/succes/:id',     element: wrap(OrderSuccess) },
      { path: 'suivi/:orderNumber',      element: wrap(OrderTracking) },
      { path: 'connexion',               element: wrap(Login) },
      { path: 'inscription',             element: wrap(Register) },
    ]
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,          element: wrap(AdminDashboard) },
      { path: 'produits',     element: wrap(AdminProducts) },
      { path: 'commandes',    element: wrap(AdminOrders) },
      { path: 'livraisons',   element: wrap(AdminDeliveries) },
      { path: 'clients',      element: wrap(AdminCustomers) },
      { path: 'parametres',   element: wrap(AdminSettings) },
    ]
  }
])