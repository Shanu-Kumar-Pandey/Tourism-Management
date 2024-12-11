// LinkExpired.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkSlash } from '@fortawesome/free-solid-svg-icons'; // Import the broken link icon
import './LinkExpired.css'; // Import the CSS file for styling

function LinkExpired() {
    return (
        <div className="link-expired-container">
            <FontAwesomeIcon icon={faLinkSlash} className="broken-link-icon" /> {/* Add the icon here */}
            <h2>Link Expired</h2>
            <p>The link you used has expired. Please request a new password reset link.</p>
            <Link to="/forgot-password" className="request-link">Request New Link</Link>
        </div>
    );
}

export default LinkExpired;
