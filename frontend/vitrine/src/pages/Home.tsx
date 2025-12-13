import Header from "../components/common/Header";
import { Box, Text, Button } from "@mantine/core";
import Footer from "../components/common/Footer";
import { FeaturesAsymmetrical } from "../components/common/CaracteristicsCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <>
      <Header />

      <Box style={{ position: "relative", width: "100%", height: 700 }}>
        {/* Image de fond */}
        <img
          src="/vintage.jpeg"
          alt="Produit"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Texte + bouton animés */}
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
          }}
        >
          {/* Texte animé */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: 700,
                textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
                marginBottom: 20,
              }}
            >
              Bienvenue Chez DjassamanShop
            </Text>
          </motion.div>

          {/* Bouton animé */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            <Button
              variant="gradient"
              gradient={{ from: "shopOrange.5", to: "neutral.7", deg: 120 }}
              size="md"
               component={Link} to="/product"
            >
              Voir nos articles
            </Button>
          </motion.div>
        </Box>
      </Box>

      {/* Animation de la section Features */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <FeaturesAsymmetrical />
      </motion.div>

      <Footer />
    </>
  );
}
