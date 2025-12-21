import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconHome, IconShoppingBag, IconUsers, IconMessage, IconLogout, IconPlus,
  IconLoader, IconAlertCircle, IconX, IconUpload, IconTrash, IconEdit,
} from "@tabler/icons-react";
import { userlist, usermessage, createproduct, productlist, DeleteProduct } from "../../api/authService";
import type { MessageData } from "../../api/authService";

const API_BASE_URL = "https://e-commerce-3-clba.onrender.com";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  createdAt: string;
}

const MENU = [
  { label: "Dashboard", icon: IconHome },
  { label: "Produits", icon: IconShoppingBag },
  { label: "Clients", icon: IconUsers },
  { label: "Messages", icon: IconMessage },
];

const CATEGORIES = [
  { value: "Hommes", label: "Hommes" },
  { value: "Femmes", label: "Femmes" },
  { value: "Accessoires", label: "Accessoires" },
  { value: "Chaussures", label: "Chaussures" },
  { value: "other", label: "Autre" },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    title: "", description: "", price: 0, category: "", stock: 0,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        if (active === "Dashboard") {
          const [u, m, p] = await Promise.all([
            userlist().catch(() => []),
            usermessage().catch(() => []),
            productlist().catch(() => [])
          ]);
          setUsers(u);
          setMessages(m);
          setProducts(p);
        } else if (active === "Clients") setUsers(await userlist());
        else if (active === "Messages") setMessages(await usermessage());
        else if (active === "Produits") setProducts(await productlist());
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    if (["Dashboard", "Clients", "Messages", "Produits"].includes(active)) loadData();
  }, [active]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) return alert("Maximum 5 images");
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (files.some(f => !validTypes.includes(f.type))) return alert("Formats JPG, PNG, WEBP uniquement");
    if (files.some(f => f.size > 5 * 1024 * 1024)) return alert("Images trop volumineuses (max 5MB)");
    
    setSelectedFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrls(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviewUrls(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productForm.price <= 0) return alert("Prix invalide");
    if (productForm.stock < 0) return alert("Stock invalide");
    if (!productForm.title.trim() || !productForm.description.trim() || !productForm.category) return alert("Champs manquants");
    if (selectedFiles.length === 0) return alert("Au moins une image requise");

    setFormLoading(true);
    try {
      await createproduct({ ...productForm, images: selectedFiles });
      setProducts(await productlist());
      setProductForm({ title: "", description: "", price: 0, category: "", stock: 0 });
      setSelectedFiles([]);
      setPreviewUrls([]);
      setShowProductForm(false);
      alert("Produit créé!");
    } catch (err: any) {
      alert("Erreur: " + (err.message || "Création impossible"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
  if (!confirm("Supprimer ce produit ?")) return;
  
  setDeleteLoading(id);
  
  try {
    // ✅ 1. Supprime d'abord du state (mise à jour optimiste)
    setProducts(prev => prev.filter(p => p._id !== id));
    
    // ✅ 2. Ensuite appelle l'API
    await DeleteProduct(id);
    
    alert("Produit supprimé!");
  } catch (err: any) {
    // ❌ Si erreur, recharge la liste pour restaurer l'état correct
    alert("Erreur: " + (err.message || "Suppression impossible"));
    try {
      setProducts(await productlist());
    } catch (reloadErr) {
      console.error("Erreur rechargement:", reloadErr);
    }
  } finally {
    setDeleteLoading(null);
  }
};

  const statCards = [
    { label: "Total Clients", value: users.length, icon: IconUsers, color: "#FF7F00", bgColor: "#FFF3E0" },
    { label: "Total Produits", value: products.length, icon: IconShoppingBag, color: "#8E8E8E", bgColor: "#F5F5F5" },
    { label: "Messages", value: messages.length, icon: IconMessage, color: "#FF7F00", bgColor: "#FFF3E0" },
  ];

  const inputStyle = {
    width: "100%", padding: "0.875rem", border: "2px solid #E0E0E0",
    borderRadius: "12px", fontSize: "1rem", outline: "none", transition: "border 0.2s"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAFAFA", fontFamily: "Work Sans, sans-serif" }}>
      <aside style={{ width: "280px", background: "white", padding: "2rem 1.25rem", boxShadow: "2px 0 10px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "1.75rem", fontWeight: "700", background: "linear-gradient(135deg, #FF7F00 0%, #FF9933 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "3rem", textAlign: "center" }}>
          DjassamanShop
        </div>
        <div style={{ flex: 1 }}>
          {MENU.map(item => (
            <motion.div key={item.label} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}
              style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", borderRadius: "14px", cursor: "pointer",
                background: active === item.label ? "#FF7F00" : "transparent", color: active === item.label ? "white" : "#666",
                marginBottom: "0.5rem", fontWeight: active === item.label ? "600" : "500", transition: "all 0.2s" }}
              onClick={() => setActive(item.label)}>
              <item.icon size={22} />
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { localStorage.removeItem("adminToken"); window.location.href = "/"; }}
          style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", borderRadius: "14px", cursor: "pointer", background: "#8E8E8E", color: "white", marginTop: "1rem", fontWeight: "600" }}>
          <IconLogout size={22} />
          <span>Déconnexion</span>
        </motion.div>
      </aside>

      <main style={{ flex: 1, padding: "2.5rem", overflowY: "auto", background: "#FAFAFA" }}>
        <motion.h1 initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "2.5rem", color: "#1A1A1A" }}>
          {active}
        </motion.h1>

        {active === "Dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {statCards.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
                style={{ background: stat.bgColor, padding: "2rem", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.05)", transition: "all 0.3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: "#666", marginBottom: "0.75rem", fontSize: "0.95rem", fontWeight: "500" }}>{stat.label}</div>
                    <div style={{ fontSize: "2.25rem", fontWeight: "700", color: stat.color }}>{stat.value}</div>
                  </div>
                  <div style={{ background: stat.color, padding: "1rem", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <stat.icon size={32} style={{ color: "white" }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {active === "Produits" && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowProductForm(true)}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem 1.75rem", background: "#FF7F00", color: "white",
                  borderRadius: "14px", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: "600", boxShadow: "0 4px 12px rgba(255,127,0,0.25)" }}>
                <IconPlus size={20} /> Ajouter un produit
              </motion.button>
            </div>
            <div style={{ background: "white", padding: "2rem", borderRadius: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.05)" }}>
              <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", color: "#1A1A1A", fontWeight: "600" }}>
                Liste des produits ({products.length})
              </h2>
              {loading ? (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <IconLoader size={40} style={{ animation: "spin 1s linear infinite", color: "#FF7F00" }} />
                  <p style={{ marginTop: "1rem", color: "#666" }}>Chargement...</p>
                </div>
              ) : error ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", background: "#FEE", borderRadius: "12px", color: "#C33" }}>
                  <IconAlertCircle size={24} />
                  <span>{error}</span>
                </div>
              ) : products.length === 0 ? (
                <p style={{ textAlign: "center", padding: "3rem", color: "#999" }}>Aucun produit</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", borderBottom: "2px solid #F0F0F0" }}>
                        {["Image", "Titre", "Prix", "Catégorie", "Stock", "Actions"].map(h => (
                          <th key={h} style={{ padding: "1rem", color: "#666", fontWeight: "600" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, i) => {
                        const url = p.images[0]?.startsWith('http') ? p.images[0] : `${API_BASE_URL}${p.images[0]}`;
                        return (
                          <tr key={p._id} style={{ borderBottom: "1px solid #F5F5F5", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                            <td style={{ padding: "1rem" }}>
                              <img src={url} alt={p.title} onError={(e) => e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23f0f0f0" width="60" height="60" rx="8"/%3E%3C/svg%3E'}
                                style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "12px", border: "1px solid #E0E0E0" }} />
                            </td>
                            <td style={{ padding: "1rem", color: "#333", fontWeight: "500" }}>{p.title}</td>
                            <td style={{ padding: "1rem", color: "#FF7F00", fontWeight: "600" }}>{p.price} FCFA</td>
                            <td style={{ padding: "1rem", color: "#666" }}>{p.category}</td>
                            <td style={{ padding: "1rem", color: "#666" }}>{p.stock}</td>
                            <td style={{ padding: "1rem" }}>
                              <div style={{ display: "flex", gap: "0.75rem" }}>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <IconEdit size={20} style={{ cursor: "pointer", color: "#8E8E8E" }} />
                                </motion.div>
                                <motion.div whileHover={{ scale: deleteLoading === p._id ? 1 : 1.1 }} whileTap={{ scale: deleteLoading === p._id ? 1 : 0.9 }}>
                                  {deleteLoading === p._id ? (
                                    <IconLoader size={20} style={{ animation: "spin 1s linear infinite", color: "#ff6b6b" }} />
                                  ) : (
                                    <IconTrash size={20} style={{ cursor: "pointer", color: "#ff6b6b" }} onClick={() => handleDeleteProduct(p._id)} />
                                  )}
                                </motion.div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {active === "Clients" && (
          <div style={{ background: "white", padding: "2rem", borderRadius: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", color: "#1A1A1A", fontWeight: "600" }}>
              Liste des clients ({users.length})
            </h2>
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem" }}><IconLoader size={40} style={{ animation: "spin 1s linear infinite", color: "#FF7F00" }} /></div>
            ) : users.length === 0 ? (
              <p style={{ textAlign: "center", padding: "3rem", color: "#999" }}>Aucun client</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "2px solid #F0F0F0" }}>
                    {["Nom complet", "Email", "Téléphone"].map(h => (
                      <th key={h} style={{ padding: "1rem", color: "#666", fontWeight: "600" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #F5F5F5", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                      <td style={{ padding: "1rem", color: "#333", fontWeight: "500" }}>{u.firstname} {u.lastname}</td>
                      <td style={{ padding: "1rem", color: "#666" }}>{u.email}</td>
                      <td style={{ padding: "1rem", color: "#666" }}>{u.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {active === "Messages" && (
          <div style={{ background: "white", padding: "2rem", borderRadius: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", color: "#1A1A1A", fontWeight: "600" }}>
              Messages reçus ({messages.length})
            </h2>
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem" }}><IconLoader size={40} style={{ animation: "spin 1s linear infinite", color: "#FF7F00" }} /></div>
            ) : messages.length === 0 ? (
              <p style={{ textAlign: "center", padding: "3rem", color: "#999" }}>Aucun message</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {messages.map((m, i) => (
                  <motion.div key={m._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: i % 2 === 0 ? "#FFF3E0" : "#F5F5F5", padding: "1.75rem", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "1.1rem", color: "#1A1A1A" }}>{m.name}</div>
                        <div style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>{m.email}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: "600", marginBottom: "0.75rem", color: i % 2 === 0 ? "#FF7F00" : "#8E8E8E" }}>
                      Sujet: {m.sujet}
                    </div>
                    <div style={{ color: "#444", lineHeight: 1.6 }}>{m.message}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {showProductForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex",
              alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "2rem", backdropFilter: "blur(4px)" }}
            onClick={() => setShowProductForm(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "white", borderRadius: "24px", padding: "2.5rem", maxWidth: "640px", width: "100%",
                maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#1A1A1A" }}>Ajouter un produit</h2>
                <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <IconX size={28} style={{ cursor: "pointer", color: "#999" }} onClick={() => setShowProductForm(false)} />
                </motion.div>
              </div>

              <form onSubmit={handleSubmitProduct} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#333" }}>Titre *</label>
                  <input type="text" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#FF7F00"} onBlur={(e) => e.target.style.borderColor = "#E0E0E0"} required />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#333" }}>Description *</label>
                  <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={4}
                    style={{ ...inputStyle, resize: "vertical" }} onFocus={(e) => e.target.style.borderColor = "#FF7F00"} onBlur={(e) => e.target.style.borderColor = "#E0E0E0"} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#333" }}>Prix (FCFA) *</label>
                    <input type="number" min="1" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#FF7F00"} onBlur={(e) => e.target.style.borderColor = "#E0E0E0"} required />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#333" }}>Stock</label>
                    <input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#8E8E8E"} onBlur={(e) => e.target.style.borderColor = "#E0E0E0"} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#333" }}>Catégorie *</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#FF7F00"} onBlur={(e) => e.target.style.borderColor = "#E0E0E0"} required>
                    <option value="">Sélectionner</option>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#333" }}>Images (max 5) *</label>
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "2rem",
                    border: "2px dashed #E0E0E0", borderRadius: "12px", cursor: "pointer", background: "#FAFAFA" }}>
                    <IconUpload size={24} color="#FF7F00" />
                    <span style={{ color: "#666" }}>Sélectionner des images</span>
                    <input type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} style={{ display: "none" }} />
                  </label>
                  {previewUrls.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.75rem", marginTop: "1rem" }}>
                      {previewUrls.map((url, i) => (
                        <div key={i} style={{ position: "relative" }}>
                          <img src={url} alt={`Preview ${i}`} style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "12px", border: "2px solid #E0E0E0" }} />
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconX size={20} style={{ position: "absolute", top: "5px", right: "5px", background: "white", borderRadius: "50%",
                              cursor: "pointer", padding: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }} onClick={() => removeImage(i)} />
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowProductForm(false)}
                    style={{ flex: 1, padding: "1rem", border: "2px solid #E0E0E0", borderRadius: "12px", background: "white", cursor: "pointer", fontSize: "1rem", fontWeight: "600", color: "#666" }}>
                    Annuler
                  </motion.button>
                  <motion.button type="submit" disabled={formLoading} whileHover={{ scale: formLoading ? 1 : 1.02 }} whileTap={{ scale: formLoading ? 1 : 0.98 }}
                    style={{ flex: 1, padding: "1rem", border: "none", borderRadius: "12px", background: formLoading ? "#ccc" : "#FF7F00",
                      color: "white", cursor: formLoading ? "not-allowed" : "pointer", fontSize: "1rem", fontWeight: "600",
                      boxShadow: formLoading ? "none" : "0 4px 12px rgba(255,127,0,0.25)" }}>
                    {formLoading ? "Création..." : "Créer"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}