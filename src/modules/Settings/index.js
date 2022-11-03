import React, { useEffect, useState } from "react";
import { Form, Input, Card, Button, message } from "antd";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { DataStore } from "aws-amplify";
import { Company } from "../../models";
import { useCompanyContext } from "../../contexts/CompanyContext";

const Settings = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  const { sub, company, setCompany } = useCompanyContext();

  useEffect(() => {
    if (company) {
      setName(company.name);
      setCoordinates({ lat: company.lat, lng: company.lng });
    }
  }, [company]);

  const getAddressLatLng = async (address) => {
    setAddress(address);
    const geocodedByAddress = await geocodeByAddress(address.label);
    const latLng = await getLatLng(geocodedByAddress[0]);
    setCoordinates(latLng);
  };

  const onSubmit = async () => {
    if (!company) {
      await createNewCompany();
    } else {
      await updateCompany();
    }
  };

  const createNewCompany = async () => {
    const newCompany = await DataStore.save(
      new Company({
        name,
        image:
          "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/uber-eats/company1.jpeg",
        deliveryFee: 0,
        minDeliveryTime: 15,
        maxDeliveryTime: 120,
        address: address.label,
        lat: coordinates.lat,
        lng: coordinates.lng,
        adminSub: sub,
      })
    );
    setCompany(newCompany);
    message.success("Company has been created!");
  };

  const updateCompany = async () => {
    const updatedCompany = await DataStore.save(
      Company.copyOf(company, (updated) => {
        updated.name = name;
        if (address) {
          updated.address = address.label;
          updated.lat = coordinates.lat;
          updated.lng = coordinates.lng;
        }
      })
    );
    setCompany(updatedCompany);
    message.success("Company updated");
  };

  return (
    <Card title="Company Details" style={{ margin: 20 }}>
      <Form layout="vertical" wrapperCol={{ span: 8 }} onFinish={onSubmit}>
        <Form.Item label="Company Name" required>
          <Input
            placeholder="Enter company name here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Company Address" required>
          <GooglePlacesAutocomplete
            apiKey="AIzaSyCo88DfUDZWtQQEDaysJVz9lsPDHz-Vz2A"
            selectProps={{
              value: address,
              onChange: getAddressLatLng,
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <span>
        {coordinates?.lat} - {coordinates?.lng}
      </span>
    </Card>
  );
};

export default Settings;
