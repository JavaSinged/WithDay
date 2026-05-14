import { Routes, Route, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import Home from "./page/home/Home";
import Signup from "./page/login/Signup";
import Login from "./page/login/Login";
import SocialExtra from "./page/login/SocialExtra";
import ScheduleDetail from "./page/schedule/ScheduleDetail";
import WriteSchedule from "./page/schedule/WriteSchedule";
import MySchedulePage from "./page/my-schedule/MySchedulePage";
import PrivateRoute from "./features/ui/PrivateRoute";
import Header from "./features/layout/Header";
import BottomNav from "./features/layout/BottomNav";

const CHROME_HIDDEN_PATHS = ["/login", "/signup", "/signup/extra"];

function AppShell() {
  const location = useLocation();
  const hideChrome = CHROME_HIDDEN_PATHS.includes(location.pathname);

  return (
    <div className={styles.container}>
      {!hideChrome && <Header />}
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/extra" element={<SocialExtra />} />
          <Route path="/schedule/:scheduleId" element={<ScheduleDetail />} />
          <Route path="/my-schedule" element={<MySchedulePage />} />
          <Route
            path="/write"
            element={
              <PrivateRoute>
                <WriteSchedule />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {!hideChrome && <BottomNav />}
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
