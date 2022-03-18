import fs from 'fs'
import Vault from 'node-vault'
import path from 'path'

const vault = Vault()

vault
  .initialized()
  .then(() => {
    return vault.init({ secret_shares: 1, secret_threshold: 1 })
  })
  .then((result) => {
    fs.writeFileSync(path.join(__dirname, '../../.env'), `VAULT_TOKEN=${result.root_token}`)
    vault.token = result.root_token
    const key = result.keys[0]
    return vault.unseal({ secret_shares: 1, key })
  })
  .catch((err) => console.error(err.message))
