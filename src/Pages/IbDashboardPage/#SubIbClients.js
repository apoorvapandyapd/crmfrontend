import React from 'react';

function SubIbClients(props) {
   
    const clientDatas = props.data.data.clients;

    return (
        <>
          <div className="table-responsive mt-32">
             <table className="table m-0">
                     <thead>
                           <tr>
                              <th scope="col">#</th>
                              <th scope="col">Name</th>
                              <th scope="col">Email</th>
                              <th scope="col">Phone</th>
                              <th scope="col">Status</th>
                              <th scope="col">Affiliate Status</th>
                              <th scope="col">Date</th>
                           </tr>
                     </thead>
                     <tbody>
                     {clientDatas.map((clientData,index) =>
                        <tr>
                           <td>{index+1}</td>
                           <td>{clientData.name}</td>
                           <td>{clientData.email}</td>
                           <td>{clientData.phone_no}</td>
                           <td>{clientData.status}</td>
                           <td>{clientData.affiliate_status}</td>
                           <td>{clientData.created}</td>
                        </tr>
                     )}  
                     </tbody>
               </table>
            </div>
         </>
    );
}

export default SubIbClients;