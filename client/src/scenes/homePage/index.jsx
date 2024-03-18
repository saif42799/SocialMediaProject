import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";

const HomePage = () => {
    const isNonMobleScreens = useMediaQuery("(min-width:1000px)");
    const {_id, picturePath} = useSelector((state) => state.user);
    return (
        <Box>
            <Navbar></Navbar>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobleScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobleScreens ? "26%" : undefined}>
                    <UserWidget userId={_id} picturePath={picturePath}></UserWidget>
                </Box>
                <Box
                    flexBasis={isNonMobleScreens ? "42%" : undefined}
                    mt={isNonMobleScreens ? undefined : "2rem"}
                ></Box>
                {isNonMobleScreens && <Box flexBasis="26%"></Box>}
            </Box>
        </Box>
    );
};

export default HomePage;