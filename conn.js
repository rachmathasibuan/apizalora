import mysql from 'mysql2/promise'

import * as setting from './setting.js'

export async function getConnection() {
  try {
    const connection = await mysql.createConnection({
      ...setting.dbConfig
    })
    return connection
  } catch (error) {
    console.error('Koneksi MySQL gagal:', error)
    throw error
  }
}
