// pages/AdminLogin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Title, TextInput, PasswordInput,
  Button, Stack, Alert, Center, ThemeIcon
} from '@mantine/core';
import { IconMail, IconLock, IconAlertCircle, IconShield } from '@tabler/icons-react';
import { loginAdmin } from '../../api/authService';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 🔑 Login admin et stockage du token dans localStorage
      await loginAdmin(formData);

      // 🔄 Redirection vers le dashboard
      navigate('/admin/dashboard');
    } catch (err: any) {
      // Gestion des erreurs
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" py={80}>
      <Center mb="xl">
        <ThemeIcon size={80} radius="xl" color="shopOrange" variant="light">
          <IconShield size={48} />
        </ThemeIcon>
      </Center>

      <Title order={1} ta="center" mb="md">
        Administration
      </Title>

      <Paper shadow="md" p="xl" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {error && (
              <Alert
                icon={<IconAlertCircle size={18} />}
                color="red"
                withCloseButton
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            <TextInput
              label="Email administrateur"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@votresite.com"
              leftSection={<IconMail size={16} />}
              required
            />

            <PasswordInput
              label="Mot de passe"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Votre mot de passe"
              leftSection={<IconLock size={16} />}
              required
            />

            <Button
              type="submit"
              color="shopOrange"
              loading={loading}
              fullWidth
              mt="md"
              size="md"
            >
              Se connecter
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}