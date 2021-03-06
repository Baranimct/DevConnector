import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth';

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
    const AuthLinks = (
        <ul>
            <li><Link to="/profiles">
                Developers</Link></li>
            <li><Link to="/posts">
                Posts</Link></li>
            <li><Link to="/dashboard">
                <i className="fas fa-user"></i>{' '}
                <span className='hide-sm'>
                    Dashboard</span></Link></li>
            <li><a onClick={logout} href="#!">
                <i className="fas fa-sign-out-alt"></i>{' '}
                <span className='hide-sm'>Logout </span></a></li>
        </ul>
    );
    const GuestLinks = (
        <ul>
            <li><Link to="/profiles">
                Developers</Link></li>
            <li><Link to="/Register">Register</Link></li>
            <li><Link to="/Login">Login</Link></li>
        </ul>
    );

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
            </h1>
            {!loading && (<Fragment> {isAuthenticated ? AuthLinks : GuestLinks}</Fragment>)}
        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
