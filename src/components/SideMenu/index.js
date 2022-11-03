import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useCompanyContext } from "../../contexts/CompanyContext";

const SideMenu = () => {
  const navigate = useNavigate();
  const { company } = useCompanyContext();

  const onClick = async (menuItem) => {
    if (menuItem.key === "signOut") {
      await Auth.signOut();

      window.location.reload();
    } else {
      navigate(menuItem.key);
    }
  };

  const mainMenuItems = [
    {
      key: "/",
      label: "Orders",
    },
    {
      key: "menu",
      label: "Menu",
    },
    {
      key: "order-history",
      label: "Order History",
    },
  ];

  const menuItems = [
    ...(company ? mainMenuItems : []),
    {
      key: "settings",
      label: "Settings",
    },
    {
      key: "signOut",
      label: "Sign out",
      danger: "true",
    },
  ];

  return (
    <>
      {company && <h4>{company.name}</h4>}
      <Menu items={menuItems} onClick={onClick} />
    </>
  );
};

export default SideMenu;
