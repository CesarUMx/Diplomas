import React from "react";
import "./Loader.css";

const Loader = () => {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div role="status">
                <div className="banter-loader">
                    <div className="banter-loader__box banter-loader_color_blue"></div>
                    <div className="banter-loader__box banter-loader_color_orange"></div>
                    <div className="banter-loader__box banter-loader_color_blue"></div>
                    <div className="banter-loader__box banter-loader_color_orange"></div>
                    <div className="banter-loader__box banter-loader_color_blue"></div>
                    <div className="banter-loader__box banter-loader_color_orange"></div>
                    <div className="banter-loader__box banter-loader_color_blue"></div>
                    <div className="banter-loader__box banter-loader_color_orange"></div>
                    <div className="banter-loader__box banter-loader_color_blue"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader; 