import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import { addLikes, removeLikes, deletePost } from '../../actions/post'
import Swal from 'sweetalert2'


const PostItem = ({ addLikes, removeLikes, deletePost,
    auth, post:
    { _id, text, name, avatar, user, likes, comments, date },
    showActions }) => {


    const sweetalertclick = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Post!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {

            if (result.isConfirmed) {
                deletePost(_id);
                Swal.fire(
                    'Deleted!',
                    'Your Post has been deleted.',
                    'success'
                )

                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Your Post is safe :)',
                    'error'
                )
            }
        })
    }

    return (
        <Fragment>
            <div class="post bg-white p-1 my-1">
                <div>
                    <Link to={`/profile/${user}`}>
                        <img
                            class="round-img"
                            src={avatar}
                            alt=""
                        />
                        <h4>{name}</h4>
                    </Link>
                </div>
                <div>
                    <p class="my-1">
                        {text}
                    </p>
                    <p class="post-date"> Posted on &nbsp;
                        <Moment format="DD/MM/YY hh:mm" >{date}</Moment>
                    </p>
                    {showActions && (<Fragment>
                        <button onClick={e => addLikes(_id)} type="button" class="btn btn-light">
                            <i class="fas fa-thumbs-up"></i>
                            <span>&nbsp; {likes.length > 0 && (<span > &nbsp;{likes.length}</span>)}</span>
                        </button>
                        <button onClick={e => removeLikes(_id)} type="button" class="btn btn-light">
                            <i class="fas fa-thumbs-down"></i>
                        </button>
                        <Link to={`/posts/${_id}`} class="btn btn-primary">
                            Discussion {comments.length > 0 && (<span class='comment-count'> &nbsp;{comments.length}</span>)}
                        </Link>
                        {!auth.loading && user === auth.user._id && (
                            <button onClick={() => sweetalertclick()} button
                                type="button"
                                class="btn btn-danger"
                            >
                                <i class="fas fa-times"></i>
                            </button>
                        )}
                    </Fragment>)}


                </div>
            </div>
        </Fragment>
    )
}

PostItem.defaultProps = {
    showActions: true
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLikes: PropTypes.func.isRequired,
    removeLikes: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { addLikes, removeLikes, deletePost })(PostItem)
