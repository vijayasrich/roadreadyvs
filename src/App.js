import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import Register from "./components/Register";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./utils/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import AddCar from "./components/AddCar";
import EditCar from "./components/EditCar";
import AddCarExtra from "./components/AddCarExtra";
import PasswordResetList from "./components/PasswordResetList";
import ReservationList from "./components/ReservationList";
import AddReservation from "./components/AddReservation";
import CarExtraList from "./components/CarExtraList";
import CarList from "./components/CarList";
import PaymentList from "./components/PaymentList";
import ReviewList from "./components/ReviewList";
import AddReviewPage from "./components/AddReview";
import EditUser from "./components/EditUser";
import UserList from "./components/UserList";
import EditCarExtra from "./components/EditCarExtra";
import ReservationManagement from "./components/ReservationManagement";


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="page-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<PasswordResetList />} />
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
              <Route path="/reservations" element={<ReservationList />} />
              <Route path="/add-reservation" element={<AddReservation />} />
              <Route path="/carextras" element={<CarExtraList />} />
              <Route path="/add-carextra" element={<AddCarExtra />} />
              <Route path="/edit-carextra/:id" element={<EditCarExtra />} />
              <Route path="/cars" element={<CarList />} />
              <Route path="/add-car" element={<AddCar />} />
              <Route path="/payments" element={<PaymentList />} />
              <Route path="/reviews" element={<ReviewList />} />
              <Route path="/add-review" element={<AddReviewPage />} />
              <Route path="/edit-car/:id" element={<EditCar />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/edit-user/:userId" element={<EditUser />} /> 
              <Route path="/users" element={<UserList />} />
              <Route path="/reservation-management" element={<ReservationManagement />} />
              </Route>
            </Routes>
          </main>
        </div>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}

export default App;