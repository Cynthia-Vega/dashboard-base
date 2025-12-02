import { Box, Icon, IconButton, useTheme } from "@mui/material"

import { tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
    const navigate = useNavigate();
    const colors = tokens();


    return <Box display="flex" justifyContent="space-between" p={2}>
        {/* SEARCH BAR */}
        <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
        >
            <InputBase sx={{ ml: 2, flex: 1}} placeholder="Search" />
            <IconButton type="button" sx={{ p: 1}}>
                <SearchIcon />
            </IconButton>
        </Box>
        {/* ICONS */}
        <Box display="flex">
            <IconButton>
                <NotificationsOutlinedIcon/>
            </IconButton>
            <IconButton onClick={() => navigate("/config")}>
                <SettingsOutlinedIcon/>
            </IconButton>
            <IconButton onClick={() => navigate("/user")}>
                <PersonOutlinedIcon/>
            </IconButton>
        </Box>
    </Box>;
};

export default Topbar;