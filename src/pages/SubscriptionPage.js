import {
  Button, Card,
  Col, Form, Layout, Row,
  Typography, Modal
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import axios from 'axios';

import Logo from '../assets/catalisa.png';
import InputText from '../components/InputText';
import { validateEmail, validateName, validatePassword } from '../helpers/validation-helper';

const { Content } = Layout;
const { Title } = Typography;

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState('')
  const [loading, setLoading] = useState(false);

  const handleSubscription = useCallback(async () => {
    try {
      setLoading(true);

      const { name, email, password } = formValues;

      if (!name || !email || !password) return;

      const body = {
        nome: name,
        email: email,
        senha: password,
      }

      await axios.post('/usuarios', body);

      Modal.success({
        title: 'Cadastro realizado com sucesso, efetue login para continuar.',
      })

      navigate('/login');
    } catch (error) {
      console.warn(error);
      const { response } = error;
      if (response?.status === 400) {
        Modal.error({
          title: response.data.mensagem
        });
      } else {
        Modal.error({
          title: 'Não foi cadastrar-se, tente novamente mais tarde.'
        })
      }
    } finally {
      setLoading(false);
    }
  }, [formValues, navigate]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormValues({
      ...formValues,
      [name]: value,
    })
  }, [formValues]);

  return (
    <Content>
      <Row
        justify="center"
      >
        <Col xs={24} sl={14} md={12} lg={10} xl={8}>
          <Card style={{ margin: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <img
                src={Logo}
                alt="Catalisa Tech"
                style={{ maxWidth: '100%' }}
              />
            </div>

            <Title
              level={3}
              type="secondary"
              style={{ textAlign: 'center', marginTop: 8 }}
            >
              Cadastre-se
            </Title>

            <Form layout="vertical">
              <InputText
                name="name"
                label="Nome"
                size="large"
                onChange={handleInputChange}
                validate={validateName}
                disabled={loading}
                required
              />

              <InputText
                name="email"
                label="E-mail"
                size="large"
                onChange={handleInputChange}
                validate={validateEmail}
                disabled={loading}
                required
              />

              <InputText
                name="password"
                label="Senha"
                type="password"
                size="large"
                onChange={handleInputChange}
                validate={validatePassword}
                disabled={loading}
                autoComplete="new-password"
                required
              />

              <Button
                block
                type="primary"
                size="large"
                onClick={handleSubscription}
                loading={loading}
              >
                Cadastrar
              </Button>

              <Link
                to="/login"
                className="ant-btn ant-btn-link ant-btn-lg ant-btn-block"
              >
                Voltar para o login
              </Link>
            </Form>
          </Card>
        </Col>
      </Row>
    </Content>
  );
}

export default SubscriptionPage;
