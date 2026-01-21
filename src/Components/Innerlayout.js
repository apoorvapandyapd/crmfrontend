import {Fragment, useEffect} from "react";
import Crmheader from "./Crmheader";
import Sidebar from "./Sidebar";
import {redirectAsync, showClient} from "../store/clientslice";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from 'react-router-dom';
import {Link} from 'react-router-dom';

const Innerlayout = (props) => {

    const history = useHistory();
    const client = useSelector(showClient);
    const dispatch = useDispatch();

    if (client.islogin === false) {
        history.push('/login')
    } else if (client.islogin === true && client.alreadyLogin === false) {
    } else if (client.islogin === true && client.alreadyLogin === false) {
        history.push('/verify')
    }
    if (client.client.active === false) {
        dispatch(redirectAsync());
    }

    const toggleSidebar = () => {
        if (document.getElementById("rightContent").classList.contains('show')) {
            document.getElementById("rightContent").classList.remove("show");
            document.getElementById("leftMenu").classList.remove("close");
            document.getElementById("sideBarToggle").classList.remove("open");
        } else {
            document.getElementById("rightContent").classList.add("show");
            document.getElementById("leftMenu").classList.add("close");
            document.getElementById("sideBarToggle").classList.add("open");
        }
    }
    const handleResize = () => {
        if (window.innerWidth < 767) {
            document.getElementById("leftMenu").classList.remove("close");
            document.getElementById("rightContent").classList.remove("show");
            document.getElementById("rightContent").classList.remove("show");
        } else {
            document.getElementById("rightContent").classList.remove("show");
            document.getElementById("leftMenu").classList.remove("close");
            document.getElementById("sideBarToggle").classList.remove("open");
        }
    }

    useEffect(() => {
        handleResize();
    }, [])

    return (
        <Fragment>
            <div className="site-wrapper">
                <div className="d-flex">
                    <Sidebar/>
                    <div className="right-content" id="rightContent">
                        <Link to='#' className="menu-slide mobile-menu" id='sideBarToggle' onClick={toggleSidebar}>
                            <span></span>
                        </Link>
                        <Crmheader/>
                        <main>
                            {props.children}
                        </main>
                        <footer>&copy; {new Date().getFullYear()} CRM. All Right Reserved.</footer>
                    </div>

                </div>

            </div>
        </Fragment>
    );
}

export default Innerlayout;