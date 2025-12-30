console.log("Update Stok Zalora")
import {setPreviousStok} from './setprevstok.js'
import { updateStokFromKalista } from './updatestokfromkalista.js'
import {getQueueItems} from './getqueueitems.js'
import sleep from './sleep.js'
import { getZaloraId } from './getzaloraid.js'
import { updateStok } from './updatestok.js' 
import { setCurrentAccessToken} from './apizalora.js'
import cron from 'node-cron'

// jadwal cron
//                     ┌────────── minute (0 - 59)
//                     │  ┌─────── hour (0 - 23)
//                     │  │ ┌───── day of month
//                     │  │ │ ┌─── month
//                     │  │ │ │ ┌─ day of week
//                     │  │ │ │ │
//                     │  │ │ │ │
//                     *  * * * *	
const CRON_SCHEDULE = '0 8 * * *'   // setiap jam 08:00



main()


async function main() {

    const task = cron.schedule(CRON_SCHEDULE, async () => {
		     await updateZaloraStock()
        }, 
        {
            timezone: 'Asia/Jakarta'
        }
    );
			
	task.start();
}



async function updateZaloraStock() {
    try {

        await setCurrentAccessToken()
        await setPreviousStok() 
        await updateStokFromKalista()
        let items =await getQueueItems()

        for (let heinvitem_id of items) {
            // console.log(heinvitem_id)
            await sleep (250)

            await getZaloraId(heinvitem_id)
            await updateStok(heinvitem_id)
        }
    } catch (error) {
        console.error(error.message)
    }

}


