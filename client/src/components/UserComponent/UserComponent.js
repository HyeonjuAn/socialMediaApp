import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import AvatarLink from "../AvatarLink/AvatarLink";

// NOTE: searchUser API Call returns username and profile picture
// Create a component that displays the username and profile picture
const UserComponent = ({ user }) => {
    const handleCardClick = () => {
        window.location.href = `/user/${user.username}`;
    };

    return (
        <Card
            sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "transparent",
                backgroundImage: "none",
                padding: "0.5rem",
                borderRadius: 0,
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
            }}
            onClick={handleCardClick}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        padding: 0,
                    }}
                >
                    <AvatarLink username={user.username} avatarUrl={user.avatarUrl} />
                    <Typography
                        variant="body1"
                        sx={{
                            marginLeft: "10px",
                            marginTop: "8px",
                        }}
                    >
                        @{user.username}
                    </Typography>
                </CardContent>
                <CardContent
                    sx={{
                        padding: 0,
                        "&:last-child": {
                            paddingTop: "0.5rem",
                            paddingBottom: "0.5rem",
                        },
                    }}
                >
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                            marginLeft: "50px",
                        }}
                    >
                        {user.bio ? user.bio : "No bio yet"}
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    );
};

export default UserComponent;
