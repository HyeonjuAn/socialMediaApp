import "./App.css";
import Home from "./pages/Home/Home";
import EntryPage from "./pages/EntryPage/EntryPage";
import Profile from "./pages/Profile/Profile";
import PostPage from "./pages/PostPage/PostPage";
import ExplorePage from "./pages/ExplorePage/ExplorePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import NotificationsPage from "./pages/NotificationsPage/NotificationsPage";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./helpers/UserContext";
import { SocketProvider } from "./helpers/SocketContext";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#00B9E8",
        },
        error: {
            main: "#DB5461",
        },
        success: {
            main: "#4A8FE7",
        },
        background: {
            default: "#121212",
        },
        text: {
            primary: "#EEE0CB",
        },
    },
    typography: {
        htmlFontSize: 16,
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
    },
});

function App() {
    return (
        <SocketProvider>
            <UserProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Routes>
                        {/* Most specific routes first */}
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<EntryPage />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/register" element={<EntryPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/post/:id" element={<PostPage />} />
                        {/* General routes */}
                        <Route path="/user/:username" element={<Profile />} />
                        {/* Home route and catch-all */}
                        <Route path="/" element={<Home />} index />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </ThemeProvider>
            </UserProvider>
        </SocketProvider>
    );
}

export default App;
