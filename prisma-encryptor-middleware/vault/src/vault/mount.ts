import { config } from 'dotenv'

config()

process.env.DEBUG = 'node-vault' // switch on debug mode

const vault = require('node-vault')()

const createKey = () => vault.write('transit/keys/test-key')

const run = () => createKey().then(console.log)

vault
  .mounts()
  .then((result) => {
    if (result.hasOwnProperty('transit/')) {
      return run()
    }
    return vault
      .mount({
        mount_point: 'transit',
        type: 'transit',
        description: 'transit mount test',
      })
      .then(run)
  })
  .catch((err) => console.error(err.message))
