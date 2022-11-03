import { Form, Input, Button, Card, InputNumber, message } from "antd";
import { DataStore } from "aws-amplify";
import { Service } from "../../models";
import { useCompanyContext } from "../../contexts/CompanyContext";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const CreateMenuItem = () => {
  const { company } = useCompanyContext();
  const navigation = useNavigate();

  const onFinish = ({ name, description, price }) => {
    DataStore.save(
      new Service({
        name,
        description,
        price,
        companyID: company.id,
      })
    );
    message.success("Service was created");
    navigation("/menu");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card title="New Menu Item" style={{ margin: 20 }}>
      <Form
        layout="vertical"
        wrapperCol={{ span: 8 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Service Name"
          name="name"
          rules={[{ required: true }]}
          required
        >
          <Input placeholder="Enter service name" />
        </Form.Item>
        <Form.Item
          label="Service Description"
          name="description"
          rules={[{ required: true }]}
          required
        >
          <TextArea rows={4} placeholder="Enter service description" />
        </Form.Item>
        <Form.Item
          label="Price (FCFA)"
          name="price"
          rules={[{ required: true }]}
          required
        >
          <InputNumber />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateMenuItem;
