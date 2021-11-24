import {Button, Form, Input, message} from "antd";
import {changeAdminPassword} from "@/services/app/api";
import {useModel} from "@@/plugin-model/useModel";
import {useState} from "react";
import PageHeader from "@/components/PageHeader";

export default () => {
  const {initialState} = useModel('@@initialState')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [form] = Form.useForm()
  return (
    <>
      <PageHeader title={'Change Password'}/>
      <Form
        form={form}
        onFinish={(item: {password: string}) => {
          setButtonLoading(true)
          // @ts-ignore
          changeAdminPassword(initialState.currentUser.name, item.password).then(r => {
            if (r.code === 200) {
              message.success('Change successfully!')
              form.resetFields()
            } else {
              message.error(r.message)
            }
            setButtonLoading(false)
          })
        }}
      >
        <Form.Item name={'password'} label={'New Password'} rules={[{required: true}]} style={{width: '400px'}}>
          <Input type={'password'}/>
        </Form.Item>
        <Button type={'primary'} htmlType={'submit'} loading={buttonLoading}>Submit</Button>
      </Form>
    </>
  )
}
