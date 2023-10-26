import { HTTPRequest, Handler, launch } from 'puppeteer'

const USERNAME_SELECTOR = '#Username'
const PASSWORD_SELECTOR = '#Password'
const LOGIN_BUTTON_SELECTOR = '#login'

const LOGIN_URL = 'https://login.centralreach.com/login'
const INTERCEPT_TARGET_URL =
  'https://members.centralreach.com/api/?framework.loaduserdata'

export const fetchAuthorizedHeaders = async ({
  username,
  password,
}: {
  username: string
  password: string
}) => {
  /** This file takes care of programatically logging in and retrieving authorization headers. */

  // Launch the browser
  const browser = await launch({ headless: true, waitForInitialPage: true })

  // Open a new blank page
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto(LOGIN_URL)

  await page.waitForSelector(USERNAME_SELECTOR)

  // Type the username
  await page.type(USERNAME_SELECTOR, username)

  // Type the password
  await page.type(PASSWORD_SELECTOR, password)

  // Intercept network requests
  await page.setRequestInterception(true)

  const pHeaders = new Promise<Record<string, string>>((resolve) => {
    let interceptedHeaders: Record<string, string> | undefined

    const requestHandler: Handler<HTTPRequest> = async (interceptedRequest) => {
      if (interceptedRequest.isInterceptResolutionHandled()) {
        return
      }
      const interceptedUrl = interceptedRequest.url()
      if (interceptedUrl === INTERCEPT_TARGET_URL) {
        interceptedHeaders = interceptedRequest.headers()
        resolve(interceptedHeaders)
      } else {
        interceptedRequest.continue()
      }
    }

    // Register request handler
    page.on('request', requestHandler)
  })

  // Click the login button
  await page.click(LOGIN_BUTTON_SELECTOR)

  // Wait for the page to load
  await page.waitForNavigation()

  const interceptedHeaders = await pHeaders

  page.off('request')

  await browser.close()

  if (!interceptedHeaders) {
    throw new Error('Failed to intercept authorization headers')
  } else {
    return interceptedHeaders
  }
}
