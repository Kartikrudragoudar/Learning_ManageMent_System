import { userAuthStore } from "../store/auth";
import {Navigate} from "react-router-dom";

const privateRoute = ({children}) => {
    const loggedIn = userAuthStore((state) => state.isLoggedIn)();
    return loggedIn ? <>{children} </> : <Navigate to='/login/' />;
}

export default privateRoute;

