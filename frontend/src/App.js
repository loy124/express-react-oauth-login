import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import About from './About';
import Login from './Login';
import Main from './Main';
import { useEffect, useState } from 'react';
import axios from 'axios';
function App() {
  // 주어진 이름의 쿠키를 반환하는데,
// 조건에 맞는 쿠키가 없다면 undefined를 반환합니다.
const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() =>{
    
    axios.post('http://localhost:3000/user/auth/silent-refresh',{}, {
      withCredentials:true
    }).then(res=> {
      console.log(res);
      const {accessToken} = res.data;
      console.log(accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setIsLoggedIn(true)
    });


  },[])
  return (
    <>
    {isLoggedIn && <nav >로그인 되었습니다.</nav>}
    
      <Router>
        <Switch>
          <Route path="/" exact component={Main}></Route>
          <Route path="/about" component={About}></Route>
          <Route path="/login" component={Login}></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
