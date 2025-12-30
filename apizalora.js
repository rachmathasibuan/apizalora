import * as setting from './setting.js'
import axios from 'axios'
import crypto from 'crypto'
import path from 'path'

let accessToken = null
let tokenExpiredAt = 0

export async function setCurrentAccessToken() {
if (accessToken && tokenExpiredAt > Date.now()) {
    return accessToken
  }

  const token_url = new URL(setting.TOKEN_ENDPOINT, setting.ZALORA_URL )

  const response = await axios.post(
    token_url.href,
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: setting.CLIENT_ID,
      client_secret: setting.CLIENT_SECRET
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )

  accessToken = response.data.access_token
  tokenExpiredAt = Date.now() + (response.data.expires_in * 1000)

  // console.log('Access token baru diambil')

  return accessToken
}

// =====================================
// HELPER: UNIX TIMESTAMP (SECONDS)
// =====================================
function getTimestamp() {
  return Math.floor(Date.now() / 1000)
}

// =====================================
// HELPER: NONCE (MAX 40 CHAR)
// =====================================
function generateNonce() {
  return crypto.randomBytes(20).toString('hex') // 40 char
}

// =====================================
// HELPER: BODY HASH (SHA256)
// GET → KOSONG
// =====================================
function generateBodyHash(body) {
  if (!body) return ''
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(body))
    .digest('hex')
}

// =====================================
// HELPER: SIGNATURE (HMAC SHA256)
// application secret = client secret
// =====================================
function generateSignature(timestamp, nonce, bodyHash) {
  const stringToSign = `${timestamp}\n${nonce}\n${bodyHash}`

    try {
    const signature = crypto.createHmac('sha256', setting.CLIENT_SECRET)
   
    const signdata = signature.update(stringToSign)
    const hex = signdata.digest('hex')


   return hex 

    } catch (err) {
        throw err
    }

}


export async function apiGet(endpoint){
 
    try {

    // 3. Generate security parameter
        const timestamp = getTimestamp()
        const nonce = generateNonce()
        const bodyHash = '' // GET → kosong
        const signature = generateSignature(timestamp, nonce, bodyHash)


        // 4. Request ke API Vendor
        // console.log(endpoint)
        const response = await axios.get(
            endpoint,
            {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                'X-Timestamp': timestamp,
                'X-Nonce': nonce,
                'X-Body-Hash': bodyHash,
                'X-Signature': signature
                }
            }
        )

        return response.data
    } catch (err) {
        throw err
    }

 
    // res.json(response.data)


}

export async function apiPut(endpoint, parameter) {
  try {

    // 1. Generate security parameter
    const timestamp = getTimestamp()
    const nonce = generateNonce()
    const bodyHash = '' // GET → kosong
    const signature = generateSignature(timestamp, nonce, bodyHash)

     // 2. Request ke API Update Stock Vendor
    const response = await axios.put(endpoint, parameter, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Timestamp': timestamp,
        'X-Nonce': nonce,
        'X-Body-Hash': bodyHash,
        'X-Signature': signature
      },
      timeout: 15000
    })

    console.log('PUT API response status:', response.status)

    return response.data
  } catch (error) {
    console.error(
      'PUT API error:',
      error.response?.data || error.message
    )
    throw error
  }
}
