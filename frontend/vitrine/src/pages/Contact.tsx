import React, { useState } from 'react';
import { TextInput, Textarea, Button, Container, Title, Grid, Paper, Group, Text, Stack } from '@mantine/core';
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';
import Header from '../components/common/Header';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message envoyé avec succès !');
  };

  return (
    <div style={{ background: 'var(--mantine-color-neutral-1)', minHeight: '100vh' }}>
   
      {<Header /> }
      
      <Container size="xl" py={80}>
        <Title order={1} mb={40} c="neutral.9">
          CONTACTEZ-NOUS
        </Title>

        <Grid gutter={30}>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper p={30}>
              <form onSubmit={handleSubmit}>
                <Stack gap={20}>
                  <TextInput
                    label="Nom"
                    name="nom"
                    placeholder="Votre nom"
                    size="sm"
                    value={formData.nom}
                    onChange={handleChange}
                  />

                  <TextInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="exemple@gmail.com"
                    size="sm"
                    value={formData.email}
                    onChange={handleChange}
                    leftSection={<IconMail size={16} />}
                  />

                  <TextInput
                    label="Sujet"
                    name="sujet"
                    placeholder="Sujet de votre message"
                    size="sm"
                    value={formData.sujet}
                    onChange={handleChange}
                  />

                  <Textarea
                    label="Message"
                    name="message"
                    placeholder="Votre message"
                    minRows={6}
                    value={formData.message}
                    onChange={handleChange}
                  />

                  <Button
                    type="submit"
                    size="md"
                    variant="gradient"
                    gradient={{ from: 'shopOrange.5', to: 'neutral.7', deg: 120 }}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Envoyer votre message
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap={20}>
              <Paper style={{ overflow: 'hidden', height: '250px', padding: 0 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.465!2d-3.9877!3d5.3515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjEnMDUuNCJOIDPCsDU5JzE1LjgiVw!5e0!3m2!1sfr!2sci!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Map"
                />
              </Paper>

              <Paper p={25}>
                <Stack gap={20}>
                  <Group align="flex-start" gap={15}>
                    <IconMapPin size={22} color="var(--mantine-color-shopOrange-5)" style={{ marginTop: 2 }} />
                    <Text size="sm" c="neutral.9" style={{ flex: 1 }}>
                      Côte d'Ivoire, Abidjan, Cocody
                    </Text>
                  </Group>

                  <Group align="flex-start" gap={15}>
                    <IconMail size={22} color="var(--mantine-color-shopOrange-5)" style={{ marginTop: 2 }} />
                    <Text size="sm" c="neutral.9" style={{ flex: 1 }}>
                      junior27nguetta@gmail.com
                    </Text>
                  </Group>

                  <Group align="flex-start" gap={15}>
                    <IconPhone size={22} color="var(--mantine-color-shopOrange-5)" style={{ marginTop: 2 }} />
                    <Text size="sm" c="neutral.9" style={{ flex: 1 }}>
                      +225 0574093119
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}