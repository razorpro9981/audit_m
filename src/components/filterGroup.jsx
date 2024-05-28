import { React, useEffect, useState } from "react";
import moment from "moment";
import { Button, Form, Input, DatePicker, Select } from "antd";
import axios from "axios";

const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterGroup = ({ onFilter }) => {
  const [form] = Form.useForm();

  const [usernames, setUsernames] = useState([]);
  const [actions, setActions] = useState([]);

  const apiKey = "a2a119cd-e932-42a6-a28a-8516e629c0dc"; // API key

  axios
    .get("http://localhost:3010/api/os_usernames", {
      headers: {
        "x-api-key": apiKey,
      },
    })
    .then((response) => {
      // console.log("Response data:", response.data);
      setUsernames(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  axios
    .get("http://localhost:3010/api/action_names", {
      headers: {
        "x-api-key": apiKey,
      },
    })
    .then((response) => {
      // console.log("Response data:", response.data);
      setActions(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  const onFinish = (values) => {
    // Format the date range values using moment
    if (values.rangePicker) {
      values.rangePicker = values.rangePicker.map((date) => {
        // console.log("Date:", date["$d"]);
        return moment(date["$d"]).format("MMMM D, YYYY h:mm A");
      });
    }

    console.log("Formatted Date Range:", values.rangePicker);

    // Pass the filter values to the parent component
    onFilter(values);
  };

  const onClear = () => {
    form.setFieldsValue({
      username: undefined,
      session: undefined,
      select: undefined,
      rangePicker: undefined,
    });
    console.log("Clear");
    // Pass empty values to clear the filters
    if (onFilter) {
      onFilter({});
    }
  };

  return (
    <Form
      layout="inline"
      form={form}
      onFinish={onFinish}
      className="flex justify-center mb-4 w-full"
    >
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
        <RangePicker />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Filter
        </Button>

        <Button
          type="primary"
          danger
          onClick={onClear}
          style={{ marginLeft: 8 }}
        >
          Clear
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FilterGroup;
