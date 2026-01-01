import { Participant } from '@/types';

/**
 * 生成隨機 UUID
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 解析參與者資料
 * 支援兩種格式：
 * 1. NAME EMAIL (兩個部分，自動生成 UUID)
 * 2. UUID EMAIL NAME (三個部分，舊格式)
 *
 * 範例：
 * Louis louis99032006@gmail.com
 * Baileys elayne1012742@gmail.com
 * 或
 * 01545ad9-5653-4a0f-8582-22b211a8acf0 3959003@gmail.com 慈
 */
export function parseParticipants(text: string): Participant[] {
  const lines = text.trim().split('\n');
  const participants: Participant[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // 以空白字元分割
    const parts = trimmedLine.split(/\s+/);

    if (parts.length >= 2) {
      // 檢查第二個部分是否為 email（包含 @ 符號）
      const hasEmailInSecondPart = parts[1].includes('@');

      if (hasEmailInSecondPart) {
        // 格式：NAME EMAIL 或 UUID EMAIL NAME
        if (parts.length === 2) {
          // 格式：NAME EMAIL（自動生成 UUID）
          const name = parts[0];
          const email = parts[1];
          const id = generateUUID();
          participants.push({ id, email, name });
        } else if (parts.length >= 3) {
          // 格式：UUID EMAIL NAME 或 NAME EMAIL（NAME 包含空格）
          // 檢查第一個部分是否為 UUID 格式
          const isFirstPartUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(parts[0]);

          if (isFirstPartUUID) {
            // 格式：UUID EMAIL NAME
            const id = parts[0];
            const email = parts[1];
            const name = parts.slice(2).join(' ');
            participants.push({ id, email, name });
          } else {
            // 格式：NAME EMAIL（NAME 可能包含空格）
            const email = parts[parts.length - 1]; // 最後一個是 email
            const name = parts.slice(0, parts.length - 1).join(' '); // 其餘是名字
            const id = generateUUID();
            participants.push({ id, email, name });
          }
        }
      } else if (parts.length >= 3) {
        // 可能是舊格式：UUID EMAIL NAME
        const id = parts[0];
        const email = parts[1];
        const name = parts.slice(2).join(' ');
        participants.push({ id, email, name });
      }
    }
  }

  return participants;
}

/**
 * Mask email for privacy display
 * Example: test@example.com -> t***@e***.com
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!domain) return '****@****.***';

  const [domainName, ...tlds] = domain.split('.');
  const tld = tlds.join('.');

  const maskedLocal = localPart.charAt(0) + '***';
  const maskedDomain = domainName.charAt(0) + '***';

  return `${maskedLocal}@${maskedDomain}.${tld}`;
}

/**
 * Randomly select winners from participants
 */
export function selectWinners(
  participants: Participant[],
  count: number
): Participant[] {
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, participants.length));
}
