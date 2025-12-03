import { useState } from 'react';
import { 
  Stepper, Button, Group, TextInput, PasswordInput, Stack, Paper,
  Title, Text, Container, Center, ThemeIcon, Alert, SimpleGrid
} from '@mantine/core';
import { 
  IconUser, IconUserShield, IconCheck, IconMail, 
  IconPhone, IconLock, IconAlertCircle 
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { registerUser } from '../api/authService';

type UserType = 'client' | 'vendeur' | null;

export default function Inscription() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [active, setActive] = useState(0);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    shopName: '', siret: '', address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeSelection = (type: UserType) => {
    setUserType(type);
    setActive(1);
    setError('');
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

    if (userType === 'vendeur' && (!formData.shopName || !formData.siret || !formData.address)) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);
      setActive(2);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const ProfileCard = ({ type, icon, title, description, color }: any) => (
    <Paper
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid transparent',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--mantine-color-shopOrange-5)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onClick={() => handleUserTypeSelection(type)}
    >
      <Stack align="center" gap="sm">
        <ThemeIcon size={50} radius="xl" color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Title order={4}>{title}</Title>
        <Text size="sm" c="dimmed" ta="center" style={{ minHeight: '40px' }}>
          {description}
        </Text>
        <Button variant="light" color={color} fullWidth size="sm">
          Choisir {title}
        </Button>
      </Stack>
    </Paper>
  );

  return (
    <Container size="md" py={60}>
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="xl">Inscription</Title>

        {active < 2 ? (
          <>
            <Center>
              <Stepper 
                active={active} 
                onStepClick={setActive}
                orientation="horizontal"
                styles={{
                  root: {
                    width: '100%',
                    maxWidth: '600px',
                    marginBottom: '40px'
                  },
                  step: {
                    flex: '1'
                  }
                }}
              >
                <Stepper.Step 
                  label="Étape 1" 
                  description="Choix du Profil" 
                  icon={<IconUser size={18} />}
                />
                <Stepper.Step 
                  label="Étape 2" 
                  description="Inscription" 
                  icon={<IconMail size={18} />}
                />
              </Stepper>
            </Center>

            {active === 0 ? (
              <Stack gap="lg" align="center">
                <Text ta="center" size="lg" fw={600}>Faites votre choix</Text>
                
                <SimpleGrid 
                  cols={isMobile ? 1 : 2} 
                  spacing="lg" 
                  w="100%" 
                  style={{ maxWidth: isMobile ? '400px' : '600px' }}
                >
                  <ProfileCard
                    type="client"
                    icon={<IconUser size={28} />}
                    title="Client"
                    description="Acheter des produits"
                    color="shopGreen"
                  />
                  <ProfileCard
                    type="vendeur"
                    icon={<IconUserShield size={28} />}
                    title="Vendeur"
                    description="Vendre mes produits"
                    color="shopOrange"
                  />
                </SimpleGrid>
              </Stack>
            ) : (
              <form onSubmit={handleSubmit}>
                <Stack gap="md" align="center">
                  <Title order={4} ta="center" c={userType === 'client' ? 'shopGreen' : 'shopOrange'}>
                    Inscription {userType === 'client' ? 'Client' : 'Vendeur'}
                  </Title>

                  <Stack gap="md" w="100%" style={{ maxWidth: '600px' }}>
                    {error && (
                      <Alert icon={<IconAlertCircle size={18} />} color="red" onClose={() => setError('')} withCloseButton>
                        {error}
                      </Alert>
                    )}

                    {!isMobile && (
                      <Group grow>
                        <TextInput 
                          label="Prénom" 
                          name="firstName" 
                          value={formData.firstName} 
                          onChange={handleChange} 
                          placeholder="Entrez votre prénom" 
                          required 
                        />
                        <TextInput 
                          label="Nom" 
                          name="lastName" 
                          value={formData.lastName} 
                          onChange={handleChange} 
                          placeholder="Entrez votre nom" 
                          required 
                        />
                      </Group>
                    )}

                    {isMobile && (
                      <>
                        <TextInput 
                          label="Prénom" 
                          name="firstName" 
                          value={formData.firstName} 
                          onChange={handleChange} 
                          placeholder="Entrez votre prénom" 
                          required 
                        />
                        <TextInput 
                          label="Nom" 
                          name="lastName" 
                          value={formData.lastName} 
                          onChange={handleChange} 
                          placeholder="Entrez votre nom" 
                          required 
                        />
                      </>
                    )}

                    <TextInput 
                      label="Email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      leftSection={<IconMail size={16} />} 
                      placeholder="exemple@email.com"
                      required 
                    />

                    <TextInput 
                      label="Téléphone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      leftSection={<IconPhone size={16} />} 
                      placeholder="Ex: 0123456789"
                      required 
                    />

                    {userType === 'vendeur' && (
                      <>
                        <TextInput 
                          label="Nom de la boutique" 
                          name="shopName" 
                          value={formData.shopName} 
                          onChange={handleChange} 
                          placeholder="Nom de votre boutique" 
                          required 
                        />
                        
                        {!isMobile ? (
                          <Group grow>
                            <TextInput 
                              label="SIRET" 
                              name="siret" 
                              value={formData.siret} 
                              onChange={handleChange} 
                              placeholder="Numéro SIRET" 
                              required 
                            />
                            <TextInput 
                              label="Adresse" 
                              name="address" 
                              value={formData.address} 
                              onChange={handleChange} 
                              placeholder="Adresse complète" 
                              required 
                            />
                          </Group>
                        ) : (
                          <>
                            <TextInput 
                              label="SIRET" 
                              name="siret" 
                              value={formData.siret} 
                              onChange={handleChange} 
                              placeholder="Numéro SIRET" 
                              required 
                            />
                            <TextInput 
                              label="Adresse" 
                              name="address" 
                              value={formData.address} 
                              onChange={handleChange} 
                              placeholder="Adresse complète" 
                              required 
                            />
                          </>
                        )}
                      </>
                    )}

                    {!isMobile ? (
                      <Group grow>
                        <PasswordInput 
                          label="Mot de passe" 
                          name="password" 
                          value={formData.password} 
                          onChange={handleChange} 
                          leftSection={<IconLock size={16} />} 
                          placeholder="6 caractères minimum"
                          required 
                        />
                        <PasswordInput 
                          label="Confirmer" 
                          name="confirmPassword" 
                          value={formData.confirmPassword} 
                          onChange={handleChange} 
                          leftSection={<IconLock size={16} />} 
                          placeholder="Confirmez votre mot de passe"
                          required 
                        />
                      </Group>
                    ) : (
                      <>
                        <PasswordInput 
                          label="Mot de passe" 
                          name="password" 
                          value={formData.password} 
                          onChange={handleChange} 
                          leftSection={<IconLock size={16} />} 
                          placeholder="6 caractères minimum"
                          required 
                        />
                        <PasswordInput 
                          label="Confirmer" 
                          name="confirmPassword" 
                          value={formData.confirmPassword} 
                          onChange={handleChange} 
                          leftSection={<IconLock size={16} />} 
                          placeholder="Confirmez votre mot de passe"
                          required 
                        />
                      </>
                    )}

                    <Group justify="space-between" mt="xl">
                      <Button 
                        variant="default" 
                        onClick={() => { 
                          setActive(0); 
                          setUserType(null); 
                          setError(''); 
                        }} 
                        disabled={loading}
                      >
                        Retour
                      </Button>
                      <Button 
                        type="submit" 
                        color={userType === 'client' ? 'shopGreen' : 'shopOrange'} 
                        loading={loading}
                      >
                        Valider
                      </Button>
                    </Group>
                  </Stack>
                </Stack>
              </form>
            )}
          </>
        ) : (
          <Center style={{ minHeight: 300 }}>
            <Stack align="center" gap="xl">
              <ThemeIcon size={80} radius="xl" color="shopGreen" variant="light">
                <IconCheck size={48} />
              </ThemeIcon>
              <Title order={2} c="shopGreen.6">Inscription validée !</Title>
              <Text size="lg" ta="center" c="dimmed" maw={400}>
                Votre compte a été créé avec succès. Redirection en cours...
              </Text>
            </Stack>
          </Center>
        )}
      </Paper>
    </Container>
  );
}