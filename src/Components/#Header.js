import { Link } from 'react-router-dom';
// import classes from './Header.module.css';
function Header() {
    return (
        <div>
            <h1>Pmfinancials</h1>
            <div className={classes.linkright}>
                <Link to="/signup" className={classes.linkrhead}>Sign Up</Link>
                <Link to="/login" className={classes.linkrhead}>Sign In</Link>
            </div>
        </div>
    );
}

export default Header;