import { fetchAuthorizedHeaders } from './credentials'


type Config = {
  username: string
  password: string
  searchTerm: string
}

const CONFIGURATION = {
  ABC: {
    username: 'testUser@actionbehavior.com', // Replace with your central reach account username
    password: 'yourpassword', // Replace with your central reach account password
    searchTerm: 'direct%20therapy', // This filters the files based on a search term
  },
}

const main = async (config: Config) => {

  const authorizedHeaders = await fetchAuthorizedHeaders({
    username: config.username,
    password: config.password,
  })

  const fullHeaders = {
    ...authorizedHeaders,
    origin: 'https://members.centralreach.com',
    authority: 'members.centralreach.com',
    accept: '*/*',
    'accept-encoding': 'gzip',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
  }

  console.log('authorizedHeaders: ', authorizedHeaders)
  console.log('fullHeaders: ', fullHeaders)

  /**
   * Use the above headers to make all the following API requests (reference technical doc)
   * Make request to retrieve Files - https://members.centralreach.com/crxapi/resources
   * Make request to get resource ID for each File returned - https://members.centralreach.com/api/?resources.getresourceurl
   * Take result and stream file to S3 or another external database
   */

}

main(CONFIGURATION.ABC)
