import Container from './Container';

function Login() {
  return (
    <Container>
     <a href="http://localhost:8000/user/auth/kakao">카카오로 로그인하기</a>
     <a href="http://localhost:8000/user/auth/google">구글로 로그인하기</a>
  
    </Container>
  );
}

export default Login;
