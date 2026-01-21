import React from 'react';

function IbGroupInfo(props) {
    const data_length = props.data.data.group_info_commission.data.length;

    return (
        <>
            <h2 className="mb-0">IB Plan Info</h2>
            <div className="row align-items-center">
            { 
                (data_length > 1) ? 
                props.data.data.group_info_commission.data.map((value)=>(
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3 mt-0 mt-sm-4">
                        <div className="verification-box">
                            {props.data.data.group_info.name}
                            <span>{value.name} : {value.value}</span>
                        </div>
                    </div>
                    
                ))
                 :
                 props.data.data.group_info_commission.data.map((value)=>(
                    <div className="col-sm-12 mt-0 mt-sm-4">
                        <div className="verification-box">
                            {props.data.data.group_info.name}
                            <span>{value.name} : {value.value}</span>
                        </div>
                    </div>
                ))
            }
                {props.data.data.group_info.upgrade_plan_name !== undefined ? <><div className="col-sm-6 col-md-6 col-lg-6 col-xl-3 mt-0 mt-sm-4">
                        <div className="verification-box">
                            New Plan
                            <span>{props.data.data.group_info.upgrade_plan_name}</span>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3 mt-0 mt-sm-4">
                        <div className="verification-box">
                            New Plan Start Date
                            <span>{props.data.data.group_info.upgrade_plan_date}</span>
                        </div>
                    </div></> : ''}    

            </div>
        </>
    );
}

export default IbGroupInfo;