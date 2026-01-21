import React, { Fragment } from "react";
import Innerlayout from "../Components/Innerlayout";
import MtTradeList from "./Trades/MtTradeList";

const Trades = () => {
    return (
        <Fragment>
            <Innerlayout>
                <MtTradeList></MtTradeList>
            </Innerlayout>
        </Fragment>
    );
}



export default Trades;