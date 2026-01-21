import React from 'react';

function ClientAccounts(props) {
   
    const accountDatas = props.data.data.liveaccount;

    return (
        <>
         <div className="fix-table-height">
            <div className="table-responsive mt-3">
             <table className="table m-0">
                     <thead>
                        <tr>
                           <th scope="col">Login</th>
                      {/* <th scope="col">Account Type</th> */}
                      {/* <th scope="col">Leverage</th> */}
                      <th scope="col">Status</th>
                      <th scope="col">Created At</th>
                        </tr>
                     </thead>
                     <tbody>
                   {Array.isArray(accountDatas) && accountDatas.length === 0 ? <tr className='text-center'><td colspan="3">No records found</td></tr> : accountDatas.map((accountData) =>
                        <tr>
                           <th scope="row">{accountData.login}</th>
                         {/* <td>{accountData.account_type}</td> */}
                         {/* <td>{accountData.account_leverage}</td> */}
                         <td>{(accountData.status === 1) ? 'Active' : 'Remove From MT'}</td>
                         <td>{accountData.created_at}</td>
                        </tr>
                     )}  
                     </tbody>
               </table>
            </div>
         </div>
         </>
    );
}

export default ClientAccounts;