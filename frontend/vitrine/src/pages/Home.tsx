import Header from "../components/common/Header";
import { Box, Text, Button } from "@mantine/core";
import Footer from "../components/common/Footer";
import { FeaturesAsymmetrical } from "../components/common/CaracteristicsCard";
export default function Home() {
  return (
    <>
      <Header />
      <Box style={{ position: 'relative', width: '100%', height: 650 }}>
        {/* Image de fond */}
        <img
          src="/vintage.jpeg"
          alt="Produit"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Texte et bouton superposés */}
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: 700,
              textShadow: '1px 1px 5px rgba(0,0,0,0.5)',
              marginBottom: 20,
            }}
          >
            Bienvenue Chez DjassamanShop
          </Text>

          <Button
            variant="gradient"
            gradient={{ from: 'shopOrange.5', to: 'neutral.7', deg: 120 }}
            size="md"
          >
            Voir nos articles
          </Button>
        </Box>
      </Box>
      
      <FeaturesAsymmetrical />
      <Footer/>
    </>
    
  );
}
