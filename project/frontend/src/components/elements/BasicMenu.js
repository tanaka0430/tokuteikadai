import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

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

  const handleClickLogin = () => {
    navigate("/login");
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
        <MenuItem onClick={handleClickLogin}>ログアウト</MenuItem>
      </Menu>
    </div>
  );
}
