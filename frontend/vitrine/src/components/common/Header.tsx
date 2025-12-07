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
  Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconHome,
  IconBox,
  IconShoppingCart,
  IconPhone,
  IconShirt,
  IconShoe,
  IconDeviceLaptop
} from '@tabler/icons-react';
import { Link } from "react-router-dom";
import classes from './Header.module.css';

export default function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Stack gap={0}>
            <Text fw={700} size="xl" c="shopOrange.5" style={{ lineHeight: 1.2 }}>
              DJASSAMAN SHOP
            </Text>
          </Stack>

          {/* -------------------- DESKTOP LINKS -------------------- */}
          <Group h="100%" gap="md" visibleFrom="sm">
            {/* Accueil */}
            <Link to="/" className={classes.link}>
              <Group gap="xs"><IconHome size={18}/> Accueil</Group>
            </Link>

            {/* PRODUITS DROPDOWN */}
            <Menu shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={150}>
              <Menu.Target>
                <a className={classes.link} style={{ cursor: "pointer" }}>
                  <Group gap="xs">
                    <IconBox size={18} /> Produits
                  </Group>
                </a>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<IconShirt size={18} />}>Vêtements Homme</Menu.Item>
                <Menu.Item leftSection={<IconShirt size={18} />}>Vêtements Femme</Menu.Item>
                <Menu.Item leftSection={<IconDeviceLaptop size={18} />}>Accessoires</Menu.Item>
                <Menu.Item leftSection={<IconShoe size={18} />}>Chaussures</Menu.Item>
              </Menu.Dropdown>
            </Menu>

            {/* Panier */}
            <a className={classes.link} style={{ cursor: "pointer" }}>
              <Group gap="xs"><IconShoppingCart size={18}/> Panier</Group>
            </a>

            {/* Contact */}
            <a className={classes.link} style={{ cursor: "pointer" }}>
              <Group gap="xs"><IconPhone size={18}/> Contactez-nous</Group>
            </a>
          </Group>

          {/* ------------------- DESKTOP BUTTONS -------------------- */}
          <Group visibleFrom="sm">
            <Button variant="default">Se connecter</Button>
            <Button component={Link} to="/register" variant="gradient" gradient={{ from: 'shopOrange.5', to: 'neutral.7', deg: 120 }}>
              Créer un compte
            </Button>
          </Group>

          {/* Mobile burger */}
          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      {/* -------------------- MOBILE DRAWER -------------------- */}
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
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />

          {/* Accueil */}
          <Link to="/" className={classes.link} onClick={closeDrawer}>
            <Group gap="xs"><IconHome size={18}/> Accueil</Group>
          </Link>

          {/* -------------------- PRODUITS catégorie MOBILE -------------------- */}
          <Stack gap={4} px="md" mt="xs">
            <Text fw={600} size="sm">
              <Group gap={4}><IconBox size={18}/> Produits</Group>
            </Text>

            <a className={classes.link} style={{ cursor: "pointer" }}>
              <Group gap="xs"><IconShirt size={16}/> Vêtements Homme</Group>
            </a>

            <a className={classes.link} style={{ cursor: "pointer" }}>
              <Group gap="xs"><IconShirt size={16}/> Vêtements Femme</Group>
            </a>

            <a className={classes.link} style={{ cursor: "pointer" }}>
              <Group gap="xs"><IconDeviceLaptop size={16}/> Accessoires</Group>
            </a>

            <a className={classes.link} style={{ cursor: "pointer" }}>
              <Group gap="xs"><IconShoe size={16}/> Chaussures</Group>
            </a>
          </Stack>

          {/* Panier */}
          <a className={classes.link} style={{ marginTop: 10, cursor: "pointer" }}>
            <Group gap="xs"><IconShoppingCart size={18}/> Panier</Group>
          </a>

          {/* Contact */}
          <a className={classes.link} style={{ cursor: "pointer" }}>
            <Group gap="xs"><IconPhone size={18}/> Contactez-nous</Group>
          </a>

          <Divider my="sm" />

          {/* Bottom buttons mobile */}
          <Stack gap="sm" mt="md">
            <Button variant="default" fullWidth>Se connecter</Button>
            <Button 
              component={Link}
              to="/register"
              onClick={closeDrawer}
              variant="gradient"
              gradient={{ from: 'shopOrange.5', to: 'neutral.7', deg: 120 }}
              fullWidth
            >
              Créer un compte
            </Button>
          </Stack>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}