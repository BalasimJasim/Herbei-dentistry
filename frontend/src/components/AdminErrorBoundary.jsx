import { Component } from 'react'
import PropTypes from 'prop-types'

class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin Error:', error, errorInfo)
    // You could send this to your error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong in the admin panel</h2>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
          <button 
            onClick={() => window.location.reload()}
            className="refresh-button"
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

AdminErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
}

export default AdminErrorBoundary 