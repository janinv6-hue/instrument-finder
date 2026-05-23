import cron from 'node-cron'

cron.schedule('*/30 * * * * *', async () => {
  console.log('Buscando instrumentos...')
})