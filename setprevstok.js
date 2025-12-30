import { getConnection } from './conn.js'

export async function setPreviousStok() {
  // console.log('setPrevious stok')

  let db
  try {
    db = await getConnection()

    await db.query(`UPDATE zalora_stok SET prev_stok = curr_stok`)

    console.log('Previous stok berhasil diupdate')

  } catch (err) {
    throw err
  } finally {
    if (db) await db.end()
  }
}
