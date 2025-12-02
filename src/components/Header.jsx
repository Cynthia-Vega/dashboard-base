import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"   
    >
    <Box>
      <Typography
        variant="h2"
        color={colors.primary[100]}
        fontWeight="bold"
        sx={{ m: 0 }}
      >
        {title}
      </Typography>

      <Typography
        variant="h5"
        color={colors.green[200]}
        sx={{ m: 0 }}
      >
        {subtitle}
      </Typography>
    </Box>

    
    <img
      alt="logo"
      src="/assets/logo.png"
      width="120"
      height="120"
      style={{marginRight: "50px"}}
    />
  </Box>

  <hr />
</Box>
  );
};

export default Header;