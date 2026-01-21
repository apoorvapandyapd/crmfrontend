import { Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { useHistory } from "react-router-dom";
const Nomatch = () => {
    let history = useHistory();
    return (
        <div className="wrapper-404 d-flex w-100 justify-content-center align-items-center">
        <div className="py-4 px-4">
            <div className="content-wrapper-404">
                <div className="logo"><Image src={`${process.env.PUBLIC_URL}/Images/backend-logo.png`} width="160" alt="login" fluid /></div>
                <Image src={`${process.env.PUBLIC_URL}/Images/graphic-404.svg`} alt="login" className="graphic"  />
                <h3>Something went <span>WRONG!</span></h3>
                <Button onClick={history.goBack}>Back</Button>
            </div>
        </div>
        </div>
    );
}

export default Nomatch;