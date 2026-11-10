import { readStepNumber } from './cookingCommands';

export type RecipeVideoCommand =
  | { type: 'open' | 'play' | 'pause' | 'close' | 'ignore' }
  | { type: 'seek'; seconds: number }
  | { type: 'rate'; direction: 'faster' | 'slower' | 'normal' }
  | { type: 'invalid-time' };

function readVideoSeconds(text: string): number | null {
  let rest = text;
  let seconds = 0;
  while (rest) {
    const match = rest.match(/^(-?\d+(?:[.,]\d+)?|[a-z]+(?: [a-z]+)*?)\s*(phut|giay|p|s)\b/);
    if (!match) return null;
    const amount = match[1] === 'nua' ? 0.5 : readStepNumber(match[1]);
    if (amount === null || amount <= 0) return null;
    seconds += amount * (['phut', 'p'].includes(match[2]) ? 60 : 1);
    rest = rest.slice(match[0].length).trim();
  }
  return Number.isInteger(seconds) && seconds > 0 && seconds <= 3600 ? seconds : null;
}

export function parseRecipeVideoCommand(input: string): RecipeVideoCommand | null {
  const text = input.toLowerCase().normalize('NFC')
    .replace(/(^|\s)đừng(?=\s)/gu, '$1khong')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9.,\s-]/g, ' ').replace(/\s+/g, ' ').trim().replace(/[.,]+$/, '')
    .replace(/^(?:(?:ban |em |anh |chi )?co the |giup (?:minh|toi|em) |lam on |cho (?:minh|toi|em) )+/, '')
    .replace(/(?:\s+(?:cho (?:minh|toi|em)|giup(?: (?:minh|toi|em))?|di|nhe|voi|minh|co duoc khong|duoc khong|khong))+$/, '');

  const negated = text.match(/^(?:khong|chua|dung)\s+(.+)$/);
  // "Dừng video" is a pause. "Đừng mở video" declines a command.
  if (negated && matchVideoCommand(negated[1])) return { type: 'ignore' };
  return matchVideoCommand(text);
}

function matchVideoCommand(text: string): RecipeVideoCommand | null {
  if (/^(?:mo(?: lai)?|xem|bat|phat|cho xem) (?:video|clip)(?: (?:huong dan(?: nau an| nau mon nay)?|nau an|mon nay|nay))?$/.test(text)) {
    return { type: 'open' };
  }
  if (/^(?:(?:tiep tuc(?: phat)?|phat tiep|xem tiep)(?: (?:video|clip))?|phat (?:video|clip) tiep)$/.test(text)) {
    return { type: 'play' };
  }
  if (/^(?:tam dung|dung|ngung)(?: lai)?(?: (?:phat )?(?:video|clip)(?: lai)?)?$/.test(text)) return { type: 'pause' };
  if (/^(?:dong|tat) (?:video|clip)$/.test(text)) return { type: 'close' };
  if (/^(?:phat |xem )?(?:(?:video|clip) )?(?:toc do )?binh thuong$|^(?:phat|xem) binh thuong(?: (?:video|clip))?$/.test(text)) {
    return { type: 'rate', direction: 'normal' };
  }

  const change = text.match(/^(tua(?: (?:video|clip))?|phat(?: (?:video|clip))?|xem(?: (?:video|clip))?) (nhanh|cham|tien|lui|toi|ve|nguoc|lai)(?: hon)?(?: (?:video|clip))?(?: (?:them |di |lai )?(.+))?$/);
  if (!change) return null;
  const [, verb, direction, amount] = change;
  if (amount && !verb.startsWith('tua')) return null;
  if (!amount && ['nhanh', 'cham'].includes(direction)) {
    return { type: 'rate', direction: direction === 'nhanh' ? 'faster' : 'slower' };
  }
  const seconds = amount ? readVideoSeconds(amount) : 10;
  if (seconds === null) return { type: 'invalid-time' };
  return { type: 'seek', seconds: ['nhanh', 'tien', 'toi'].includes(direction) ? seconds : -seconds };
}
