export const loginAction = (userinfo)=>{
    return (dispatch)=>{
        dispatch({type:'loginSuccess',payload:userinfo});
        // fetch('http://39.96.84.223:4567/verify/adminlogin',{
        //     method:'post',
        //     body:JSON.stringify(username)
        // })
        //     .then(res=>res.json())
        //     .then(res=>{
        //         dispatch({type:'loginSuccess',value:true});
        //     })
    }
};
