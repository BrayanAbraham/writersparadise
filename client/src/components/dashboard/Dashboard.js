import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DashboardHeader from "./DashboardHeader";
import DashboardPosts from "./DashboardPosts";
///import DashboardPoems from "./DashboardPoems";
import { getBooksByUser } from "../../actions/bookActions";
import { getPoemByUser } from "../../actions/poemActions";

class Dashboard extends Component {
  componentWillMount() {
    const { user } = this.props.auth;
    this.props.getBooksByUser(user.id);
    this.props.getPoemByUser(user.id);
  }
  render() {
    const { user } = this.props.auth;
    let books = null;
    let poems = null;
    if (this.props.book.books.length > 0) {
      books = (
        <div>
          <hr />
          <div className="row text-center">
            <h1 className="col-md-12 display-4 text-center">Books</h1>
          </div>
          <DashboardPosts user={user} />
        </div>
      );
    }

    // if (this.props.poem.poems.length > 0) {
    //   poems = (
    //     <div>
    //       <hr />
    //       <div className="row text-center">
    //         <h1 className="col-md-12 display-4 text-center">Poems</h1>
    //       </div>
    //       <DashboardPoems user={user} />
    //     </div>
    //   );
    // }

    return (
      <div className="dashboard">
        <div className="row">
          <div className="col-md-12">
            <DashboardHeader user={user} />
            {books}
            {poems}
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  getBooksByUser: PropTypes.func.isRequired,
  book: PropTypes.object.isRequired,
  poem: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  book: state.book,
  poem: state.poem
});

export default connect(
  mapStateToProps,
  { getBooksByUser, getPoemByUser }
)(Dashboard);
