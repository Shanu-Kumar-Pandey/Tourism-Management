import './Navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function Navbar() {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(''); // State to store the user's role
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        setIsLoggedIn(!!token); // Update login state based on token presence

        if (token) {
            // Fetch the user role from localStorage or API
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role) {
                setUserRole(user.role);
            }
        }
    }, []);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="logo"></div>
            <ul className="nav-links">
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
                        Home
                    </NavLink>
                </li>
                <li>
                    {isLoggedIn ? (
                        userRole === 'tourist' || userRole === 'admin' ? (
                            <NavLink to="/places" className={({ isActive }) => isActive ? "active-link" : ""}>
                                Places
                            </NavLink>
                        ) : userRole === 'agent' ? (
                            <NavLink to="/tour" className={({ isActive }) => isActive ? "active-link" : ""}>
                                Tours
                            </NavLink>
                        ) : null
                    ) : (
                        <NavLink to="/places" className={({ isActive }) => isActive ? "active-link" : ""}>
                            Places
                        </NavLink>
                    )}
                </li>
                <li
                    className="dropdown"
                    onMouseEnter={toggleDropdown}
                    onMouseLeave={toggleDropdown}
                >
                    <NavLink to="/account/personal-info" className={({ isActive }) => isActive ? "active-link" : ""}>
                        Account
                    </NavLink>
                    <ul className={`dropdown-menu ${isDropdownVisible ? "show" : ""}`}>
                        <li><NavLink to="/account/personal-info">Personal Info</NavLink></li>
                        <li><NavLink to="/account/favorites">Bookings</NavLink></li>
                        <li><NavLink to="/account/reviews">Reviews</NavLink></li>
                    </ul>
                </li>
                <li>
                    <NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}>
                        About
                    </NavLink>
                </li>
                {/* Add User Control link for admin */}
                {isLoggedIn && userRole === 'admin' && (
                    <li>
                        <NavLink to="/user-control" className={({ isActive }) => isActive ? "active-link" : ""}>
                            User Control
                        </NavLink>
                    </li>
                )}
            </ul>
            <div className="auth-links">
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                ) : (
                    <NavLink to="/login">Sign in</NavLink>
                )}
            </div>
        </nav>
    );
}

export default Navbar;

// import './Navbar.css';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';

// function Navbar() {
//     const [isDropdownVisible, setIsDropdownVisible] = useState(false);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userRole, setUserRole] = useState(''); // State to store the user's role
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = Cookies.get('token');
//         setIsLoggedIn(!!token); // Update login state based on token presence

//         if (token) {
//             // Fetch the user role from localStorage or API
//             const user = JSON.parse(localStorage.getItem('user'));
//             if (user && user.role) {
//                 setUserRole(user.role);
//             }
//         }
//     }, []);

//     const toggleDropdown = () => {
//         setIsDropdownVisible(!isDropdownVisible);
//     };

//     const handleLogout = () => {
//         Cookies.remove('token');
//         localStorage.removeItem('user');
//         setIsLoggedIn(false);
//         navigate('/login');
//     };

//     return (
//         <nav className="navbar">
//             <div className="logo"></div>
//             <ul className="nav-links">
//                 <li>
//                     <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
//                         Home
//                     </NavLink>
//                 </li>
//                 <li>
//                     {isLoggedIn ? (
//                         userRole === 'tourist' ||  userRole === 'admin' ? (
//                             <NavLink to="/places" className={({ isActive }) => isActive ? "active-link" : ""}>
//                                 Places
//                             </NavLink>
//                         ) : userRole === 'agent' ? (
//                             <NavLink to="/tour" className={({ isActive }) => isActive ? "active-link" : ""}>
//                                 Tours
//                             </NavLink>
//                         ) : null
//                     ) : (
//                         <NavLink to="/places" className={({ isActive }) => isActive ? "active-link" : ""}>
//                             Places
//                         </NavLink>
//                     )}
//                 </li>
//                 <li
//                     className="dropdown"
//                     onMouseEnter={toggleDropdown}
//                     onMouseLeave={toggleDropdown}
//                 >
//                     <NavLink to="/account/personal-info" className={({ isActive }) => isActive ? "active-link" : ""}>
//                         Account
//                     </NavLink>
//                     <ul className={`dropdown-menu ${isDropdownVisible ? "show" : ""}`}>
//                         <li><NavLink to="/account/personal-info">Personal Info</NavLink></li>
//                         <li><NavLink to="/account/favorites">Bookings</NavLink></li>
//                         <li><NavLink to="/account/reviews">Reviews</NavLink></li>
//                     </ul>
//                 </li>
//                 <li>
//                     <NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}>
//                         About
//                     </NavLink>
//                 </li>
//             </ul>
//             <div className="auth-links">
//                 {isLoggedIn ? (
//                     <button onClick={handleLogout} className="logout-button">Logout</button>
//                 ) : (
//                     <NavLink to="/login">Sign in</NavLink>
//                 )}
//             </div>
//         </nav>
//     );
// }

// export default Navbar;
