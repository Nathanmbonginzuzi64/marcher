"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductImage } from "@/components/products/ProductImage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
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
    <Suspense fallback={<LoadingSpinner />}>
      <AdminProductsContent />
    </Suspense>
  );
}

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const showToast = useToastStore((s) => s.show);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [imageLoading, setImageLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);

  const categories = useMemo(() => getCategories(), [products, showForm]);

  const load = () => {
    setProducts(getProducts());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

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

  if (loading) return <LoadingSpinner />;

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

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 lg:items-center">
            <form
              onSubmit={handleSave}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 lg:rounded-3xl"
            >
              <h2 className="mb-4 text-lg font-bold">
                {editing ? "Modifier" : "Nouveau produit"}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Image du produit
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {form.image ? (
                    <div className="relative mt-2 overflow-hidden rounded-xl border border-gray-200">
                      <div className="relative aspect-video w-full bg-gray-50">
                        <ProductImage
                          src={form.image}
                          alt="Aperçu"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute right-2 top-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={imageLoading}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-700 shadow-sm"
                        >
                          <Upload size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow-sm"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageLoading}
                      className="mt-2 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-8 text-gray-500 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-600"
                    >
                      <Upload size={24} />
                      <span className="text-sm font-medium">
                        {imageLoading
                          ? "Chargement..."
                          : "Télécharger une image"}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        JPG, PNG, WebP — max 5 Mo
                      </span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Catégorie
                  </label>
                  <select
                    value={customCategory ? "__new__" : form.category}
                    onChange={(e) => {
                      if (e.target.value === "__new__") {
                        setCustomCategory(true);
                        setForm((prev) => ({ ...prev, category: "" }));
                      } else {
                        setCustomCategory(false);
                        setForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }));
                      }
                    }}
                    required={!customCategory}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-300"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__new__">+ Nouvelle catégorie</option>
                  </select>

                  {customCategory && (
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      required
                      placeholder="Nom de la nouvelle catégorie"
                      className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-300"
                    />
                  )}

                  <div className="mt-3">
                    <p className="mb-2 text-[11px] font-medium text-gray-500">
                      Catégories disponibles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setCustomCategory(false);
                            setForm((prev) => ({ ...prev, category: cat }));
                          }}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                            form.category === cat && !customCategory
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {textFields.map(([key, label, type]) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-gray-600">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [key]:
                            type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        })
                      }
                      required
                      step={type === "number" && key === "price" ? "0.01" : "1"}
                      min={type === "number" ? 0 : undefined}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-300"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={imageLoading}
                  className="flex-1 rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}

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
