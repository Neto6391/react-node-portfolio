import React from 'react'
import classnames from 'classnames';
import PropTypes from 'prop-types';

const AlertMessage =  (
  props
) => {
  return (
    <div 
      className={
          classnames('alert', {
              'alert-info': props.update,
              'alert-success': !props.update && !props.delete,
              'alert-danger': props.delete
          }) 
      }
      role="alert">
      { props.info }
    </div>
  )
}

AlertMessage.propTypes = {
  info: PropTypes.string.isRequired
}


export default AlertMessage;