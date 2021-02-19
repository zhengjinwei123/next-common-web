import { Table, PageHeader,  Button, Descriptions, DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;
import {ShowAlertModal, ShowConfirmDialog} from "../components/AlertModal"

import {useState, useEffect} from "react"

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
];



export default () => {

    const [index, setIndex] = useState(0);
    const [data, setData] = useState([])


    const onSearch = () => {
        ShowAlertModal("haha", function(isok, onComplete) {
            alert("isok"+isok)
            onComplete()
        });
    }

    const onAdd = () => {

        const tempData = data
        console.log("add", index, data)
        tempData.push({
            key: index,
            name: `zjw ${index}`,
            age: index,
            address: `China, Shanghai. ${index}`,
        });

        setIndex(index+1)
        setData([...tempData])
    }


    return (
        <div>
            <div>
                <PageHeader
                    style={{marginBottom: '10px'}}
                    ghost={false}
                    onBack={() => window.history.back()}
                    title="入口管理"
                    subTitle=""
                    extra={[
                        <RangePicker  key="1"/>,
                        <Button key="2" type="primary" onClick={onSearch}>查询</Button>,
                        <Button key="3" type="primary" onClick={onAdd}>添加</Button>,
                    ]}
                >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                    <Descriptions.Item label="Association">
                    <a>421421</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
                    <Descriptions.Item label="Effective Time">2017-10-10</Descriptions.Item>
                    <Descriptions.Item label="Remarks">
                    Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
                    </Descriptions.Item>
                </Descriptions>
                </PageHeader>
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    )
}