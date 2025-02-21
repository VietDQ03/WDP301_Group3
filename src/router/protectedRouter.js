import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated || !user) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && user.role?.name !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};


export default ProtectedRoute;
