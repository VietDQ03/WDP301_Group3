import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requiredRole }) => {
    const user = useSelector((state) => state.auth.user);
    console.log("hêmkạds", requiredRole)
    console.log("ádjkakdja", user.role?.name)

    if (!user || user.role?.name !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
