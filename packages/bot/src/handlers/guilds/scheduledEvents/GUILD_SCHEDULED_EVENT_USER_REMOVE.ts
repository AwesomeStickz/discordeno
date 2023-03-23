import type { DiscordGatewayPayload, DiscordScheduledEventUserRemove } from '@discordeno/types'
import type { Bot } from '../../../bot.js'

export function handleGuildScheduledEventUserRemove(bot: Bot, data: DiscordGatewayPayload) {
  const payload = data.d as DiscordScheduledEventUserRemove

  return bot.events.scheduledEventUserRemove?.({
    guildScheduledEventId: bot.transformers.snowflake(payload.guild_scheduled_event_id),
    userId: bot.transformers.snowflake(payload.user_id),
    guildId: bot.transformers.snowflake(payload.guild_id),
  })
}
