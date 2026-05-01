import styles from "./App.module.css";
import Home from "./page/home/Home";
import BottomNav from "./widgets/BottomNav/BottomeNav";
import Header from "./widgets/Header/Header";

function App() {
  return (
    <div className={styles.container}>
      <Header />
      <Home />
      <BottomNav />
    </div>
  );
}

export default App;
