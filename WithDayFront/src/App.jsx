import styles from "./App.module.css";
import Home from "./page/home/Home";
import BottomNav from "./widgets/BottomNav/BottomeNav";
import Header from "./widgets/Header/Header";
import { Routes, Route } from "react-router-dom";
import SignupForm from "./page/login/SignupForm";
import WriteSchedule from "./page/schedule/WriteSchedule";

function App() {
  return (
    <div className={styles.container}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<SignupForm />} />
        <Route path="/write" element={<WriteSchedule />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default App;
