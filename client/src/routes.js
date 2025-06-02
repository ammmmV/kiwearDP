import Admin from "./pages/Admin";
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  PATTERN_ROUTE,
  PATTERNS_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
  USER_PROFILE_DATA_ROUTE,
  USERS_FIX_ROUTE,
  PATTERNS_FIX_ROUTE,
  ORDERS_ROUTE,
  ADMIN_ORDERS_ROUTE,
  ADMIN_REVIEWS_ROUTE,
  REVIEWS_ROUTE,
  FABRIC_CALCULATOR_ROUTE,
  ADMIN_CALCULATOR_ROUTE
} from "./utils/consts";
import Basket from "./pages/Basket";
import Auth from "./pages/Auth";
import UserTable from "./pages/UserTable";
import PatternTable from "./pages/PatternTable";
import PatternPage from "./pages/PatternPage";
import UserProfileData from "./pages/UserProfileData";
import Patterns from "./pages/Patterns";
import Catalog from "./pages/Catalog";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";
import AdminReviews from "./pages/AdminReviews";
import Reviews from "./pages/Reviews";
import FabricCalculator from "./pages/FabricCalculator";
import FabricCalculatorAdmin from "./pages/FabricCalculatorAdmin";

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: Admin,
  },
  {
    path: BASKET_ROUTE,
    Component: Basket,
  },
  {
    path: USERS_FIX_ROUTE,
    Component: UserTable,
  },
  {
    path: PATTERNS_FIX_ROUTE,
    Component: PatternTable,
  },
  {
    path: ADMIN_ORDERS_ROUTE,
    Component: AdminOrders,
  },
  {
    path: ADMIN_REVIEWS_ROUTE,
    Component: AdminReviews
  },
  {
    path: ADMIN_CALCULATOR_ROUTE,
    Component: FabricCalculatorAdmin
  }
];

export const publicRoutes = [
  {
    path: SHOP_ROUTE,
    Component: Catalog,
  },
  {
    path: ORDERS_ROUTE,
    Component: Orders,
  },
  {
    path: LOGIN_ROUTE,
    Component: Auth,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Auth,
  },
  {
    path: PATTERN_ROUTE + "/:id",
    Component: PatternPage,
  },
  {
    path: USER_PROFILE_DATA_ROUTE,
    Component: UserProfileData,
  },
  {
    path: PATTERNS_ROUTE,
    Component: Patterns,
  },
  {
    path: REVIEWS_ROUTE,
    Component: Reviews,
  },
  {
    path: FABRIC_CALCULATOR_ROUTE,
    Component: FabricCalculator,
  },
];
