import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
} from "@mui/material";

// Define the Notification component
const Notification = ({ notification }) => {
    return (
        <Card elevation={3} style={{ margin: "10px" }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {notification.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    From: {notification.fromUserId}, To: {notification.toUserId}
                </Typography>
                {notification.postId && (
                    <Typography variant="body2" color="text.secondary">
                        Post ID: {notification.postId}
                    </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                    Timestamp: {new Date(notification.timestamp).toLocaleString()}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary">
                    View
                </Button>
                <Button size="small" color="secondary">
                    Dismiss
                </Button>
            </CardActions>
        </Card>
    );
};

export default Notification;
