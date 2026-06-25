"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductImage } from "@/components/products/ProductImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useStorageState } from "@/hooks/useStorageState";
import { STORAGE_CACHE_KEYS } from "@/lib/storageCache";
import { useToastStore } from "@/stores/toastStore";
import { processImageFile } from "@/lib/imageUpload";
import { generateId, getProducts, saveProducts } from "@/lib/storage";
import { getCategories } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  image: "",
  stock: 0,
  category: "Classique",
};

const textFields = [
  ["name", "Nom", "text"],
  ["description", "Description", "text"],
  ["price", "Prix (USD)", "number"],
  ["stock", "Stock", "number"],
] as const;

export default function AdminProductsPage() {
  return (
    <Suspense fallback={null}>
      <AdminProductsContent />
    </Suspense>
  );
}

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const showToast = useToastStore((s) => s.show);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useStorageState(
    getProducts,
    [],
    STORAGE_CACHE_KEYS.products
  );
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [imageLoading, setImageLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);

  const categories = useMemo(() => getCategories(), [products, showForm]);

  const load = () => {
    setProducts(getProducts());
  };

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setEditing(null);
      setForm(emptyProduct);
      setCustomCategory(false);
      setShowForm(true);
    }
  }, [searchParams]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setCustomCategory(false);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    const cats = getCategories();
    setCustomCategory(!cats.includes(product.category));
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock,
      category: product.category,
    });
    setShowForm(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageLoading(true);
    try {
      const dataUrl = await processImageFile(file);
      setForm((prev) => ({ ...prev, image: dataUrl }));
      showToast("Image enregistrée localement");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Erreur lors du chargement",
        "error"
      );
    } finally {
      setImageLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.image) {
      showToast("Veuillez ajouter une image", "error");
      return;
    }

    if (!form.category.trim()) {
      showToast("Veuillez sélectionner une catégorie", "error");
      return;
    }

    const productData = { ...form, category: form.category.trim() };
    const current = getProducts();

    if (editing) {
      const updated = current.map((p) =>
        p.id === editing.id ? { ...p, ...productData } : p
      );
      saveProducts(updated);
      showToast("Produit modifié");
    } else {
      const newProduct: Product = {
        id: generateId("prod"),
        ...productData,
      };
      saveProducts([...current, newProduct]);
      showToast("Produit ajouté");
    }

    setShowForm(false);
    load();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    saveProducts(getProducts().filter((p) => p.id !== id));
    showToast("Produit supprimé", "info");
    load();
  };

  return (
    <>
      <AdminHeader title="Gestion des produits" />

      <div className="p-4 lg:p-8">
        <div className="mb-4 flex justify-end">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            <Plus size={16} />
            Ajouter un produit
          </button>
        </div>

        <Modal open={showForm} onClose={() => setShowForm(false)}>
          <form
            onSubmit={handleSave}
            className="flex max-h-[min(68dvh,calc(100dvh-6.5rem))] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl lg:max-h-[85vh] lg:rounded-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-2.5">
              <h2 className="text-sm font-bold text-gray-900">
                {editing ? "Modifier le produit" : "Nouveau produit"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-4 py-2.5">
              <div>
                <label className="text-[11px] font-medium text-gray-600">Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {form.image ? (
                  <div className="relative mt-1 overflow-hidden rounded-lg border border-gray-200">
                    <div className="relative h-20 w-full bg-gray-50">
                      <ProductImage src={form.image} alt="Aperçu" fill className="object-cover" />
                    </div>
                    <div className="absolute right-1.5 top-1.5 flex gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageLoading}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 shadow-sm"
                      >
                        <Upload size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-red-500 shadow-sm"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageLoading}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 py-3 text-xs text-gray-500"
                  >
                    <Upload size={16} />
                    {imageLoading ? "Chargement..." : "Ajouter une image"}
                  </button>
                )}
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-600">Catégorie</label>
                <select
                  value={customCategory ? "__new__" : form.category}
                  onChange={(e) => {
                    if (e.target.value === "__new__") {
                      setCustomCategory(true);
                      setForm((prev) => ({ ...prev, category: "" }));
                    } else {
                      setCustomCategory(false);
                      setForm((prev) => ({ ...prev, category: e.target.value }));
                    }
                  }}
                  required={!customCategory}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-300"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__new__">+ Nouvelle catégorie</option>
                </select>
                {customCategory && (
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    required
                    placeholder="Nouvelle catégorie"
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-300"
                  />
                )}
              </div>

              {textFields.map(([key, label, type]) => (
                <div key={key}>
                  <label className="text-[11px] font-medium text-gray-600">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [key]: type === "number" ? Number(e.target.value) : e.target.value,
                      })
                    }
                    required
                    step={type === "number" && key === "price" ? "0.01" : "1"}
                    min={type === "number" ? 0 : undefined}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-300"
                  />
                </div>
              ))}
            </div>

            <div className="flex shrink-0 gap-2 border-t border-gray-100 bg-white px-4 py-2.5">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-xs font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={imageLoading}
                className="flex-1 rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </Modal>

        {products.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="Aucun produit"
            description="Ajoutez votre premier produit."
          />
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatPrice(product.price)} · Stock: {product.stock}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
