import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";
import "./App.css";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/common/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import CreateBook from "./components/create/CreateBook";
import Book from "./components/book/Book";
import AddChapter from "./components/create/AddChapter";
import EditBook from "./components/edit/EditBook";
import Books from "./components/books/Books";
import EditChapter from "./components/edit/EditChapter";
import ReadBook from "./components/readbook/ReadBook";
import NoMatch from "./components/layout/NoMatch";
import { clearCurrentProfile } from "./actions/profileActions";
import CreateProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";
import CreatePoem from "./components/create/CreatePoem";
import ReadPoem from "./components/poem/ReadPoem";
import EditPoem from "./components/edit/EditPoem";
import CreateShort from "./components/create/CreateShort";
import EditShort from "./components/edit/EditShort";
import ReadShort from "./components/short/ReadShort";

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/create-book" component={CreateBook} />
              <PrivateRoute exact path="/create-poem" component={CreatePoem} />
              <PrivateRoute
                exact
                path="/create-short"
                component={CreateShort}
              />
              <PrivateRoute exact path="/edit-poem/:id" component={EditPoem} />
              <PrivateRoute exact path="/edit-book/:id" component={EditBook} />
              <PrivateRoute
                exact
                path="/add-chapter/:bookid"
                component={AddChapter}
              />
              <PrivateRoute
                exact
                path="/chapter-edit/:bookid/:id"
                component={EditChapter}
              />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path="/edit-short/:id"
                component={EditShort}
              ></PrivateRoute>
              <Route exact path="/books" component={Books} />
              <Route exact path="/book/:id" component={Book} />
              <Route exact path="/readbook/:id" component={ReadBook} />
              <Route exact path="/poem/:id" component={ReadPoem} />
              <Route exact path="/short/:id" component={ReadShort}></Route>
              <Route component={NoMatch}></Route>
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
