import { IconCheck, IconPhone, IconCreditCard,IconTruck } from '@tabler/icons-react';
import { Box, Container, SimpleGrid, Text } from '@mantine/core';
import classes from './Caracteristics.module.css';

interface FeatureProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: React.FC<any>;
  title: string;
  description: string;
}

export default function Feature({ icon: Icon, title, description, className, ...others }: FeatureProps) {
  return (
    <div
      className={classes.feature}
      style={{
        borderRadius: 12,
        padding: 20,
        background: "white",
      }}
      {...others}
    >
      <div className={classes.overlay} />

      <div className={classes.content}>
        <Icon size={38} className={classes.icon} stroke={1.5} />
        <Text fw={200} fz="md" mb="xs" mt={5} className={classes.title}>
          {title}
        </Text>
        <Text c="dimmed" fz="sm">
          {description}
        </Text>
      </div>
    </div>
  );
}


const mockdata = [
  {
    icon: IconTruck,
    title: 'Livraison sécurisée',
    description:
      'Vous serez livrés sous 24h',
  },
  {
    icon: IconCheck,
    title: 'Produits de qualité',
    description:
      'Votre satisfaction,notre priorité',
  },
  {
    icon: IconCreditCard,
    title: 'Paiements sécurisés',
    description:
      ' Chap Chap.',
  },
   {
    icon: IconPhone,
    title: '24h/7 ',
    description:
      'Rapide & Efficace.',
  },
];

export function FeaturesAsymmetrical() {
  return (
    <>
    <Box className={classes.featuresContainer}>
    <Container size="lg" >
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 4 }} // responsive
        spacing="xl"
        style={{ justifyItems: 'center' }} // centre horizontalement
      >
        {mockdata.map((item) => (
          <Feature
            key={item.title}
            {...item}
            style={{ width: 250 }} // largeur fixe pour mobile
          />
        ))}
      </SimpleGrid>
    </Container>
    </Box>
    </>
  );
}
