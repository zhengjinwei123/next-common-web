import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button, Space, Select, message, Badge,Modal } from 'antd';
import React, { useState, useEffect } from 'react';
const { Option } = Select;

import LocalReq from "../lib/local_req"
import utils from "../lib/utils"


const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 8,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    user_groups,
    onUserGroupChange,
    children,
    ...restProps
  }) => {
    let inputNode = null;
    if (inputType === "number") {
        inputNode = <InputNumber />
    } else if (inputType === "text") {
        inputNode = <Input />
    } else if (inputType === "select") {
        inputNode = <Select onChange={onUserGroupChange}>
            {
                user_groups.map((item, idx) => {
                    let desc = item.group_id + "(" + item.group_name + ")"
                    return (
                        <Option key={idx} value={desc}>{desc}</Option>
                    )
                })
            }
        </Select>
    }

    // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
};

const EditableTable = ({user_groups}) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userid, setUserid] = useState(0)

    const [updatePasswordForm] = Form.useForm();

    const isEditing = (record) => record.key === editingKey;


    const getUserList = () => {
        LocalReq.Post("/user/list", {}, (err, data) => {
            if (!err) {
               
                let tmp = [];
                for (let i = 0; i < data.length; i++) {
                    let obj = data[i]
                    obj.key = obj.id;
                    obj.status = obj.status == 0 ? "正常" : "封禁中"
                    obj.group = obj.group_id + "(" + obj.group_name + ")"
                    tmp.push(obj)
                }
                setData([...tmp]) 
            }
        })
    }

    useEffect(() => {
        getUserList()
    }, [])

    const onUserGroupChange = (value, option) => {
       
    }

    const banUser = (id, status) => {
        LocalReq.Post("/user/ban", {id, type: status === "正常" ? 0 : 1}, (err, data) => {
            if (!err) {
                getUserList()
            }
        }, true)
    }

    const edit = (record) => {
      form.setFieldsValue({
        id: '',
        user_name: '',
        email: '',
        status: '',
        group_id: '',
        group_name: '',
        group: '',
        ...record,
      });
      setEditingKey(record.key);
    };
  
    const cancel = () => {
      setEditingKey('');
    };

    const showUpdatePasswordModal = (show, id) => {
        setIsModalVisible(show);
        updatePasswordForm.resetFields();
        setUserid(id)
    }

    const onUpdatePasswordModalFinish = (values) => {
        LocalReq.Post("/user/update_password", {id: userid, password: utils.md5Sum(values.password)}, (err, data) => {
            if (err) {
                message.error(err)
            } else {
                message.success("success")
                setIsModalVisible(false);
            }
        })
    }
  
    const save = async (key) => {
      try {
        const row = await form.validateFields();
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);
  

        let group_id = 0;
        for (let i = 0; i < user_groups.length; i++) {
            let desc = user_groups[i].group_id + "(" + user_groups[i].group_name + ")"

            if (row.group == desc) {
                group_id = user_groups[i].group_id;
                break;
            }
        }

        if (group_id == 0) {
            return;
        }

        LocalReq.Post("/user/update_email_and_group", {
            id: key,
            email: row.email,
            group_id: group_id
        }, (err, data) => {

            if (!err) {
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, { ...item, ...row });
                    setData(newData);
                    setEditingKey('');
                } else {
                    newData.push(row);
                    setData(newData);
                    setEditingKey('');
                }
            } else {
                message.error(err)
            }
        })

      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    };

    const columns = [
        {
          title: 'id',
          dataIndex: 'id',
          width: '5%',
          editable: false,
        },
        {
          title: 'user_name',
          dataIndex: 'user_name',
          width: '10%',
          editable: false,
        },
        {
          title: 'email',
          dataIndex: 'email',
          width: '20%',
          editable: true,
        },
        {
            title: 'status',
            dataIndex: 'status',
            width: '10%',
            editable: false,
            render: (_, record) => (
                <span>
                  <Badge status={record.status == "正常" ? "success" : "warning"} />
                  {record.status}
                </span>
            ),
        },
        {
            title: 'group',
            dataIndex: 'group',
            width: '10%',
            editable: true,
        },
        {
          title: 'operation',
          dataIndex: 'operation',
          render: (_, record) => {
            const editable = isEditing(record);
            return editable ? (
              <span>
                <a
                  href="#"
                  onClick={() => save(record.key)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  Save
                </a>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
                <Space>
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        编辑
                    </Typography.Link>
                    <Button onClick={() => showUpdatePasswordModal(true, record.key)}>修改密码</Button>
                    {
                        record.user_name != "admin" ? (
                            <Button type="primary" danger={record.status == '正常' ? true : false } onClick={ () => banUser(record.key, record.status)}>
                            {record.status == '正常' ? "封禁" : "解封"}
                            </Button>
                        ) : null
                    }
                 
                </Space>
            );
          },
        },
      ];
      const mergedColumns = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
    
        return {
          ...col,
          onCell: (record) => ({
            record,
            inputType: col.dataIndex === 'group' ? 'select' : "text",
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
            user_groups:  col.dataIndex === 'group' ? user_groups : [],
            onUserGroupChange
          }),
        };
      });

      return (
          <div>
            <Form form={form} component={false}>
                <Table
                    components={{
                    body: {
                        cell: EditableCell,
                    },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                    onChange: cancel,
                    }}
                />
            </Form>
            <Modal  footer={null} maskClosable={false} title="Update Password" visible={isModalVisible}  onCancel={() => showUpdatePasswordModal(false)}>
                <Form
                    {...layout}
                    name="update_password_dialog"
                    onFinish={onUpdatePasswordModalFinish}
                    form={updatePasswordForm}
                    >

                    <Form.Item label="Password"
                        name="password" rules={[
                            {
                              required: true,
                              message: 'Please input your password!',
                            },
                          ]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item label="Password Again"
                        name="password_again" rules={[
                            {
                              required: true,
                              message: 'Please input your password again!',
                            },
                          ]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                        Submit
                        </Button>
                    </Form.Item>

                </Form>
            </Modal>
          </div>
        
      );
};

export default EditableTable