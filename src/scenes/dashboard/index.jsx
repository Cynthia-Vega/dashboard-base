import { Box } from "@mui/material";
import Header from "../../components/Header";

const Dashboard = () => {
    return (
        <Box m="30px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Wolas, bienvenido al DASH"></Header>
            </Box>
            <hr />
        </Box>
        
    );      
};

export default Dashboard;