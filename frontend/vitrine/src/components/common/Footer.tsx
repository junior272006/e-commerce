import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube, IconMail, IconPhone } from '@tabler/icons-react';
import { ActionIcon, Container, Group, Text, Stack } from '@mantine/core';
import classes from './Footer.module.css';
import { motion } from "framer-motion";

const data = [
  {
    title: 'Boutique',
    links: [
      { label: 'Accueil', link: '#' },
      { label: 'Produits', link: '#' },
      { label: 'Panier', link: '#' },
      { label: 'Contactez-nous', link: '#' },
    ],
  },
  {
    title: 'Espace Compte',
    links: [
      { label: 'Inscription', link: '#' },
      { label: 'Connexion', link: '#' },
    ],
  },
  {
    title: 'Important',
    links: [
      { label: 'Aide', link: '#' },
      { label: 'Politique de confidentialité', link: '#' },
    ],
  },
];

export default function Footer() {
  const groups = data.map((group, i) => {
    const links = group.links.map((link, index) => (
      <Text<'a'>
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <motion.div
        key={group.title}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: i * 0.15 }}
        className={classes.wrapper}
      >
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </motion.div>
    );
  });

  return (
    <motion.footer
      className={classes.footer}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Container className={classes.inner}>
        {/* Logo + infos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={classes.logo}
        >
          <Text size="15px" fw={900} c="shopOrange.5">
            DJASSAMAN SHOP
          </Text>

          <Stack gap="sm">
            <Group gap="sm" mt='lg'>
              <IconMail size={18} color="var(--mantine-color-shopOrange-5)" />
              <Text size="sm" c="dimmed">
                junior27nguetta@gmail.com
              </Text>
            </Group>

            <Group gap="xs">
              <IconPhone size={18} color="var(--mantine-color-shopOrange-5)" />
              <Text size="sm" c="dimmed">
                +225 05 74 09 31 19
              </Text>
            </Group>
          </Stack>
        </motion.div>

        <div className={classes.groups}>{groups}</div>
      </Container>

      {/* Bande du bas */}
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2024 Djassaman Shop. All rights reserved.
        </Text>

        <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
          {/* Icône Twitter */}
          <motion.div whileHover={{ scale: 1.2, rotate: 6 }} transition={{ type: "spring", stiffness: 200 }}>
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandTwitter size={18} stroke={1.5} />
            </ActionIcon>
          </motion.div>

          {/* Icône YouTube */}
          <motion.div whileHover={{ scale: 1.2, rotate: -6 }} transition={{ type: "spring", stiffness: 200 }}>
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandYoutube size={18} stroke={1.5} />
            </ActionIcon>
          </motion.div>

          {/* Icône Instagram */}
          <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 200 }}>
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandInstagram size={18} stroke={1.5} />
            </ActionIcon>
          </motion.div>
        </Group>
      </Container>
    </motion.footer>
  );
}
