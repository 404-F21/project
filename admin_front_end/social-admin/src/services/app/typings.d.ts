declare namespace APP {
  type Result<T> = {
    code: number,
    message: string,
    data: T,
    time: number
  }

  type Admin = {
    id: number,
    username: string
  }

  type Node ={
    id: string,
    host: string,
    createTime: number,
    ifApproved: boolean
  }
}
