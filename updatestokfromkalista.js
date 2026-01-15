import { getConnection } from './conn.js'

export async function updateStokFromKalista() {
  // console.log('get Data Kalista')
  let db
  try {
    db = await getConnection()

    // await db.query(`UPDATE zalora_stok SET prev_stok = curr_stok`)
    await db.query(`
    UPDATE zalora_stok a
    LEFT JOIN (
        SELECT 
        a.heinvitem_id,
        SUM(a.total_qty) AS total_stok
        FROM tmp_invitemposition a
        WHERE a.region_id IN ('02600','00900','03400')
        AND a.branch_id IN ('0001904','0000700','0006920','0006930','0006940')
        GROUP BY a.heinvitem_id
    ) b ON a.heinvitem_id = b.heinvitem_id
    SET a.curr_stok = COALESCE(b.total_stok, 0)`)

    console.log('Current Stok berhasil diupdate dari Kalista')

  } catch (err) {
    throw err
  } finally {
    if (db) await db.end()
  }
}