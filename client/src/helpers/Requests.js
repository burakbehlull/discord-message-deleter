import axios from "axios"

const GetMessages =  async (TOKEN, channelId) => {
    const res = await axios.get(`https://discord.com/api/v9/channels/${channelId}/messages`, {
        headers: {
            "Authorization": TOKEN
        }
    })
    console.log(1)
    return {
        data: res.data,
        error: res.error
    }
}

const DeleteMessages = async (data, userId, channelId, TOKEN) => {
    data.filter(message=> message.author.id== userId).forEach((message, i) => {
        setTimeout(async () => {
            try {
                await axios.delete(`https://discord.com/api/v9/channels/${channelId}/messages/${message.id}`,{
                headers: {
                    'Authorization': TOKEN,
                    'Content-Type': 'application/json'
                    }
                })
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
        }, i * 5000)
    })

    return;
}

export {
    GetMessages,
    DeleteMessages,
}