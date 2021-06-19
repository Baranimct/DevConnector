import { React, useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layouts/Spinner'
import { getProfiles } from '../../actions/profile'
import ProfileItem from './ProfileItem'

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
    useEffect(() => {
        getProfiles();
    }, [getProfiles]);
    return (
        <Fragment>{

            profiles.length === 0 ? <Spinner /> : <Fragment>
                <h1 className="large text-primary">Developers</h1>
                <p className="lead">
                    <i className="fab fa-connectdevelop"></i>Browse and Connect with developers
                </p>
                <div className="profiles">{profiles.length > 0 ? (
                    profiles.map(profile => (
                        <ProfileItem key={profile.id} profile={profile} />
                    ))
                ) : <h4> No profiles found </h4>}</div>
            </Fragment>
        }</Fragment>
    )
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired

}

const mapStatetoProps = state => ({
    profile: state.profile
})

export default connect(mapStatetoProps, { getProfiles })(Profiles);
