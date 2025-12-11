import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconHome,
  IconShoppingBag,
  IconUsers,
  IconChartBar,
  IconMessage,
  IconLogout,
  IconPlus,
  IconLoader,
  IconAlertCircle,
  IconX,
  IconUpload,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react";
import { userlist, usermessage, createproduct, productlist } from "../../api/authService";
import type { MessageData, ProductData } from "../../api/authService";

// URL de base de votre API
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

export default function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const menu = [
    { label: "Dashboard", icon: IconHome },
    { label: "Produits", icon: IconShoppingBag },
    { label: "Clients", icon: IconUsers },
    { label: "Statistiques", icon: IconChartBar },
    { label: "Messages", icon: IconMessage },
  ];

  const categories = [
    { value: "electronics", label: "Électronique" },
    { value: "clothing", label: "Vêtements" },
    { value: "food", label: "Alimentation" },
    { value: "books", label: "Livres" },
    { value: "other", label: "Autre" },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        if (active === "Clients") {
          const data = await userlist();
          setUsers(data);
        } else if (active === "Messages") {
          const data = await usermessage();
          setMessages(data);
        } else if (active === "Produits") {
          const data = await productlist();
          setProducts(data);
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des données");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (active === "Clients" || active === "Messages" || active === "Produits") {
      loadData();
    }
  }, [active]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + selectedFiles.length > 5) {
        alert("Maximum 5 images autorisées");
        return;
      }

      setSelectedFiles((prev) => [...prev, ...files]);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.title || !productForm.description || !productForm.category) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("Veuillez ajouter au moins une image");
      return;
    }

    setFormLoading(true);

    try {
      const productData: ProductData = {
        ...productForm,
        images: selectedFiles,
      };

      await createproduct(productData);
      
      // Recharger la liste des produits après création
      const updatedProducts = await productlist();
      setProducts(updatedProducts);

      setProductForm({
        title: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
      setShowProductForm(false);
      
      alert("Produit créé avec succès !");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FF7F00 0%, #8E8E8E 100%)",
        fontFamily: "Work Sans, sans-serif",
      }}
    >
      <aside
        style={{
          width: "260px",
          background: "rgba(255,255,255,0.95)",
          padding: "2rem 1rem",
          borderRight: "1px solid rgba(224,224,224,0.5)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#FF7F00",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          DjassamanShop
        </div>

        <div style={{ flex: 1 }}>
          {menu.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.875rem 1.25rem",
                borderRadius: "12px",
                cursor: "pointer",
                background:
                  active === item.label
                    ? "linear-gradient(120deg, #FFE0BF, #EFEFEF)"
                    : "transparent",
                color: active === item.label ? "#FF7F00" : "#6B6B6B",
                marginBottom: "0.5rem",
                fontWeight: active === item.label ? "600" : "normal",
              }}
              onClick={() => setActive(item.label)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0.875rem 1.25rem",
            borderRadius: "12px",
            cursor: "pointer",
            background: "#FF7F00",
            color: "#FFF",
            marginTop: "1rem",
          }}
        >
          <IconLogout size={20} />
          <span>Déconnexion</span>
        </motion.div>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "2rem",
          overflowY: "auto",
          color: "#FFF",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "2rem",
          }}
        >
          {active}
        </motion.h1>

        {active === "Dashboard" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              { label: "Total Clients", value: users.length, icon: IconUsers },
              { label: "Total Produits", value: products.length, icon: IconShoppingBag },
              { label: "Messages", value: messages.length, icon: IconMessage },
              { label: "Ventes", value: "0 €", icon: IconChartBar },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "2rem",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ opacity: 0.8, marginBottom: "0.5rem" }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                      {stat.value}
                    </div>
                  </div>
                  <stat.icon size={40} style={{ opacity: 0.6 }} />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {active === "Produits" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "2rem",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProductForm(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 1.5rem",
                  background: "#8E8E8E",
                  color: "#FFF",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                <IconPlus size={20} /> Ajouter un produit
              </motion.button>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                padding: "1.5rem",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}
            >
              <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
                Liste des produits ({products.length})
              </h2>

              {loading ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <IconLoader size={40} style={{ animation: "spin 1s linear infinite" }} />
                  <p style={{ marginTop: "1rem" }}>Chargement...</p>
                </div>
              ) : error ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    background: "rgba(255,0,0,0.2)",
                    borderRadius: "8px",
                  }}
                >
                  <IconAlertCircle size={24} />
                  <span>{error}</span>
                </div>
              ) : products.length === 0 ? (
                <p style={{ textAlign: "center", padding: "2rem", opacity: 0.8 }}>
                  Aucun produit ajouté
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          textAlign: "left",
                          borderBottom: "2px solid rgba(255,255,255,0.3)",
                        }}
                      >
                        <th style={{ padding: "1rem" }}>Image</th>
                        <th style={{ padding: "1rem" }}>Titre</th>
                        <th style={{ padding: "1rem" }}>Prix</th>
                        <th style={{ padding: "1rem" }}>Catégorie</th>
                        <th style={{ padding: "1rem" }}>Stock</th>
                        <th style={{ padding: "1rem" }}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product._id}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          <td style={{ padding: "1rem" }}>
                            <img
                              src={product.images[0]?.startsWith('http') 
                                ? product.images[0] 
                                : `${API_BASE_URL}${product.images[0]}`}
                              alt={product.title}
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect fill="%23ddd" width="50" height="50"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImg%3C/text%3E%3C/svg%3E';
                              }}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </td>
                          <td style={{ padding: "1rem" }}>{product.title}</td>
                          <td style={{ padding: "1rem" }}>{product.price} FCFA</td>
                          <td style={{ padding: "1rem" }}>{product.category}</td>
                          <td style={{ padding: "1rem" }}>{product.stock}</td>
                          <td style={{ padding: "1rem" }}>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <IconEdit
                                size={20}
                                style={{ cursor: "pointer", opacity: 0.8 }}
                              />
                              <IconTrash
                                size={20}
                                style={{ cursor: "pointer", opacity: 0.8, color: "#ff6b6b" }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {active === "Clients" && (
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              padding: "1.5rem",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
            }}
          >
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
              Liste des clients ({users.length})
            </h2>

            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <IconLoader size={40} style={{ animation: "spin 1s linear infinite" }} />
                <p style={{ marginTop: "1rem" }}>Chargement...</p>
              </div>
            ) : error ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  background: "rgba(255,0,0,0.2)",
                  borderRadius: "8px",
                }}
              >
                <IconAlertCircle size={24} />
                <span>{error}</span>
              </div>
            ) : users.length === 0 ? (
              <p style={{ textAlign: "center", padding: "2rem", opacity: 0.8 }}>
                Aucun client enregistré
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        textAlign: "left",
                        borderBottom: "2px solid rgba(255,255,255,0.3)",
                      }}
                    >
                      <th style={{ padding: "1rem" }}>Nom complet</th>
                      <th style={{ padding: "1rem" }}>Email</th>
                      <th style={{ padding: "1rem" }}>Téléphone</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <td style={{ padding: "1rem" }}>
                          {u.firstname} {u.lastname}
                        </td>
                        <td style={{ padding: "1rem" }}>{u.email}</td>
                        <td style={{ padding: "1rem" }}>{u.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {active === "Messages" && (
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              padding: "1.5rem",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
            }}
          >
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
              Messages reçus ({messages.length})
            </h2>

            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <IconLoader size={40} style={{ animation: "spin 1s linear infinite" }} />
                <p style={{ marginTop: "1rem" }}>Chargement...</p>
              </div>
            ) : error ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  background: "rgba(255,0,0,0.2)",
                  borderRadius: "8px",
                }}
              >
                <IconAlertCircle size={24} />
                <span>{error}</span>
              </div>
            ) : messages.length === 0 ? (
              <p style={{ textAlign: "center", padding: "2rem", opacity: 0.8 }}>
                Aucun message reçu
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      padding: "1.5rem",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                          {msg.name}
                        </div>
                        <div style={{ opacity: 0.8, fontSize: "0.9rem" }}>
                          {msg.email}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                        color: "#FFE0BF",
                      }}
                    >
                      Sujet: {msg.sujet}
                    </div>
                    <div style={{ opacity: 0.9, lineHeight: 1.6 }}>
                      {msg.message}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {active === "Statistiques" && (
          <div
            style={{
              textAlign: "center",
              opacity: 0.8,
              fontSize: "1.2rem",
              padding: "4rem",
            }}
          >
            Les statistiques s'afficheront ici...
          </div>
        )}
      </main>

      <AnimatePresence>
        {showProductForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "2rem",
            }}
            onClick={() => setShowProductForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                color: "#333",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  Ajouter un produit
                </h2>
                <IconX
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowProductForm(false)}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "1rem",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Description *
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                      Prix (FCFA) *
                    </label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                      Stock
                    </label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Catégorie *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "1rem",
                    }}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Images (max 5) *
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "2rem",
                      border: "2px dashed #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: "#f9f9f9",
                    }}
                  >
                    <IconUpload size={24} />
                    <span>Cliquez pour sélectionner des images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>

                  {previewUrls.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                        gap: "0.5rem",
                        marginTop: "1rem",
                      }}
                    >
                      {previewUrls.map((url, index) => (
                        <div key={index} style={{ position: "relative" }}>
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                          <IconX
                            size={20}
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              background: "white",
                              borderRadius: "50%",
                              cursor: "pointer",
                              padding: "2px",
                            }}
                            onClick={() => removeImage(index)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    onClick={() => setShowProductForm(false)}
                    style={{
                      flex: 1,
                      padding: "0.875rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      background: "white",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmitProduct}
                    disabled={formLoading}
                    style={{
                      flex: 1,
                      padding: "0.875rem",
                      border: "none",
                      borderRadius: "8px",
                      background: "#FF7F00",
                      color: "white",
                      cursor: formLoading ? "not-allowed" : "pointer",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    {formLoading ? "Création..." : "Créer le produit"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}