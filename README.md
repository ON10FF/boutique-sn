# 🛍️ BoutiqueSN — E-commerce Local Sénégal

Une boutique e-commerce moderne, simple et rapide, conçue spécifiquement
pour le marché local sénégalais. Interface bilingue Français/Wolof,
paiements mobile money intégrés, optimisée pour les connexions lentes.

---

## ✨ Fonctionnalités

### Boutique
- Catalogue produits avec filtres par catégorie
- Recherche en temps réel
- Fiche produit détaillée avec galerie d'images
- Panier persistant (localStorage)
- Interface bilingue 🇫🇷 Français / 🇸🇳 Wolof

### Paiements
- 🔵 Wave — lien de paiement direct
- 🟠 Orange Money — lien de paiement direct
- 🟢 Free Money
- 💵 Paiement cash à la livraison

### Commandes
- Formulaire de commande simplifié
- Sélection de zone de livraison avec frais calculés
- Suivi de commande par numéro
- Notification automatique via WhatsApp
- Bouton WhatsApp flottant sur toutes les pages

### Dashboard Admin
- Statistiques en temps réel (CA, commandes, clients)
- CRUD produits complet (ajouter, modifier, supprimer)
- Gestion des commandes avec changement de statut
- Confirmation de paiement manuelle
- Notification client via WhatsApp directement depuis l'admin
- Gestion des zones de livraison
- Rôles utilisateurs (admin / customer)

### Technique
- ⚡ PWA — installable sur mobile, fonctionne offline
- 🚀 Optimisé connexion lente (skeleton loaders, cache, lazy loading)
- 🔒 Authentification Supabase avec RLS
- 📱 100% responsive (mobile first)

---

## 🛠️ Stack technique

| Outil | Usage |
|---|---|
| React 18 + Vite | Frontend |
| TailwindCSS | Styles |
| Supabase | Backend, Auth, Base de données |
| React Query | Cache & fetching |
| Zustand | State management |
| React Router v6 | Navigation |
| i18next | Multilangue FR/WO |
| Lucide React | Icônes |
| vite-plugin-pwa | PWA & offline |

