import React from "react";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import BadgeIcon from '@mui/icons-material/Badge';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import StoreSharpIcon from '@mui/icons-material/StoreSharp';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Menubar = ({ IconComponent }: { IconComponent: React.ElementType }) => {
  return (
    <IconComponent style={{ color: 'white', fontSize: '40px' }} />
  );
};
const Header = ({ IconComponent }: { IconComponent: React.ElementType }) => {
  return (
    <IconComponent style={{ color: 'white', fontSize: '40px' }} />
  );
}
const Setting = ({ IconComponent }: { IconComponent: React.ElementType }) => {
  return (
    <IconComponent style={{ color: 'black', fontSize: '40px' }} />
  );
}
const Small = ({ IconComponent }: { IconComponent: React.ElementType }) => {
  return (
    <IconComponent style={{ color: 'black', fontSize: '20px' }} />
  );
}
const Icons = ({ IconComponent }: { IconComponent: React.ElementType }) => {
  return (
    <IconComponent style={{ color: 'black', fontSize: '20px' }} />
  );
}

const iconMap = {
  home: () => <Menubar IconComponent={HomeRoundedIcon} />,
  Inventory: () => <Menubar IconComponent={Inventory2Icon} />,
  products: () => <Menubar IconComponent={LocalMallRoundedIcon} />,
  settings: () => <Menubar IconComponent={SettingsRoundedIcon} />,
  logout: () => <Menubar IconComponent={LogoutRoundedIcon} />,
  wallet: () => <Menubar IconComponent={AccountBalanceWalletRoundedIcon} />,
  menu: () => <Menubar IconComponent={MenuTwoToneIcon} />,
  profile: () => <Header IconComponent={AccountCircleIcon} />,
  customer: () => <Setting IconComponent={SupervisorAccountIcon} />,
  category: () => <Setting IconComponent={CategoryIcon} />,
  product: () => <Setting IconComponent={Inventory2Icon} />,
  employee: () => <Setting IconComponent={BadgeIcon} />,
  SharpIcon: () => <Setting IconComponent={StoreSharpIcon} />,
  addIcon: ()=> <Menubar IconComponent={AddIcon} />,
  close : ()=> <Small IconComponent={CloseIcon} />,
  open : ()=>  <Menubar IconComponent={KeyboardDoubleArrowDownIcon}/>,
  Edit:()=><Menubar IconComponent={EditIcon}/>,
  Delete:()=><Menubar IconComponent={DeleteIcon}/>,
  Editicon:()=><Icons IconComponent={EditIcon} />,
  Deleteicon:()=><Icons IconComponent={DeleteIcon} />,
};

export default iconMap;