import styles from "./App.module.css";
import Home from "./page/home/Home";
import BottomNav from "./widgets/BottomNav/BottomeNav";
import Header from "./widgets/Header/Header";
import { Routes, Route } from "react-router-dom";
import Signup from './page/login/Signup';
import Login from "./page/login/Login";

function App() {
  return (
    <div className={styles.container}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default App;
