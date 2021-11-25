import {Button, Form, Input, message, Table} from "antd";
import {useEffect, useState} from "react";
import PageHeader from "@/components/PageHeader";
import {createAdmin, getAdminList} from "@/services/app/api";

export default () => {
  const [dataList, setDataList] = useState<APP.Admin[]>([])
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(0)
  const [tableLoading, setTableLoading] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)

  const [form] = Form.useForm()

  const loadData = (currentIn: number) => {
    setTableLoading(true)
    getAdminList(currentIn, 9).then(r => {
      if (r.code === 200) {
        setDataList(r.data.data)
        setTotal(r.data.total)
        setCurrent(currentIn)
      } else {
        message.error(r.message)
      }
      setTableLoading(false)
    })
  }

  useEffect(() => {
    loadData(1)
  }, [])

  const column = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    }
  ]

  return (
    <>
      <PageHeader title={'Admin Management'}/>
      <Form
        form={form}
        onFinish={(item: {username: string, password: string}) => {
          setButtonLoading(true)
          createAdmin(item.username, item.password).then(r => {
            if (r.code === 200) {
              message.success('Create successfully!')
              loadData(current)
            } else {
              message.error(r.message)
            }
            setButtonLoading(false)
          })
        }}
      >
        <Form.Item label={'Username'} name={'username'} rules={[{required: true}]} style={{width: '400px'}}>
          <Input type={'text'}/>
        </Form.Item>
        <Form.Item label={'Password'} name={'password'} rules={[{required: true}]} style={{width: '400px'}}>
          <Input type={'password'}/>
        </Form.Item>
        <Button type={'primary'} style={{width: '200px'}} htmlType={'submit'} loading={buttonLoading}>Submit</Button>
      </Form>
      <h3 style={{marginTop: '30px', marginBottom: '30px'}}>Current Admins</h3>
      <Table
        dataSource={dataList}
        columns={column}
        loading={tableLoading}
        pagination={{
          defaultCurrent: current,
          defaultPageSize: 9,
          total: total,
          showSizeChanger: false
        }}
      />
    </>
  )
}
