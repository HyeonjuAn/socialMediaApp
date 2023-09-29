import React from "react";
import { Container, Typography, useTheme } from "@mui/material";

const NotFoundPage = () => {
    const theme = useTheme();

    return (
        <Container
            maxWidth="md"
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Typography
                variant="h1"
                gutterBottom
                sx={{
                    color: theme.palette.text.primary,
                    fontWeight: "bold",
                }}
            >
                404
            </Typography>
            <Typography
                variant="h4"
                sx={{
                    color: theme.palette.text.primary,
                    fontWeight: "bold",
                }}
            >
                Page Does Not Exist
            </Typography>
        </Container>
    );
};

export default NotFoundPage;
