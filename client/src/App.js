import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import UserProfileData from "./pages/UserProfileData";
import General from "./pages/General";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { Spinner } from "react-bootstrap";

const App = observer(() => {
    const { user } = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            console.log("nein token")
        }
   
        check().then(data => {
            console.log("tocken  " + data);
            user.setUser(data);
            user.setIsAuth(true);
        }).catch(err => {
            console.error("Authorization failed:", err);
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <Spinner animation="border" variant="secondary" className='align' />
    }

    return (
        <BrowserRouter>
            <NavBar />
            {/* <UserProfileData/> */}
            <AppRouter />
            {/* <General/> */}
        </BrowserRouter>
    );
});

export default App;
