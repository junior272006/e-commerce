import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
} from "@tabler/icons-react";
import { userlist, usermessage } from "../../api/authService";
import type { MessageData } from "../../api/authService";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}


export default function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const menu = [
    { label: "Dashboard", icon: IconHome },
    { label: "Produits", icon: IconShoppingBag },
    { label: "Clients", icon: IconUsers },
    { label: "Statistiques", icon: IconChartBar },
    { label: "Messages", icon: IconMessage },
  ];

  // Charger les données selon la section active
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
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des données");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (active === "Clients" || active === "Messages") {
      loadData();
    }
  }, [active]);

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
      {/* SIDEBAR */}
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

      {/* MAIN */}
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

        {/* DASHBOARD */}
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
              { label: "Total Produits", value: "0", icon: IconShoppingBag },
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

        {/* PRODUITS */}
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
                textAlign: "center",
                opacity: 0.8,
                fontSize: "1.2rem",
                padding: "4rem",
              }}
            >
              Les produits s'afficheront ici...
            </div>
          </>
        )}

        {/* CLIENTS */}
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

        {/* MESSAGES */}
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

        {/* STATISTIQUES */}
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