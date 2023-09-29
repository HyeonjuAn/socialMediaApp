import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import LeftCol from "../../components/LeftCol/LeftCol";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingPage = () => {
    return (
        <>
            <Navbar />
            <Box
                sx={{
                    display: "flex",
                    height: "100%",
                }}
            >
                <LeftCol />
                <Box
                    sx={{
                        width: "40%",
                        minWidth: "400px",
                        height: "100%",
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "visible",
                        margin: "0 auto",
                        paddingTop: "64px",
                        marginLeft: "30%",
                        border: 1,
                        borderTop: 0,
                        borderBottom: 0,
                        borderColor: "divider",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress />
                </Box>
                <Box
                    sx={{
                        width: "33.33%",
                        margin: "0 auto",
                        overflow: "auto",
                    }}
                ></Box>
            </Box>
        </>
    );
};

export default LoadingPage;
