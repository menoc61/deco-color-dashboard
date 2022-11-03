import { Card, Table, Button, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify";
import { Service } from "../../models";
import { useCompanyContext } from "../../contexts/CompanyContext";

const CompanyMenu = () => {
  const [services, setServices] = useState([]);
  const { company } = useCompanyContext();

  useEffect(() => {
    if (company?.id) {
      DataStore.query(Service, (c) => c.companyID("eq", company.id)).then(
        setServices
      );
    }
  }, [company?.id]);

  const deleteService = (service) => {
    DataStore.delete(service);
    setServices(services.filter((d) => d.id !== service.id));
  };

  const tableColumns = [
    {
      title: "Menu Item",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} FCFA`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, item) => (
        <Popconfirm
          placement="topLeft"
          title={"Are you sure you want to delete this service?"}
          onConfirm={() => deleteService(item)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Remove</Button>
        </Popconfirm>
      ),
    },
  ];

  const renderNewItemButton = () => (
    <Link to={"create"}>
      <Button type="primary">New Item</Button>
    </Link>
  );

  return (
    <Card title={"Menu"} style={{ margin: 20 }} extra={renderNewItemButton()}>
      <Table dataSource={services} columns={tableColumns} rowKey="id" />
    </Card>
  );
};

export default CompanyMenu;
