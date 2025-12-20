import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Text,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconHome,
  IconBox,
  IconShoppingCart,
  IconPhone,
} from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import classes from './Header.module.css';

export default function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <Box>

      {/* -------------------- HEADER ANIMÉ -------------------- */}
      <motion.header
        className={classes.header}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Group justify="space-between" h="100%">
          <Stack gap={0}>
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <Text fw={700} size="xl" c="shopOrange.5" style={{ lineHeight: 1.2 }}>
                DJASSAMAN SHOP
              </Text>
            </motion.div>
          </Stack>

          {/* -------------------- DESKTOP LINKS -------------------- */}
          <Group h="100%" gap="md" visibleFrom="sm">

            <motion.div whileHover={{ scale: 1.06 }} transition={{ type: "spring", stiffness: 250 }}>
              <Link to="/" className={classes.link}>
                <Group gap="xs"><IconHome size={18}/> Accueil</Group>
              </Link>
            </motion.div>

            {/* PRODUITS - Lien simple sans dropdown */}
            <motion.div whileHover={{ scale: 1.06 }} transition={{ type: "spring", stiffness: 250 }}>
              <Link to="/categorie" className={classes.link}>
                <Group gap="xs">
                  <IconBox size={18} /> Produits
                </Group>
              </Link>
            </motion.div>

            {/* Panier */}
            <motion.div whileHover={{ scale: 1.06 }} transition={{ type: "spring", stiffness: 250 }}>
              <Link to="/panier" className={classes.link}>
                <Group gap="xs"><IconShoppingCart size={18}/> Panier</Group>
              </Link>
            </motion.div>

            {/* Contact */}
            <motion.div whileHover={{ scale: 1.06 }} transition={{ type: "spring", stiffness: 250 }}>
              <Link to="/contact" className={classes.link}>
                <Group gap="xs"><IconPhone size={18}/> Contactez-nous</Group>
              </Link>
            </motion.div>
          </Group>

          {/* ------------------- DESKTOP BUTTONS -------------------- */}
          <Group visibleFrom="sm">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button component={Link} to="/user/login" variant="default">
                Se connecter
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Button component={Link} to="/register" variant="gradient"
                gradient={{ from: 'shopOrange.5', to: 'neutral.7', deg: 120 }}>
                Créer un compte
              </Button>
            </motion.div>
          </Group>

          {/* -------------------- BURGER MOBILE -------------------- */}
          <motion.div
            whileTap={{ rotate: 90, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
          </motion.div>

        </Group>
      </motion.header>

      {/* -------------------- MOBILE DRAWER ANIMÉ -------------------- */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="70%"
        padding="md"
        hiddenFrom="sm"
        zIndex={1000000}
        position="right"
        classNames={{
          body: classes.drawerBody,
          content: classes.drawerContent,
          header: classes.drawerHeader,
        }}
        transitionProps={{
          transition: "slide-left",
          duration: 250
        }}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/" className={classes.link} onClick={closeDrawer}>
              <Group gap="xs"><IconHome size={18}/> Accueil</Group>
            </Link>

            {/* PRODUITS mobile - Lien simple */}
            <Link to="/categorie" className={classes.link} onClick={closeDrawer}>
              <Group gap="xs"><IconBox size={18}/> Produits</Group>
            </Link>

            <Link to="/panier" className={classes.link} onClick={closeDrawer}>
              <Group gap="xs"><IconShoppingCart size={18}/> Panier</Group>
            </Link>

            <Link to="/contact" className={classes.link} onClick={closeDrawer}>
              <Group gap="xs"><IconPhone size={18}/> Contactez-nous</Group>
            </Link>

            <Divider my="sm" />

            <Stack gap="sm" mt="md">
              <Button component={Link} to="/user/login" onClick={closeDrawer} variant="default" fullWidth>
                Se connecter
              </Button>

              <Button component={Link} to="/register" onClick={closeDrawer}
                variant="gradient" gradient={{ from: 'shopOrange.5', to: 'neutral.7', deg: 120 }} fullWidth>
                Créer un compte
              </Button>
            </Stack>
          </motion.div>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}