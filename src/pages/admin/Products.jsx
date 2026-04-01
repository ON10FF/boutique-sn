import { useState } from 'react'
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useAdminProducts'
import { useCategories } from '../../hooks/useCategories'
import { formatPrice } from '../../utils/formatters'
import { Plus, Pencil, Trash2, X, Loader2, Package } from 'lucide-react'

const EMPTY_FORM = {
  name_fr: '', name_wo: '',
  description_fr: '', description_wo: '',
  price: '', compare_price: '',
  stock: '', category_id: '',
  images: '', is_active: true, is_featured: false
}

export default function Products() {
  const { data: products, isLoading } = useAdminProducts()
  const { data: categories } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (product) => {
    setEditing(product.id)
    setForm({
      name_fr: product.name_fr || '',
      name_wo: product.name_wo || '',
      description_fr: product.description_fr || '',
      description_wo: product.description_wo || '',
      price: product.price || '',
      compare_price: product.compare_price || '',
      stock: product.stock || '',
      category_id: product.category_id || '',
      images: product.images?.join(', ') || '',
      is_active: product.is_active,
      is_featured: product.is_featured
    })
    setShowForm(true)
  }

  const handleSubmit = async () => {
    const payload = {
      name_fr: form.name_fr,
      name_wo: form.name_wo || null,
      description_fr: form.description_fr || null,
      description_wo: form.description_wo || null,
      price: parseInt(form.price),
      compare_price: form.compare_price ? parseInt(form.compare_price) : null,
      stock: parseInt(form.stock),
      category_id: form.category_id || null,
      images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      is_active: form.is_active,
      is_featured: form.is_featured
    }

    if (editing) {
      await updateProduct.mutateAsync({ id: editing, ...payload })
    } else {
      await createProduct.mutateAsync(payload)
    }
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    await deleteProduct.mutateAsync(id)
    setConfirmDelete(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Produits</h1>
          <p className="text-sm text-gray-400">{products?.length || 0} produit(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Liste */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-orange-500" />
        </div>
      ) : products?.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">Aucun produit. Commencez par en ajouter un.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products?.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
              {/* Image */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img
                  src={product.images?.[0] || 'https://placehold.co/56x56/f3f4f6/9ca3af?text=?'}
                  alt={product.name_fr}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{product.name_fr}</p>
                <p className="text-orange-600 font-bold text-sm">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${product.stock > 3 ? 'bg-green-100 text-green-700' :
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-600'}`}>
                    Stock : {product.stock}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${product.is_active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    {product.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(product)}
                  className="p-2 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Pencil size={15} className="text-blue-500" />
                </button>
                <button
                  onClick={() => setConfirmDelete(product.id)}
                  className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={15} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-lg">
                {editing ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Nom FR */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Nom (Français) *</label>
                <input name="name_fr" value={form.name_fr} onChange={handleChange}
                  placeholder="Nom du produit"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>

              {/* Nom Wolof */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Nom (Wolof)</label>
                <input name="name_wo" value={form.name_wo} onChange={handleChange}
                  placeholder="Nom en Wolof"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>

              {/* Description FR */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Description (Français)</label>
                <textarea name="description_fr" value={form.description_fr} onChange={handleChange}
                  rows={2} placeholder="Description du produit"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
              </div>

              {/* Prix */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Prix (FCFA) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange}
                    placeholder="5000"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Prix barré</label>
                  <input name="compare_price" type="number" value={form.compare_price} onChange={handleChange}
                    placeholder="7000"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              </div>

              {/* Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Stock *</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange}
                    placeholder="10"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Catégorie</label>
                  <select name="category_id" value={form.category_id} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                    <option value="">Sans catégorie</option>
                    {categories?.map(c => (
                      <option key={c.id} value={c.id}>{c.name_fr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  URLs images (séparées par des virgules)
                </label>
                <input name="images" value={form.images} onChange={handleChange}
                  placeholder="https://..., https://..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>

              {/* Toggles */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange}
                    className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-gray-700">Actif</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange}
                    className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-gray-700">Produit vedette</span>
                </label>
              </div>

              {/* Bouton */}
              <button
                onClick={handleSubmit}
                disabled={createProduct.isPending || updateProduct.isPending}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
              >
                {(createProduct.isPending || updateProduct.isPending) ? (
                  <><Loader2 size={16} className="animate-spin" /> Enregistrement...</>
                ) : (
                  editing ? 'Enregistrer les modifications' : 'Créer le produit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Supprimer ce produit ?</h3>
            <p className="text-sm text-gray-400 mb-5">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl">
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleteProduct.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1">
                {deleteProduct.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}