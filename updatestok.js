import { getConnection } from './conn.js'
import { apiPut } from './apizalora.js'
import * as setting from './setting.js'

export async function updateStok(heinvitem_id){
    // console.log(`update zalora ${heinvitem_id}`)

    // query table, akan mendapatkan
    // zalora_sku, current_stok, dan previous_stok
  let db
  try {
    console.log(`\nUpdate stok untuk item: ${heinvitem_id}`)

    db = await getConnection()

    // Ambil data stok , Jika max_stok < curr_stok ambil max_stok,
    // Jika max_stok NULL ambil curr_stok
    const [rows] = await db.query(
      `SELECT 
          zalora_id,
          prev_stok,
          curr_stok,
          max_stok,
          CASE
            WHEN max_stok IS NULL THEN curr_stok
            WHEN max_stok < curr_stok THEN max_stok
            ELSE curr_stok
          END AS qty_update
      FROM zalora_stok
      WHERE heinvitem_id = ?`,
      [heinvitem_id]
    )


    if (rows.length === 0) {
      console.log('Data tidak ditemukan, skip')
      return
    }

    // const { zalora_id, curr_stok, prev_stok } = rows[0]
    const { zalora_id, curr_stok, prev_stok, max_stok, qty_update } = rows[0]

    // console.log(`ZaloraID: ${zalora_id} | prev: ${prev_stok} → curr: ${curr_stok}`)
    console.log(`ZaloraID: ${zalora_id} | prev: ${prev_stok} → curr: ${curr_stok} | max: ${max_stok} | update: ${qty_update}`)

    // Skip jika stok sama
    if (qty_update === prev_stok) {
      console.log('Stok sama, tidak update')
      return
    }

    // Request body API Zalora
    const body = [
      {
        productId: zalora_id,
        quantity: qty_update
      }
    ]

    console.log('Kirim update ke Zalora:', body)

    // Call API
    const product_url = `${setting.ZALORA_URL}/${setting.PRODUCT_UPDATE}`
    const response = await apiPut(product_url,body)

    console.log('✅ Update Zalora sukses:', response)

  } catch (error) {
    console.error(
      'Gagal update stok:',
      error.response?.data || error.message
    )
    throw error
  } finally {
    if (db) await db.end()
  }

}
