import { Participant } from '@/types';

/**
 * Parse participant data from text input
 * Format: UUID EMAIL NAME (space separated, one per line)
 * Example:
 * 01545ad9-5653-4a0f-8582-22b211a8acf0 3959003@gmail.com 慈
 * 01d5c79f-7538-4aa0-8c3a-698338ba9cf8 hon-d.a@hotmail.com May
 */
export function parseParticipants(text: string): Participant[] {
  const lines = text.trim().split('\n');
  const participants: Participant[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Split by whitespace, expecting at least 3 parts: UUID, EMAIL, NAME
    const parts = trimmedLine.split(/\s+/);

    if (parts.length >= 3) {
      const id = parts[0];
      const email = parts[1];
      // Name could have spaces, so join remaining parts
      const name = parts.slice(2).join(' ');

      participants.push({ id, email, name });
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
