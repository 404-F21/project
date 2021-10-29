import React,{useState} from 'react'
import { TextareaItem,Toast } from 'antd-mobile';
import './index.css'
const DialogueFooter = () => {
    const [textValue,setTextValue] = useState('');
    const send = ()=>{
        if(!textValue){
            Toast.info('input comment', 3);
            return;
        }
    }
    return (
        <div className='dialogueFooter'>
             <TextareaItem
                autoHeight
                count={50}
                value={textValue}
                onChange={val=>setTextValue(val)}
                placeholder='Add a comment'
                labelNumber={5}
            />
            <div className='btns'>
                <span onClick={send}>Apply</span>
            </div>
        </div>
    )
}

export default DialogueFooter
