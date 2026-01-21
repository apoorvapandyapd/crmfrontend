import React from 'react';

function ClientCommissionHistory(props) {

    const commissionData = props.data.data.commission_info;

    return (
        <>
            <div className="table-responsive mt-32">
                <table className="table m-0">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Level</th>
                            <th scope="col">Percentage</th>
                            <th scope="col">Description</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {commissionData.map((data,index) =>
                        <tr>
                            <td>{index + 1}</td>
                            <td>${data.amount}</td>
                            <td>{(data.level !== null) ? data.level : '-' }</td>
                            <td>{(data.percentage !== null) ? data.percentage : '-'}</td>
                            <td>{data.description}</td>
                            <td>{data.created}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ClientCommissionHistory;