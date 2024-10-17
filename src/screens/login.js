import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import {AuthContext} from '../utils/auth.context';
import useAuthenticationApi from '../api/authentication';
import showToast from '../functions/showToast';
import auth from '@react-native-firebase/auth';
import {AppColors} from '../assets/styles/default-styles';

const LoginScreen = ({navigation}) => {
  const {signIn} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wobble] = useState(new Animated.Value(0));

  const {doLogin} = useAuthenticationApi(
    email,
    password,
    setIsLoading,
    navigation,
  );

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('error', 'Por favor, completa todos los campos.', 3000);
      wobbleAnimation();
      return;
    }
    await doLogin();
  };

  const easyLogin = async () => {
    try {
      setIsLoading(true);
      await auth().signInWithEmailAndPassword(
        'adminuno@yopmail.com',
        '12345678',
      );
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error en inicio rápido:', error);
      showToast('error', 'Error en inicio rápido. Intenta de nuevo.', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const wobbleAnimation = () => {
    Animated.sequence([
      Animated.timing(wobble, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(wobble, {
        toValue: -1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(wobble, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ImageBackground
      source={require('../assets/img/login-bg.png')}
      style={styles.backgroundImage}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Juego de Memoria</Text>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [
                  {
                    rotate: wobble.interpolate({
                      inputRange: [-1, 1],
                      outputRange: ['-0.05rad', '0.05rad'],
                    }),
                  },
                ],
              },
            ]}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            style={[styles.button, styles.easyLoginButton]}
            onPress={easyLogin}
            disabled={isLoading}>
            <Text style={styles.buttonText}>Inicio Rápido</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: AppColors.blanco,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: AppColors.blanco,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: AppColors.memoryBlue,
    color: AppColors.dark,
  },
  button: {
    backgroundColor: AppColors.memoryBlue,
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: AppColors.memoryGray,
  },
  easyLoginButton: {
    backgroundColor: AppColors.memoryGreen,
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: AppColors.memoryRed,
    marginTop: 10,
  },
  buttonText: {
    color: AppColors.blanco,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
