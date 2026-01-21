import Innerlayout from "../Components/Innerlayout";
import { Fragment } from "react";
import Tabcontent from "../Pages/Corporateform/Tabcontent";
import { showClient } from "../store/clientslice";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const Corporate = () => {

    const client = useSelector(showClient);
    const history = useHistory();

    if (client.client.form_terms_validation === "completed" && client.client.verify === "Completed") {
        history.push('/dashboard');
    } else if (client.client.form_terms_validation === "completed" && client.client.verify === "Not Completed") {
        history.push('/accountverification');
    } else if (client.client.form_type != null && client.client.form_type === 0) {
        history.push('/individualdetails');
    } 

    return (
        <Fragment>
            <Innerlayout>
                <div className="box-wrapper w-100 application-from">
                    <div className="card-body p-0">
                        <div className="d-flex flex-wrap justify-content-between">
                            
                            <Tabcontent  />
                        </div>
                    </div>
                </div>
            </Innerlayout>

        </Fragment>
    );
}
export default Corporate;