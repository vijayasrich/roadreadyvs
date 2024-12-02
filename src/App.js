import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Register from "./components/Register";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./utils/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import ReservationList from "./components/ReservationList";
import AddReservation from "./components/AddReservation";
import CarExtraList from "./components/CarExtraList";
import CarList from "./components/CarList";
import PaymentList from "./components/PaymentList";
import ReviewList from "./components/ReviewList";
import AddReviewPage from "./components/AddReview";
import UserList from "./components/UserList";

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
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
              <Route path="/reservations" element={<ReservationList />} />
              <Route path="/add-reservation" element={<AddReservation />} />
              <Route path="/carextras" element={<CarExtraList />} />
              <Route path="/cars" element={<CarList />} />
              <Route path="/payments" element={<PaymentList />} />
              <Route path="/reviews" element={<ReviewList />} />
              <Route path="/add-review" element={<AddReviewPage />} />
              <Route path="/users" element={<UserList />} />
              {/*<Route path="/cars" element={<CarList />} />
              <Route path="/carextras" element={<CarExtraList />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/reviews" element={<ReviewList />} />
              <Route path="/reservations" element={<ReservationList />} />
              <Route path="/payments" element={<PaymentList />} />
              <Route path="/reset-password" element={<PasswordResetEmail />} />
                <Route path="/reset-passwordtoken" element={<PasswordResetForm />} />

                <Route path="/products" element={<ProductList />} />*/}
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}

export default App;