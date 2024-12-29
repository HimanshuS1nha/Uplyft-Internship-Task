import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import SignedInUsersOnly from "./components/signed-in-users-only";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <SignedInUsersOnly>
            <HomePage />
          </SignedInUsersOnly>
        }
      />
      <Route path="/login" Component={LoginPage} />
      <Route path="/signup" Component={SignupPage} />
    </Routes>
  );
};

export default App;
