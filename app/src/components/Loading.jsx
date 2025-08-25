import React from 'react';
import "./Loading.css";

export default function Loading() {
    return (
        <div className="text-center py-4">
            <div className="lds-facebook">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}