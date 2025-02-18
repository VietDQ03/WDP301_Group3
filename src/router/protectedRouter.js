import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated || !user || user?.role?.name !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
