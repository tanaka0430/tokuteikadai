import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const Logout = useLogout();

  // メニューを開く
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // メニューを閉じる
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 各メニュー項目のクリック処理
  const handleClickHome = () => {
    navigate("/");
    handleClose();
  };

  const handleClickChat = () => {
    navigate("/chat");
    handleClose();
  };

  const handleClickLogout = () => {
    Logout();
    handleClose();
  };

  const handleClickTop = () => {
    navigate("/timetable");
    handleClose();
  };

  const handleClickSearch = () => {
    navigate("/search");
    handleClose();
  };

  return (
    <div>
      {/* アイコンボタンに変更 */}
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
        edge="start"
      >
        <MenuIcon />
      </IconButton>
      
      {/* ドロップダウンメニュー */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClickHome}>ホーム</MenuItem>
        <MenuItem onClick={handleClickTop}>時間割</MenuItem>
        <MenuItem onClick={handleClickSearch}>講義検索</MenuItem>
        <MenuItem onClick={handleClickChat}>チャット検索</MenuItem>
        <MenuItem onClick={handleClickLogout}>ログアウト</MenuItem>
      </Menu>
    </div>
  );
}
