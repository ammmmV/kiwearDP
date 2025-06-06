import React, { useContext } from 'react';
import { Routes, Route, Redirect } from 'react-router-dom'
import { authRoutes, publicRoutes } from "../routes";
import { SHOP_ROUTE, ADMIN_ROUTE } from "../utils/consts";
import { Context } from "../index";
import { observer } from "mobx-react-lite";


const AppRouter = observer(() => {
    const { user } = useContext(Context)

    console.log(user)
    return (
        <Routes>
            {user.isAuth && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
            {/* <Route to={SHOP_ROUTE} /> */}
            <Route to={ADMIN_ROUTE} />
        </Routes>
    );
});

export default AppRouter;
