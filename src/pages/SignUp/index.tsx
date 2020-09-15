import React, { useCallback, useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import getValidationErros from '../../utils/getValidationErros';
import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'No mínimo 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const erros = getValidationErros(err);

        formRef.current?.setErrors(erros);

        return;
      }

      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer cadastro, tente novamente.',
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
                name="name"
                icon="user"
                placeholder="Nome"
              />

              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                name="email"
                icon="mail"
                placeholder="E-mail"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
                icon="lock"
                placeholder="Senha"
              />
            </Form>

            <Button onPress={() => formRef.current?.submitForm()}>
              Entrar
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignInButton onPress={() => navigation.navigate('SignIn')}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInButtonText>Voltar para logon</BackToSignInButtonText>
      </BackToSignInButton>
    </>
  );
};

export default SignUp;
