import React from 'react'
import { Link } from 'react-router-dom';
import { KeyboardArrowLeftIcon, KeyboardArrowRightIcon } from './icons';

function Pagination({ nPages, currentPage, setCurrentPage, maxPageLimit, minPageLimit, perPageLimit, setMaxPageNumberLimit, setMinPageNumberLimit }) {

    //---get total page numbers array
    const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

    const nextPage = () => {
        if(currentPage !== nPages){
            setCurrentPage(currentPage + 1);

            //---login for show next pages after click on >
            if(currentPage + 1 > maxPageLimit){
                setMaxPageNumberLimit(maxPageLimit + perPageLimit);
                setMinPageNumberLimit(currentPage);
            }
        }
    }
    const prevPage = () => {
        if(currentPage !== 1){
            setCurrentPage(currentPage - 1);

            //---login for show next pages after click on <
            if ((currentPage - 1) % perPageLimit === 0) {
                setMaxPageNumberLimit(maxPageLimit - perPageLimit);
                setMinPageNumberLimit((maxPageLimit - perPageLimit) - perPageLimit);
            }
        }
    }

    //---for showing ... after if records available
    let pageIncrementBtn = null;
    if(maxPageLimit < nPages){
        pageIncrementBtn = <li style={{ cursor:'pointer' }} onClick={nextPage}>{"..."}</li>
    }

    let pageDecrementtBtn = null;
    if(perPageLimit < maxPageLimit){
        pageDecrementtBtn = <li style={{ cursor:'pointer' }} onClick={prevPage}>{"..."}</li>
    }


    return (
        <nav>
            <ul className='paginations justify-content-center'>
                <li className="previous">
                    <Link to="#" className="page-num" 
                        onClick={prevPage} 
                    >
                        {/* <Image src={`${process.env.PUBLIC_URL}/Images/pagination-arrow-left.svg`} alt="arrow" fluid /> */}
                        <KeyboardArrowLeftIcon width="16" height="16" />
                    </Link>
                </li>
                {pageDecrementtBtn}
                {pageNumbers.map(pgNumber => (  
                    (pgNumber < maxPageLimit + 1 && pgNumber > minPageLimit) ?
                    <li key={pgNumber} 
                        className="" >
                            <Link to="#" onClick={() => setCurrentPage(pgNumber)}
                                className={`page-num ${currentPage === pgNumber ? 'active' : ''} `}
                            >
                            {pgNumber}
                            </Link>
                    </li> : null
                ))}
                {pageIncrementBtn}
                <li className="next">
                    <Link to="#" className="page-num"
                        onClick={nextPage}
                    >
                        {/* <Image src={`${process.env.PUBLIC_URL}/Images/pagination-arrow-right.svg`} alt="arrow" fluid /> */}
                        <KeyboardArrowRightIcon width="16" height="16" />
                    </Link>
                </li>
            </ul>
        </nav>   
    )
}

export default Pagination
