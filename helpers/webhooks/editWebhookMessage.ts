import type { Bot } from "../../bot.ts";
import { AllowedMentions, FileContent, MessageComponents } from "../../types/discordeno.ts";
import { DiscordMessage } from "../../types/discord.ts";
import { MessageComponentTypes } from "../../types/shared.ts";
import { Attachment } from "../../transformers/attachment.ts";
import { Embed } from "../../transformers/embed.ts";

export async function editWebhookMessage(
  bot: Bot,
  webhookId: bigint,
  webhookToken: string,
  options: EditWebhookMessage & { messageId?: bigint; threadId?: bigint },
) {
  let url = options.messageId
    ? bot.constants.endpoints.WEBHOOK_MESSAGE(webhookId, webhookToken, options.messageId)
    : bot.constants.endpoints.WEBHOOK_MESSAGE_ORIGINAL(webhookId, webhookToken);

  // QUERY PARAMS
  if (options.threadId) {
    url += `?thread_id=${options.threadId}`;
  }

  const result = await bot.rest.runMethod<DiscordMessage>(bot.rest, "patch", url, {
    content: options.content,
    embeds: options.embeds,
    file: options.file,
    allowed_mentions: options.allowedMentions
      ? {
        parse: options.allowedMentions.parse,
        roles: options.allowedMentions.roles?.map((id) => id.toString()),
        users: options.allowedMentions.users?.map((id) => id.toString()),
        replied_user: options.allowedMentions.repliedUser,
      }
      : undefined,
    attachments: options.attachments?.map((attachment) => ({
      id: attachment.id.toString(),
      filename: attachment.filename,
      content_type: attachment.contentType,
      size: attachment.size,
      url: attachment.url,
      proxy_url: attachment.proxyUrl,
      height: attachment.height,
      width: attachment.width,
      ephemeral: attachment.ephemeral,
    })),
    components: options.components?.map((component) => ({
      type: component.type,
      components: component.components.map((subcomponent) => {
        if (subcomponent.type === MessageComponentTypes.InputText) {
          return {
            type: subcomponent.type,
            style: subcomponent.style,
            custom_id: subcomponent.customId,
            label: subcomponent.label,
            placeholder: subcomponent.placeholder,
            min_length: subcomponent.minLength ?? subcomponent.required === false ? 0 : subcomponent.minLength,
            max_length: subcomponent.maxLength,
          };
        }

        if (subcomponent.type === MessageComponentTypes.SelectMenu) {
          return {
            type: subcomponent.type,
            custom_id: subcomponent.customId,
            placeholder: subcomponent.placeholder,
            min_values: subcomponent.minValues,
            max_values: subcomponent.maxValues,
            options: subcomponent.options.map((option) => ({
              label: option.label,
              value: option.value,
              description: option.description,
              emoji: option.emoji
                ? {
                  id: option.emoji.id?.toString(),
                  name: option.emoji.name,
                  animated: option.emoji.animated,
                }
                : undefined,
              default: option.default,
            })),
          };
        }

        return {
          type: subcomponent.type,
          custom_id: subcomponent.customId,
          label: subcomponent.label,
          style: subcomponent.style,
          emoji: "emoji" in subcomponent && subcomponent.emoji
            ? {
              id: subcomponent.emoji.id?.toString(),
              name: subcomponent.emoji.name,
              animated: subcomponent.emoji.animated,
            }
            : undefined,
          url: "url" in subcomponent ? subcomponent.url : undefined,
          disabled: "disabled" in subcomponent ? subcomponent.disabled : undefined,
        };
      }),
    })),
    message_id: options.messageId?.toString(),
  });

  return bot.transformers.message(bot, result);
}

/** https://discord.com/developers/docs/resources/webhook#edit-webhook-message-jsonform-params */
export interface EditWebhookMessage {
  /** The message contents (up to 2000 characters) */
  content?: string;
  /** Embedded `rich` content */
  embeds?: Embed[];
  /** The contents of the file being sent/edited */
  file?: FileContent | FileContent[];
  /** Allowed mentions for the message */
  allowedMentions?: AllowedMentions;
  /** Attached files to keep */
  attachments?: Attachment[];
  /** The components you would like to have sent in this message */
  components?: MessageComponents;
}