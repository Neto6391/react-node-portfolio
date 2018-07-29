import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment'
import { deleteExperience } from '../../actions/profileActions';

class Experience extends Component {

    onDeleteClick(id) {
        this.props.deleteExperience(id, 'Experience Deleted!');
    } 

    render() {
        const experience = this.props.experience.map(exp => (
            <tr key={ exp.id }>
                <td>{ exp.company }</td>
                <td>{ exp.title }</td>
                { exp.to ?
                    <td>
                        <Moment format="DD/MM/YYYY">{ exp.to }</Moment> - <Moment format="DD/MM/YYYY">{ exp.from }</Moment>
                    </td> : 
                    <td><Moment format="DD/MM/YYYY">{ exp.from }</Moment> - Now</td>
                }
                 
                <td><button onClick={ this.onDeleteClick.bind(this, exp._id) } className="btn btn-danger">Delete</button></td>
            </tr>
        ));
        return (
            <div>
                <h4 className="mb-4">Experience Credentials</h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Title</th>
                            <th>Years</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { experience }
                        
                    </tbody>
                </table>
            </div>
        );
    }
}

Experience.propTypes = {
    deleteExperience: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

// const mapStateToProps = state => {
//     profile: state.profile
// }

export default connect(null, { deleteExperience })(Experience);
