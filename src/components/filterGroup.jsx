import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Card, Form, Input, DatePicker, Select } from "antd";
import axios from "axios";

const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterGroup = ({ onFilter }) => {
  const [form] = Form.useForm();
  const [usernames, setUsernames] = useState([]);
  const [actions, setActions] = useState([]);

  const apiKey = "a2a119cd-e932-42a6-a28a-8516e629c0dc"; // API key

  useEffect(() => {
    // Fetch usernames and actions when component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseUsernames = await axios.get(
        "http://localhost:3010/api/os_usernames",
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );
      setUsernames(responseUsernames.data);

      const responseActions = await axios.get(
        "http://localhost:3010/api/action_names",
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );
      setActions(responseActions.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onFinish = (values) => {
    if (values.rangePicker) {
      values.rangePicker = values.rangePicker.map((date) =>
        moment(date).format("MMMM D, YYYY h:mm A")
      );
    }
    onFilter(values);
  };

  const onClear = () => {
    form.resetFields();
    onFilter({});
  };

  return (
    <Card
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: "100%", // Fill the width of its container
      }}
    >
      <Form layout="inline" form={form} onFinish={onFinish}>
        <Form.Item label="Username" name="username">
          <Select
            placeholder="Select username"
            style={{ width: "150px" }}
            allowClear
          >
            {usernames.map((usernameObject) => (
              <Option
                key={usernameObject.OS_USERNAME}
                value={usernameObject.OS_USERNAME}
              >
                {usernameObject.OS_USERNAME}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Select" name="select">
          <Select
            placeholder="Select action"
            style={{ width: "180px" }}
            allowClear
          >
            {actions.map((actionObject) => (
              <Option
                key={actionObject.ACTION_NAME}
                value={actionObject.ACTION_NAME}
              >
                {actionObject.ACTION_NAME}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Range Picker" name="rangePicker">
          <RangePicker style={{ width: "250px" }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff", marginRight: "100px" }}
          >
            Filter
          </Button>
          <Button
            type="default"
            onClick={onClear}
            style={{
              marginLeft: 8,
              backgroundColor: "#f5222d",
              borderColor: "#f5222d",
              color: "white",
            }}
          >
            Clear
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FilterGroup;
