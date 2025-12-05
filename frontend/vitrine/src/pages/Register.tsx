import { useState } from 'react';
import { 
  Button, Group, TextInput, PasswordInput, Stack, Paper,
  Title, Text, Container, Center, ThemeIcon, Alert
} from '@mantine/core';
import { IconUser, IconMail, IconPhone, IconLock, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { registerUser } from '../api/authService';

export default function Inscription() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '',
    password: '', 
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    setCreating(true);

    try {
      await registerUser(formData);

      setCreating(false);
      setSuccess(true);

      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
      setCreating(false);
    } finally {
      setLoading(false);
    }
  };

  if (creating) {
    return (
      <Container size="md" py={60}>
        <Center style={{ minHeight: 300 }}>
          <Stack align="center" gap="xl">
            <ThemeIcon size={80} radius="xl" color="shopOrange" variant="light">
              <div className="animate-spin">⏳</div>
            </ThemeIcon>
            <Title order={2} c="shopOrange.6">Création en cours...</Title>
            <Text size="lg" ta="center" c="dimmed" maw={400}>
              Veuillez patienter pendant la création de votre compte.
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
            <Title order={2} c="shopOrange.6">Inscription validée !</Title>
            <Text size="lg" ta="center" c="dimmed" maw={400}>
              Votre compte a été créé avec succès. Redirection en cours...
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="md" py={60}>
      <Paper shadow="md" p="xl" radius="md">

        <Title order={2} ta="center" mb="xl">Créer un compte</Title>

        <form onSubmit={handleSubmit}>
          <Stack 
            gap="md" 
            w="100%" 
            style={{ 
              maxWidth: '600px', 
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

            {/* Champ prénom et nom */}
            {isMobile ? (
              <>
                <TextInput 
                  label="Prénom"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Saisissez votre prénom"
                  leftSection={<IconUser size={16} />}
                  required
                />
                <TextInput 
                  label="Nom"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Saisissez votre nom"
                  leftSection={<IconUser size={16} />}
                  required
                />
              </>
            ) : (
              <Group gap="md" grow style={{ width: '100%' }}>
                <TextInput 
                  label="Prénom"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Saisissez votre prénom"
                  leftSection={<IconUser size={16} />}
                  required
                />
                <TextInput 
                  label="Nom"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Saisissez votre nom"
                  leftSection={<IconUser size={16} />}
                  required
                />
              </Group>
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

            {/* Champ téléphone */}
            <TextInput 
              label="Téléphone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ex : 0102030405"
              leftSection={<IconPhone size={16} />}
              required
            />

            {/* Mots de passe */}
            {isMobile ? (
              <>
                <PasswordInput 
                  label="Mot de passe"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="6 caractères minimum"
                  leftSection={<IconLock size={16} />}
                  required
                />
                <PasswordInput 
                  label="Confirmer"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmez votre mot de passe"
                  leftSection={<IconLock size={16} />}
                  required
                />
              </>
            ) : (
              <Group gap="md" grow style={{ width: '100%' }}>
                <PasswordInput 
                  label="Mot de passe"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="6 caractères minimum"
                  leftSection={<IconLock size={16} />}
                  required
                />
                <PasswordInput 
                  label="Confirmer"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmez votre mot de passe"
                  leftSection={<IconLock size={16} />}
                  required
                />
              </Group>
            )}

            {/* Bouton */}
            <Button 
              type="submit"
              color="shopOrange"
              loading={loading}
              fullWidth
              mt="md"
            >
              Valider l'inscription
            </Button>

          </Stack>
        </form>
      </Paper>
    </Container>
  );
}