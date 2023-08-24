import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedTitleV2,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import axiosInstance from './pages/login/header';
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";

import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";

import {
  ServiceCreate,
  ServiceEdit,
  ServiceList,
  ServiceShow,
} from "./pages/services";

import {
  UserCreate,
  UserEdit,
  UserList,
  UserShow,
} from "./pages/users";

import {
  OrderCreate,
  OrderEdit,
  OrderList,
  OrderShow,
} from "./pages/orders";

import {
  TransactionCreate,
  TransactionEdit,
  TransactionList,
  TransactionShow,
} from "./pages/transactions";

import {
  ReviewCreate,
  ReviewEdit,
  ReviewList,
  ReviewShow,
} from "./pages/reviews";

import {
  ResolutionCreate,
  ResolutionEdit,
  ResolutionList,
  ResolutionShow,
} from "./pages/resolutions";

import {
  ActivityCreate,
  ActivityEdit,
  ActivityList,
  ActivityShow,
} from "./pages/activity";




import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";



import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';


import "./styles/globals.css";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const API_URL = "http://localhost:7000/api/v1";

  const simpleRestProvider = dataProvider(API_URL,axiosInstance);
  const myDataProvider = {
        ...simpleRestProvider,
        update: async ({ resource, id, variables }) => {
            const url = `${API_URL}/${resource}/${id}`;
            const { data } = await axiosInstance.put(url, variables);
            return { data };
        },
  };

  
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={myDataProvider}
              notificationProvider={notificationProvider}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              routerProvider={routerBindings}
              resources={[
                {
                  name: "profile",
                  list: "/users",
                  create: "/users/create",
                  edit: "/users/edit/:id",
                  show: "/users/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <AccountCircleOutlinedIcon />,
                    label: "Users"
                  },
                },
              
               
                {
                  name: "service",
                  list: "/services",
                  create: "/services/create",
                  edit: "/services/edit/:id",
                  show: "/services/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <LibraryBooksOutlinedIcon />
                  },
                },

                {
                  name: "category",
                  list: "/categories",
                  create: "/categories/create",
                  edit: "/categories/edit/:id",
                  show: "/categories/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <BookmarksOutlinedIcon />
                  },
                },


                {
                  name: "order",
                  list: "/orders",
                  create: "/orders/create",
                  edit: "/orders/edit/:id",
                  show: "/orders/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <ReceiptOutlinedIcon />
                  },
                },

                {
                  name: "transaction",
                  list: "/transactions",
                  create: "/transactions/create",
                  edit: "/transactions/edit/:id",
                  show: "/transactions/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <PaidOutlinedIcon />
                  },
                },

                {
                  name: "review",
                  list: "/reviews",
                  create: "/reviews/create",
                  edit: "/reviews/edit/:id",
                  show: "/reviews/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <CommentOutlinedIcon />
                  },
                },

                {
                  name: "resolution",
                  list: "/resolutions",
                  create: "/resolutions/create",
                  edit: "/resolutions/edit/:id",
                  show: "/resolutions/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <HandshakeOutlinedIcon />

                  },
                },

                {
                  name: "activity",
                  list: "/activity",
                  create: "/activity/create",
                  edit: "/activity/edit/:id",
                  show: "/activity/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <SyncAltOutlinedIcon />
                  },
                },
                

              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayoutV2
                        Header={() => <Header sticky />}
                        Title={({ collapsed }) => (
                          <>
                          <img src="/images/logo.png" width={150}/>
                          </>
                        )}
                      >
                        <Outlet />
                     </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  
                  <Route
                    index
                    element={<NavigateToResource resource="/categories" />}
                  />

                  <Route path="/categories">
                    <Route index element={<CategoryList />} />
                    <Route path="create" element={<CategoryCreate />} />
                    <Route path="edit/:id" element={<CategoryEdit />} />
                    <Route path="show/:id" element={<CategoryShow />} />
                  </Route>

                  <Route path="/services">
                    <Route index element={<ServiceList />} />
                    <Route path="create" element={<ServiceCreate />} />
                    <Route path="edit/:id" element={<ServiceEdit />} />
                    <Route path="show/:id" element={<ServiceShow />} />
                  </Route>

                  <Route path="/users">
                    <Route index element={<UserList />} />
                    <Route path="create" element={<UserCreate />} />
                    <Route path="edit/:id" element={<UserEdit />} />
                    <Route path="show/:id" element={<UserShow />} />
                  </Route>

                  <Route path="/orders">
                    <Route index element={<OrderList />} />
                    <Route path="create" element={<OrderCreate />} />
                    <Route path="edit/:id" element={<OrderEdit />} />
                    <Route path="show/:id" element={<OrderShow />} />
                  </Route>

                  <Route path="/transactions">
                    <Route index element={<TransactionList />} />
                    <Route path="create" element={<TransactionCreate />} />
                    <Route path="edit/:id" element={<TransactionEdit />} />
                    <Route path="show/:id" element={<TransactionShow />} />
                  </Route>

                  <Route path="/reviews">
                    <Route index element={<ReviewList />} />
                    <Route path="create" element={<ReviewCreate />} />
                    <Route path="edit/:id" element={<ReviewEdit />} />
                    <Route path="show/:id" element={<ReviewShow />} />
                  </Route>


                  <Route path="/resolutions">
                    <Route index element={<ResolutionList />} />
                    <Route path="create" element={<ResolutionCreate />} />
                    <Route path="edit/:id" element={<ResolutionEdit />} />
                    <Route path="show/:id" element={<ResolutionShow />} />
                  </Route>


                  <Route path="/activity">
                    <Route index element={<ActivityList />} />
                    <Route path="create" element={<ActivityCreate />} />
                    <Route path="edit/:id" element={<ActivityEdit />} />
                    <Route path="show/:id" element={<ActivityShow />} />
                  </Route>


                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
