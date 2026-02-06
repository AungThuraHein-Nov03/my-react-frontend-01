import { Routes, Route, Navigate } from "react-router-dom";
import { Items } from "./components/item.jsx";
import { ItemEdit } from "./components/itemEdit.jsx";
import { UserList } from "./components/UserList.jsx";
import { UserEdit } from "./components/UserEdit.jsx";
import TestApi from "./components/TestApi.jsx";
import RequireAuth from "./middleware/RequireAuth";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Logout from "./components/Logout";
import { UserProvider } from "./context/UserProvider.jsx"

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/items" replace />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<ItemEdit />} />
        <Route path="/test_api" element={<TestApi />} />
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/users"
          element={
            <RequireAuth>
              <UserList />
            </RequireAuth>
          }
        />
        <Route
          path="/users/:id"
          element={
            <RequireAuth>
              <UserEdit />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/logout"
          element={
            <RequireAuth>
              <Logout />
            </RequireAuth>
          }
        />
      </Routes>
    </UserProvider>
  );
}
export default App;
