import React from "react";
import { Link } from "react-router-dom";

const Unauthorized: React.FC = () => {
    return (
        <div className="flex justify-center">
            <div className="text-center p-8">
                <h1 className="text-3xl font-bold text-red-600 mb-4">403 Forbidden</h1>
                <p className="text-lg text-gray-700 mb-6">
                    You do not have permission to access this page.
                </p>
                <Link to="/dashboard" className="text-blue-500 hover:underline text-lg">
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
