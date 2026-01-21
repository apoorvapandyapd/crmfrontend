import React, { Fragment } from 'react'
import Innerlayout from '../../Components/Innerlayout'
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

function ChooseForm() {

    let history = useHistory();

    const selectFormType =(e, type)=>{
        e.preventDefault();
        type=='individual' ? history.push('/individualdetails') : history.push('/corporate');
    }

    return (
      <Fragment>
        <Innerlayout>
        <div className="box-wrapper w-100 application-from">
            <div className="card-body p-0">
                <div className="p-4 label-input">
                    <form>
                        <h3 className="mb-2"><b>Please select an account type</b></h3>
                        <div className="d-flex">
                            <div className="form-group me-3">
                                <button className="btn btn-primary border mt-2" onClick={(e)=>selectFormType(e, 'individual')}>Individual</button>
                            </div>
                            <div className="form-group me-3">
                                <button className="btn btn-primary border mt-2" onClick={(e)=>selectFormType(e, 'corporate')}>Corporate</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </Innerlayout>
      </Fragment>  
    )
}

export default ChooseForm
