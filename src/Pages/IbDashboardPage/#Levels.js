import React from 'react';

function Levels(props) {
   
    const levelDatas = props.data.data.group_info_plan.data;

    return (
        <>
            <div className="client-info row align-items-center mt-32">
            {levelDatas.map((data,index) =>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3 mb-4">
                    <div className="verification-box">
                        {data.name}
                        <span>${data.value}</span>
                    </div>
                </div>
            )}
            </div>
        </>
    );
}

export default Levels;