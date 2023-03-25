import axios from 'axios';
import { REFRESH_TOKEN_API } from '@/config/api';
import redis from '@/lib/redis';

export default async function handler(req, res) {
  const { method, headers, body } = req;
  try {
    const accessToken = await redis.get('accessToken');
    if (!accessToken) {
      const { data, headers: returnedHeaders } = await axios.post(REFRESH_TOKEN_API, body, { headers });
      if (data.statusCode ==200){
        //redis.set('accessToken',data.accessToken,'EX',300);
        redis.set('accessToken',data.accessToken);
      }
      res.json(data);
    } else {
      res.json({status: 'accessToken is still valid'});
    }
  } catch (e) {
    console.log(e)
  }
}