import axios from "axios"
import { useState } from "react"

const GetMessages =  async (TOKEN, channelId) => {
    const [data, setData] = useState([])
    const [error, setError] = useState({})
    await axios.get(`https://discord.com/api/v9/channels/${channelId}/messages`, {
        headers: {
            "Authorization": TOKEN
        }
    }).then(res=> setData(res.data)).catch(err=> setError(err))
    return {
        data: data,
        error: error
    }
}

const DeleteMessages = async (data, userId, channelId, TOKEN) => {
    const [data, setData] = useState([])
    const [error, setError] = useState({})
    data.filter(message=> message.author.id== userId).forEach(message => {
        setTimeout(async () => {
            try {
                await axios.delete(`https://discord.com/api/v9/channels/${channelId}/messages/${message.id}`,{
                headers: {
                    'Authorization': TOKEN,
                    'Content-Type': 'application/json'
                    }
                }).then(res=> setData(res.data)).then(err=> setError(err))
                console.log(`${message.content} adlı mesaj başarıyla silindi.`);
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    const retryAfter = error.response.headers['retry-after']
                    console.log(`Limit aşıldı. ${retryAfter} saniye sonra yeniden..`)
                    
                    
                    setTimeout(() => {
                        DeleteMessages(data, userId, channelId, TOKEN)
                    }, retryAfter * 1000)
                } else {
                    console.error(`Başarısız silinme ${message.content}: ${error.message}`);
                }
            }
        }, index * 5000)
    })

    return {
        data: data,
        error: error
    }
}

export {
    GetMessages,
    DeleteMessages,
}