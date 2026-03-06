import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    return (
        <div className="flex justify-center">
            <div className="text-center p-8">
                <h1 className="text-4xl font-bold text-red-600 mb-4">404 Not Found</h1>
                <p className="text-lg text-gray-700 mb-6">
                    The page you are looking for does not exist.
                </p>
                <Link to="/" className="text-blue-500 hover:underline text-lg">
                    Go Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
