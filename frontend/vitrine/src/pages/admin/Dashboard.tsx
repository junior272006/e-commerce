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
} from "@tabler/icons-react";
import { userlist } from "../../api/authService";

export default function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [users, setUsers] = useState<any[]>([]);

  const menu = [
    { label: "Dashboard", icon: IconHome },
    { label: "Produits", icon: IconShoppingBag },
    { label: "Clients", icon: IconUsers },
    { label: "Statistiques", icon: IconChartBar },
    { label: "Messages", icon: IconMessage },
  ];

  // Charger les utilisateurs quand on clique sur “Clients”
  useEffect(() => {
    if (active === "Clients") {
      userlist()
        .then((data) => setUsers(data))
        .catch((error) => console.error(error));
    }
  }, [active]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #FF7F00 0%, #8E8E8E 100%)",
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
              color:
                active === item.label ? "#FF7F00" : "#6B6B6B",
              marginBottom: "0.5rem",
            }}
            onClick={() => setActive(item.label)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </motion.div>
        ))}

        <motion.div
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0.875rem 1.25rem",
            borderRadius: "12px",
            cursor: "pointer",
            background: "#FF7F00",
            color: "#FFF",
            marginTop: "auto",
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
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>
              Liste des utilisateurs
            </h2>

            {users.length === 0 ? (
              <p>Aucun utilisateur trouvé...</p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom:
                          "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <td>{u.firstname} {u.lastname}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
