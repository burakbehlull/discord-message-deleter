import { useState } from 'react'
import { DeleteMessages, GetMessages } from '../helpers/Requests'
export default function Home(){
    const [values, setValues] = useState({token: '', userId: '', channelId: ''})
    const [data, setData] = useState([])
    const [error, setError] = useState({})

    function handleChange(e){
        setValues({...values, [e.target.name]: e.target.value})
    }

    function handleGetMessagesClick(){
        GetMessages(values.token, values.channelId)
        .then(res=> {
            console.log(res.data)
            setData(res.data)
        })
        .catch(err=> setError(err))
    }
    function handleDeleteMessagesClcik(){
        DeleteMessages(data, values.userId, values.channelId, values.token)
    }

    return (
        <>
        
            HOME

            <input type="text" name='token' value={values.token} onChange={handleChange} placeholder='discord account token here..'/>
            <input type="text" name='userId' value={values.userId} onChange={handleChange} placeholder='your user id here..'/>
            <input type="text" name='channelId' value={values.channelId} onChange={handleChange} placeholder='your channel id here..'/>
            <button onClick={handleDeleteMessagesClcik}>Delete Messages</button>
            <button onClick={handleGetMessagesClick}>Get Messages</button>

            <ul>
                {data.filter((message)=> message.author.id == values.userId)?.map((message, key)=><li key={key}>
                    {message.content} - {message.id}
                </li>)}
            </ul>
        </>
    )
}