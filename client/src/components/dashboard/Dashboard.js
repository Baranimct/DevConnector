import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount } from '../../actions/profile';

const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading }, deleteAccount }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);
    //return <div>Test</div>
    return loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className='large text-primary'>DashBoard</h1>
        <p className="lead">
            <i className="fas fa-user"></i>Welcome {user && user.name}
        </p>

        {profile !== null ? (
            <Fragment>
                <DashboardActions />
                <Experience experience={profile.experience} />
                <Education education={profile.education} />

            </Fragment>
        ) : (
            <Fragment>
                <p>You have not yet set up your profile yet , Please add some info</p>
                <Link to='/create-profile' className="btn btn-primary my-1">Create Profile</Link>
            </Fragment>
        )}
        <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()} >
                <i className="fas fa-user-minus" > </i><span> &nbsp; Delete My Account </span>
            </button>
        </div>
    </Fragment>
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
};

const mapStateToprops = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToprops, { getCurrentProfile, deleteAccount })(Dashboard);
