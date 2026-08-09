import { initBotId } from 'botid/client/core'

/**
 * Registers the paths that BotID protects. Every entry here must have a
 * matching `checkBotId()` call in its route handler, otherwise the client
 * does the work and the server never reads the verdict.
 */
initBotId({
  protect: [
    {
      path: '/api/submit',
      method: 'POST',
    },
  ],
})
