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
import FilterBooks from "./components/books/FilterBooks";
// import CreatePoem from "./components/create/CreatePoem";
// import ReadPoem from "./components/poem/ReadPoem";
// import EditPoem from "./components/edit/EditPoem";

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
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
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/create-book" component={CreateBook} />
            </Switch>
            {/* <Switch>
              <PrivateRoute exact path="/create-poem" component={CreatePoem} />
            </Switch> */}
            {/* <Switch>
              <PrivateRoute exact path="/edit-poem/:id" component={EditPoem} />
            </Switch> */}
            <Switch>
              <PrivateRoute exact path="/edit-book/:id" component={EditBook} />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/add-chapter/:bookid"
                component={AddChapter}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/chapter-edit/:bookid/:id"
                component={EditChapter}
              />
            </Switch>
            <Route exact path="/books" component={Books} />
            <Route exact path="/book/:id" component={Book} />
            <Route exact path="/readbook/:id" component={ReadBook} />
            {/* <Route exact path="/poem/:id" component={ReadPoem} /> */}
            <Route exact path="/books/:filter" component={FilterBooks} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
