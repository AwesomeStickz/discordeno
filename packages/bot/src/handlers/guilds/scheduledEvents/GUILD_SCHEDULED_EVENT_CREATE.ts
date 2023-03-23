import type { DiscordGatewayPayload, DiscordScheduledEvent } from '@discordeno/types'
import type { Bot } from '../../../bot.js'

export function handleGuildScheduledEventCreate(bot: Bot, data: DiscordGatewayPayload, shardId: number) {
  const payload = data.d as DiscordScheduledEvent
  bot.events.scheduledEventCreate?.(bot.transformers.scheduledEvent(bot, payload))
}
