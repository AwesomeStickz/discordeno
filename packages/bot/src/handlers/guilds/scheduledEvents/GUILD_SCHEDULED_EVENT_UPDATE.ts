import type { DiscordGatewayPayload, DiscordScheduledEvent } from '@discordeno/types'
import type { Bot } from '../../../bot.js'

export function handleGuildScheduledEventUpdate(bot: Bot, data: DiscordGatewayPayload) {
  const payload = data.d as DiscordScheduledEvent
  bot.events.scheduledEventUpdate?.(bot.transformers.scheduledEvent(bot, payload))
}
