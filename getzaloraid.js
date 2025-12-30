import { apiGet } from "./apizalora.js"
import * as setting from './setting.js'
import { getConnection } from './conn.js'
import path from 'path'

export async function getZaloraId(heinvitem_id){
    // cek di table, apakah sudah ada zalora_sku,

    let zalora_sku = null

    // jika belum ada, fetch api zalora, untuk mendapatkan zalora_sku
    if (zalora_sku==null) {
        const product_url = `${setting.ZALORA_URL}/${setting.PRODUCT_ENPONT}/${heinvitem_id}`
        let db
        try {
            
            let result = await apiGet(product_url)
            if (result==null) {
                throw new Error(`product ${heinvitem_id} tidak ditemukan`)
            }
            let zalora_sku = result.id
            // update zalora_sku di tabel untuk heinvitem_id
            db = await getConnection()
            let [rows] = await db.query(`UPDATE zalora_stok
                            SET zalora_id = '${zalora_sku}' WHERE heinvitem_id = '${heinvitem_id}'`)
            
            // console.log(zalora_sku)
            // console.log('Data zalora id berhasil di update')
        } catch (err) {
            throw err
        }finally {
        if (db) await db.end()
        }
        }

   
}