import React from 'react'

function Disclaimer({method}) {
    return (
        method=='Digital Currency' ?
        <div className="p-40">
        
            <p><strong style={{fontWeight:'bold'}}>Disclaimer:</strong> Important Information Regarding Digitalcurrency Transactions</p>

            <p>We would like to bring to your attention some crucial information regarding cryptocurrency transactions conducted through our platform. Please read this disclaimer carefully as it outlines the following important points:</p>
            
            <h3>1. Transaction Charges:</h3>
            <p>Every cryptocurrency transaction executed through our platform will be subject to specific transaction charges. These charges may vary depending on the type of transaction and market conditions. It is essential to understand the applicable charges associated with each transaction.</p>

            <h3>2. Processing Times:</h3>
            <p>Please be aware that cryptocurrency transactions may experience varying processing times due to network congestion, security protocols, or other factors. The time taken to confirm and complete transactions can fluctuate. We recommend your patience and understanding in such situations, and we will make every effort to process transactions promptly.</p>

            <h3>3. Crypto Wallet Address Accuracy:</h3>
            <p>One of the unique characteristics of cryptocurrencies is their irreversible nature. When initiating a cryptocurrency transfer, it is paramount to double-check the recipient's wallet address. Transferring cryptocurrency to an incorrect or incompatible wallet may result in the loss of your funds. We emphasize the utmost importance of verifying the recipient's wallet address before executing any transaction.</p>

            <h3>Liability Disclaimer:</h3>
            <p>PM Financials Ltd shall not be held responsible for losses resulting from transactions to incorrect wallet addresses. Our platform provides tools and information to assist in verifying wallet addresses, but the ultimate responsibility for ensuring the accuracy of the recipient's address lies with the user. By using our services, you acknowledge and accept the risk associated with cryptocurrency transactions and agree to hold PM Financials Ltd harmless for any such losses.</p>

            <p>Your use of our platform implies your acceptance of these terms and your understanding of the associated risks.</p>

            <p>If you have any questions or require clarification on any of the points mentioned above, please do not hesitate to contact our customer support team at <a className="link-text" href="mailto:info@pmfinancials.mu">info@pmfinancials.mu</a>.</p>

        </div> :
        <div className="p-40">
            <h3>Disclaimer</h3> 
            <p>There will be nominal charges associated with certain types of transactions made through your accounts with PM Financials Ltd. These charges will help us maintain and enhance the quality of services we provide to you.</p>
            <p>Please note that these fees will be deducted directly from your account at the time of the respective transaction. This adjustment ensures transparency and ease of payment, allowing you to continue enjoying our services seamlessly.</p>
            <p>We understand the importance of clear and open communication, If you have any questions or require further information regarding these changes, please don't hesitate to contact our customer support team at <a className="link-text" href="mailto:info@pmfinancials.mu">info@pmfinancials.mu</a>.</p>
            <p>At PM Financials Ltd, we remain committed to serving your financial needs with excellence. We appreciate your trust in us, and we are confident that these changes will help us provide even better services to you in the future.</p>
        </div>
    )
}

export default Disclaimer
