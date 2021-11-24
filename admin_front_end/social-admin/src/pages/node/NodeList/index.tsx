import {useEffect, useState} from "react";
import {createNode, deleteNode, getNodeList, setNodeApproved} from "@/services/app/api";
import {Button, Form, Input, message, Modal, Space, Table} from "antd";
import PageHeader from "@/components/PageHeader";
import moment from "moment";
import {DeleteOutlined} from "@ant-design/icons";


export default () => {
  const [nodeList, setNodeList] = useState<APP.Node[]>([])
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(0)
  const [nodeMap, setNodeMap] = useState<Map<string, APP.Node>>(new Map())
  const [listLoading, setListLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [createButtonLoading, setCreateButtonLoading] = useState(false)

  /**
   * Load data
   * @param currentIn current page number
   */
  const loadData = (currentIn: number) => {
    setListLoading(true)
    getNodeList(currentIn, 9, 'SHARE').then(r => {
      if (r.code === 200) {
        const map = new Map<string, APP.Node>()
        const buttonMap = new Map<string, boolean>()
        r.data.data.forEach(item => {
          map.set(item.id, item)
          buttonMap.set(item.id, false)
        })
        setNodeMap(map)
        setNodeList(r.data.data)
        setCurrent(currentIn)
        setTotal(r.data.total)
      } else {
        message.error(r.message)
      }
      setListLoading(false)
    })
  }

  useEffect(() => {
    loadData(1)
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host'
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: number) => {
        return moment(time * 1000).format()
      }
    },
    {
      title: 'If Approved',
      dataIndex: 'ifApproved',
      key: 'ifApproved',
      render: (ifApproved: boolean) => {
        return ifApproved ? 'Approved' : 'Forbidden'
      }
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      render: (id: string) => {
        const changeApproved = () => {
          setListLoading(true)
          // @ts-ignore
          setNodeApproved(id, !nodeMap.get(id).ifApproved).then(r => {
            if (r.code === 200) {
              message.success('Change successfully!')
              loadData(current)
            } else {
              message.error(r.message)
            }
            setListLoading(false)
          })
        }
        const deleteNodeClick = () => {
          setListLoading(true)
          deleteNode(id).then(r => {
            if (r.code === 200) {
              message.success('Delete successfully!')
              loadData(current)
            } else {
              message.error(r.message)
            }
            setListLoading(false)
          })
        }
        const ifApproved = nodeMap.get(id)?.ifApproved
        if (!nodeMap.get(id)) {
          return <></>
        }
        // @ts-ignore
        return (
          <Space>
            {
              ifApproved ?
                <Button type={'default'} onClick={changeApproved} danger>Forbid</Button>
                :
                <Button type={'default'} onClick={changeApproved}>Permit</Button>
            }
            <Button type={'primary'} onClick={deleteNodeClick} danger><DeleteOutlined/></Button>
          </Space>
        )
      }
    }
  ]

  const [form] = Form.useForm()

  return (
    <>
      <PageHeader title={'Share Node List'}/>
      <Button
        type={'primary'}
        onClick={() => {
          setShowModal(true)
        }}
        style={{width: '150px', marginBottom: '20px'}}>
        Create Node
      </Button>
      <Table
        dataSource={nodeList}
        columns={columns}
        loading={listLoading}
        pagination={{
          defaultPageSize: 9,
          defaultCurrent: current,
          total: total,
          showSizeChanger: false,
          onChange: (currentIn: number) => {
            loadData(currentIn)
          }
        }}/>
      <Modal
        title={'Create New Share Node'}
        visible={showModal}
        okButtonProps={{
          loading: createButtonLoading
        }}
        onOk={() => {
          form.submit()
        }}
        onCancel={() => {
          setShowModal(false)
        }}
      >
        <Form
          form={form}
          onFinish={(item: { host: string, password: string}) => {
            setCreateButtonLoading(true)
            createNode(item.host, item.password, 'SHARE', '').then(r => {
              if (r.code === 200) {
                message.success('Create successfully!')
                setShowModal(false)
                form.resetFields()
                loadData(current)
              } else {
                message.error(r.message)
              }
              setCreateButtonLoading(false)
            })
          }}
        >
          <Form.Item label={'Host Address'} name={'host'} rules={[{required: true}]}>
            <Input type={'text'}/>
          </Form.Item>
          <Form.Item label={'Access Password'} name={'password'} rules={[{required: true}]}>
            <Input type={'password'}/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
