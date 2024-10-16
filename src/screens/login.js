import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={[styles.innerContainer]}>
        <Image source={require('../assets/img/bebe.png')} style={styles.logo} />
        <View style={styles.contentContainer}>
          <Animated.View style={{transform: [{translateX: wobble}]}}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#8E8E8E"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#8E8E8E"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Animated.View>
          <View>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? '¡Cargando...!' : '¡Vamos a aprender!'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttonEasyLogin,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={easyLogin}
              disabled={isLoading}>
              <Text style={styles.buttonText}>Inicio rápido</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.buttonText}>¡Quiero una cuenta nueva!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.celeste,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  landscapeInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.tomate,
    marginBottom: 30,
    textAlign: 'center',
  },
  landscapeTitle: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  contentContainer: {
    width: '100%',
  },
  landscapeContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 3,
    borderColor: AppColors.verde,
    color: 'black',
  },
  landscapeButtonContainer: {
    marginLeft: 20,
  },
  button: {
    backgroundColor: AppColors.rosa,
    borderRadius: 25,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonEasyLogin: {
    backgroundColor: AppColors.tomate,
    borderRadius: 25,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#D3D3D3',
  },
  registerButton: {
    backgroundColor: AppColors.verde,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
