import { useState } from 'react';
import { 
  Button, TextInput, PasswordInput, Stack, Paper,
  Title, Text, Container, Center, ThemeIcon, Alert, Anchor
} from '@mantine/core';
import { IconMail, IconLock, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authService';

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '', 
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setConnecting(true);

    try {
      await loginUser(formData);

      setConnecting(false);
      setSuccess(true);

      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion");
      setConnecting(false);
    } finally {
      setLoading(false);
    }
  };

  if (connecting) {
    return (
      <Container size="md" py={60}>
        <Center style={{ minHeight: 300 }}>
          <Stack align="center" gap="xl">
            <ThemeIcon size={80} radius="xl" color="shopOrange" variant="light">
              <div className="animate-spin">⏳</div>
            </ThemeIcon>
            <Title order={2} c="shopOrange.6">Connexion en cours...</Title>
            <Text size="lg" ta="center" c="dimmed" maw={400}>
              Veuillez patienter pendant la connexion.
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (success) {
    return (
      <Container size="md" py={60}>
        <Center style={{ minHeight: 300 }}>
          <Stack align="center" gap="xl">
            <ThemeIcon size={80} radius="xl" color="shopOrange" variant="light">
              <IconCheck size={48} />
            </ThemeIcon>
            <Title order={2} c="shopOrange.6">Connexion réussie !</Title>
            <Text size="lg" ta="center" c="dimmed" maw={400}>
              Redirection l'accueil...
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="md" py={60}>
      <Paper shadow="md" p="xl" radius="md">

        <Title order={2} ta="center" mb="xl">Se connecter</Title>

        <form onSubmit={handleSubmit}>
          <Stack 
            gap="md" 
            w="100%" 
            style={{ 
              maxWidth: '500px', 
              margin: 'auto', 
              width: '100%' 
            }}
          >

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

            {/* Champ email */}
            <TextInput 
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemple@gmail.com"
              leftSection={<IconMail size={16} />}
              required
            />

            {/* Mot de passe */}
            <PasswordInput 
              label="Mot de passe"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Votre mot de passe"
              leftSection={<IconLock size={16} />}
              required
            />

            {/* Bouton */}
            <Button 
              type="submit"
              color="shopOrange"
              loading={loading}
              fullWidth
              mt="md"
            >
              Se connecter
            </Button>

            {/* Lien vers inscription */}
            <Text ta="center" size="sm" c="dimmed" mt="md">
              Pas encore de compte ?{' '}
              <Anchor component={Link} to="/register" c="shopOrange">
                Créer un compte
              </Anchor>
            </Text>

          </Stack>
        </form>
      </Paper>
    </Container>
  );
}