import React, { useState } from 'react';
import { TextInput, Textarea, Button, Container, Title, Grid, Paper, Group, Text, Stack, Notification } from '@mantine/core';
import { IconMail, IconPhone, IconMapPin, IconCheck, IconX } from '@tabler/icons-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { message as sendMessage } from '../api/authService';  
import type { MessageData } from '../api/authService';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ show: false, type: 'success', message: '' });

    try {
      const messageData: MessageData = {
        name: formData.nom,
        email: formData.email,
        sujet: formData.sujet,
        message: formData.message
      };

      const response = await sendMessage(messageData);  // ← Utiliser sendMessage

      setNotification({
        show: true,
        type: 'success',
        message: response.message || 'Message envoyé avec succès !'
      });

      setFormData({
        nom: '',
        email: '',
        sujet: '',
        message: ''
      });

    } catch (error: any) {
      setNotification({
        show: true,
        type: 'error',
        message: error.message || 'Une erreur est survenue lors de l\'envoi du message'
      });
    } finally {
      setLoading(false);
      
      setTimeout(() => {
        setNotification({ show: false, type: 'success', message: '' });
      }, 5000);
    }
  };

  return (
    <div style={{ background: 'var(--mantine-color-neutral-1)', minHeight: '100vh' }}>
      {<Header />}
      
      <Container size="xl" py={80}>
        <Title order={1} mb={40} c="neutral.9">
          CONTACTEZ-NOUS
        </Title>

        {notification.show && (
          <Notification
            icon={notification.type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
            color={notification.type === 'success' ? 'teal' : 'red'}
            title={notification.type === 'success' ? 'Succès' : 'Erreur'}
            mb={20}
            onClose={() => setNotification({ ...notification, show: false })}
          >
            {notification.message}
          </Notification>
        )}

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
                    required
                    disabled={loading}
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
                    required
                    disabled={loading}
                  />

                  <TextInput
                    label="Sujet"
                    name="sujet"
                    placeholder="Sujet de votre message"
                    size="sm"
                    value={formData.sujet}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />

                  <Textarea
                    label="Message"
                    name="message"
                    placeholder="Votre message"
                    minRows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />

                  <Button
                    type="submit"
                    size="md"
                    variant="gradient"
                    gradient={{ from: 'shopOrange.5', to: 'neutral.7', deg: 120 }}
                    style={{ alignSelf: 'flex-start' }}
                    loading={loading}
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
      <Footer/>
    </div>
  );
}