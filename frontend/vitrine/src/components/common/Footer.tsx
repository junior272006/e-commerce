import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube,IconMail,IconPhone } from '@tabler/icons-react';
import { ActionIcon, Container, Group, Text,Stack } from '@mantine/core';
import classes from './Footer.module.css';

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
  const groups = data.map((group) => {
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
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
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
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2024 Djassaman Shop. All rights reserved.
        </Text>

        <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}