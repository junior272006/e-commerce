import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const categories = [
  {
    id: 1,
    title: "HOMMES",
    description: "Découvrez notre collection de vêtements pour hommes",
    subtitle: "Style et élégance au masculin",
    image: "https://img.freepik.com/photos-gratuite/belle-mode-vetements-decontractes-pour-hommes_1134868.jpg",
    link: "/produits",
    categoryFilter: "clothing",
    categoryName: "Hommes",
    color: "#FF7F00"
  },
  {
    id: 2,
    title: "FEMMES",
    description: "Explorez notre gamme de vêtements pour femmes",
    subtitle: "L'élégance à votre portée",
    image: "https://img.freepik.com/photos-gratuite/portrait-jeune-femme-elegante-robe-noire_1303-17513.jpg",
    link: "/produits",
    categoryFilter: "clothing",
    categoryName: "Femmes",
    color: "#8E8E8E"
  },
  {
    id: 3,
    title: "CHAUSSURES",
    description: "Du confort à chaque pas avec notre sélection",
    subtitle: "Trouvez votre paire parfaite",
    image: "https://img.freepik.com/photos-gratuite/collection-chaussures-elegantes_23-2149173549.jpg",
    link: "/produits",
    categoryFilter: "electronics",
    categoryName: "Chaussures",
    color: "#FF7F00"
  },
  {
    id: 4,
    title: "ACCESSOIRES",
    description: "Complétez votre look avec nos accessoires",
    subtitle: "Les détails qui font la différence",
    image: "https://img.freepik.com/photos-gratuite/accessoires-mode-vue-dessus_23-2148657484.jpg",
    link: "/product",
    categoryFilter: "electronics",
    categoryName: "Accessoires",
    color: "#8E8E8E"
  }
];
export default function Categorie() {
  return (
    <>
      <Header />
      
      <div style={{
        minHeight: "100vh",
        background: "#FAFAFA",
        fontFamily: "'Work Sans', sans-serif",
      }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            background: "linear-gradient(135deg, #FF7F00 0%, #FF9933 100%)",
            padding: "5rem 2rem 3rem",
            textAlign: "center",
            color: "white",
          }}
        >
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "1rem",
              letterSpacing: "2px",
            }}
          >
            NOS CATÉGORIES
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              fontSize: "1.2rem",
              maxWidth: "700px",
              margin: "0 auto",
              opacity: 0.95,
            }}
          >
            Explorez notre collection et trouvez le style qui vous correspond
          </motion.p>
        </motion.div>

        {/* Categories Grid */}
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "4rem 2rem",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}>
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -10 }}
                style={{ position: "relative" }}
              >
                <Link to={category.link} style={{ textDecoration: "none" }}>
                  <div style={{
                    position: "relative",
                    height: "450px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    cursor: "pointer",
                  }}>
                    {/* Image de fond */}
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${category.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    />

                    {/* Overlay gradient */}
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)`,
                    }} />

                    {/* Contenu */}
                    <div style={{
                      position: "relative",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "2rem",
                      color: "white",
                    }}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.3 }}
                      >
                        <h2 style={{
                          fontSize: "2.5rem",
                          fontWeight: "800",
                          marginBottom: "0.5rem",
                          letterSpacing: "3px",
                          textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
                        }}>
                          {category.title}
                        </h2>
                        <p style={{
                          fontSize: "1rem",
                          marginBottom: "0.5rem",
                          opacity: 0.9,
                          fontWeight: "500",
                        }}>
                          {category.subtitle}
                        </p>
                        <p style={{
                          fontSize: "0.95rem",
                          marginBottom: "1.5rem",
                          opacity: 0.85,
                        }}>
                          {category.description}
                        </p>

                        {/* Bouton Découvrir */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            display: "inline-block",
                            padding: "0.875rem 2rem",
                            background: category.color,
                            borderRadius: "12px",
                            fontWeight: "700",
                            fontSize: "1rem",
                            border: "2px solid white",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                          }}
                        >
                          Découvrir
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            maxWidth: "900px",
            margin: "0 auto 4rem",
            padding: "3rem 2rem",
            textAlign: "center",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#1A1A1A",
            marginBottom: "1rem",
          }}>
            Besoin d'aide pour choisir ?
          </h3>
          <p style={{
            fontSize: "1.1rem",
            color: "#666",
            marginBottom: "2rem",
            lineHeight: 1.6,
          }}>
            Notre équipe est là pour vous conseiller et vous aider à trouver les produits parfaits
          </p>
          <Link to="/contact" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "1rem 2.5rem",
                background: "linear-gradient(135deg, #FF7F00 0%, #FF9933 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "1.1rem",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(255, 127, 0, 0.3)",
              }}
            >
              Contactez-nous
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          h1 {
            font-size: 2rem !important;
          }
          
          h2 {
            font-size: 2rem !important;
          }

          p {
            font-size: 0.9rem !important;
          }

          .category-card {
            height: 350px !important;
          }
        }
      `}</style>
    </>
  );
}