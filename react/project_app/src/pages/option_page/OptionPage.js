import React from "react";
import Header from "../common/Header";
import OptionBody from "./components/OptionBody";

function OptionPage(props) {
    return (
        <div className="optionPage">
            <Header setPage={props.setPage} prevPageName="mainPage" prevPageTitle="Main Menu"/>
            <OptionBody />
        </div>
    );
}

export default OptionPage;