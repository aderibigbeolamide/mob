"use client";
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Switch, Row, Col } from "antd";
import { createBranch, updateBranch } from "@/lib/services/branches";
import { Branch } from "@/types/emr";

const { Option } = Select;

interface BranchModalProps {
  visible: boolean;
  branch: Branch | null;
  onClose: (shouldRefresh?: boolean) => void;
}

const BranchModal: React.FC<BranchModalProps> = ({ visible, branch, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && branch) {
      form.setFieldsValue({
        name: branch.name,
        code: branch.code,
        address: branch.address,
        city: branch.city,
        state: branch.state,
        country: branch.country,
        phone: branch.phone,
        email: branch.email,
        manager: branch.manager ? (typeof branch.manager === 'object' ? branch.manager._id : branch.manager) : undefined,
        isActive: branch.isActive,
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({ isActive: true, country: 'Nigeria' });
    }
  }, [visible, branch, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const branchData = {
        name: values.name,
        code: values.code.toUpperCase(),
        address: values.address,
        city: values.city,
        state: values.state,
        country: values.country || 'Nigeria',
        phone: values.phone,
        email: values.email,
        manager: values.manager || undefined,
        isActive: values.isActive !== undefined ? values.isActive : true,
      };

      if (branch?._id) {
        await updateBranch(branch._id, branchData);
      } else {
        await createBranch(branchData);
      }

      form.resetFields();
      onClose(true);
    } catch (error) {
      console.error("Failed to save branch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose(false);
  };

  return (
    <Modal
      title={branch ? "Edit Branch" : "Add New Branch"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={800}
      okText={branch ? "Update" : "Create"}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ isActive: true, country: 'Nigeria' }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Branch Name"
              name="name"
              rules={[{ required: true, message: "Please enter branch name" }]}
            >
              <Input placeholder="e.g., Main Branch" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Branch Code"
              name="code"
              rules={[
                { required: true, message: "Please enter branch code" },
                { 
                  pattern: /^[A-Z0-9]+$/, 
                  message: "Code must be uppercase letters and numbers only" 
                }
              ]}
            >
              <Input 
                placeholder="e.g., MN001" 
                onChange={(e) => {
                  form.setFieldsValue({ code: e.target.value.toUpperCase() });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input.TextArea rows={2} placeholder="Street address" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please enter city" }]}
            >
              <Input placeholder="e.g., Lagos" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true, message: "Please enter state" }]}
            >
              <Input placeholder="e.g., Lagos State" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: "Please enter country" }]}
            >
              <Input placeholder="e.g., Nigeria" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Please enter phone number" },
                { 
                  pattern: /^[0-9+\-\s()]+$/, 
                  message: "Please enter a valid phone number" 
                }
              ]}
            >
              <Input placeholder="e.g., +234 123 456 7890" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" }
              ]}
            >
              <Input placeholder="e.g., branch@hospital.com" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Manager"
          name="manager"
          extra="Optional: Assign a staff member as branch manager"
        >
          <Select 
            placeholder="Select branch manager (optional)" 
            allowClear
            showSearch
            filterOption={false}
          >
            <Option value="">None</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Active Status"
          name="isActive"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Active" 
            unCheckedChildren="Inactive" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BranchModal;
