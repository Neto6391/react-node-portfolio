import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment'
import { deleteEducation } from '../../actions/profileActions';

class Education extends Component {

    onDeleteClick(id) {
        this.props.deleteEducation(id, 'Education Deleted!');
    } 

    render() {
        const education = this.props.education.map(edu => (
            <tr key={ edu.id }>
                <td>{ edu.school }</td>
                <td>{ edu.degree }</td>
                { edu.to ?
                    <td>
                        <Moment format="DD/MM/YYYY">{ edu.to }</Moment> - <Moment format="DD/MM/YYYY">{ edu.from }</Moment>
                    </td> : 
                    <td><Moment format="DD/MM/YYYY">{ edu.from }</Moment> - Now</td>
                }
                 
                <td><button onClick={ this.onDeleteClick.bind(this, edu._id) } className="btn btn-danger">Delete</button></td>
            </tr>
        ));
        return (
            <div>
                <h4 className="mb-4">Education Credentials</h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th>School</th>
                            <th>Degree</th>
                            <th>Years</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { education }
                        
                    </tbody>
                </table>
            </div>
        );
    }
}

Education.propTypes = {
    deleteEducation: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

// const mapStateToProps = state => {
//     profile: state.profile
// }

export default connect(null, { deleteEducation })(Education);
