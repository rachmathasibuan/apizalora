import { getConnection } from './conn.js'

export async function getQueueItems(){
    console.log('get Queue Items')
    let db
    try {
    db = await getConnection()

    let [rows] = await db.query(
      'SELECT * FROM zalora_stok'
    )
    
    // const result = rows.map(r => r.heinvitem_id)
    let result = rows.map(row => row.heinvitem_id)

    return result 
    // return rows.map(row => row.heinvitem_id) //  ⬅️ KEMBALIKAN DATA
    
     } catch (error) {
    console.error('Gagal ambil Data Queue:', error)
    throw error   // ⬅️ lempar ke pemanggil
    }finally {
    if (db) await db.end()   // ⬅️ WAJIB
    }

    // let result = [
    //     'TM20120007201',
    //     'TM25020002309',
    //     'TM25020002310'
    // ]

    // return result
    
}