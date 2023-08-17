function hexToRgb(hex: string): string {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  return `${r}, ${g}, ${b}`;
}

export const hex: { [key: string]: string } = {
  dark: '#171717',
  light: '#eaffff',
  yellow: '#ffd800',
  mint: '#89ddff',
  background: '#212121',
  danger: '#C14848',
  warning: '#F3B3BC',
};

export const rgba: { [key: string]: string } = {
  dark20: `${hexToRgb('#171717')}, .2`,
  dark50: `${hexToRgb('#171717')}, .5`,
  dark70: `${hexToRgb('#171717')}, .7`,
  light20: `${hexToRgb('#eaffff')}, .2`,
  light50: `${hexToRgb('#eaffff')}, .5`,
  light70: `${hexToRgb('#eaffff')}, .7`,
  yellow20: `${hexToRgb('#ffd800')}, .2`,
  yellow50: `${hexToRgb('#ffd800')}, .5`,
  yellow70: `${hexToRgb('#ffd800')}, .7`,
  mint20: `${hexToRgb('#89ddff')}, .7`,
  mint50: `${hexToRgb('#89ddff')}, .5`,
  mint70: `${hexToRgb('#89ddff')}, .2`,
};

export const ar: { support: string } = {
  support: `@supports not (aspect-ratio: 1)`
};

// mixin 객체의 타입을 지정합니다.
export const mixin: { [key: string]: any } = {
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    '&>*': {
      flexShrink: 0,
      width: '100%',
      maxWidth: '100%',
    },
  },
  col: {
    flex: '1 0 0%',
  },
  coln: {
    flex: '0 0 auto',
  },
  colAuto: {
    flex: '0 0 auto',
    width: 'auto',
  },
  ellipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  clearfix: {
    '&::before, &::after': {
      content: '""',
      display: 'block',
      clear: 'both',
    },
  },
  screenReaderOnly: {
    position: 'absolute',
    overflow: 'hidden',
    margin: 0,
    width: '1px',
    height: '1px',
    clip: 'rect(1px, 1px, 1px, 1px)',
  },
  visuallyHiddenFocuable: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 20,
    margin: 0,
    width: 'auto',
    height: 'auto',
    clip: 'auto',
  },
  imageRendering: {
    imageRendering: '-webkit-optimize-contrast',
    backfaceVisibility: 'hidden',
  },
};

export function Clamp(clamp: number, height: number, lineheight: number): string {
  return `
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${clamp};
  max-height: ${height / 16}rem;
  line-height: ${lineheight};
  `;
}

export function Rem(px: number): string {
  const result = px / 16;
  return `${result}rem`;
}

export function Vw(px: number, width: number): string {
  const result = px * 100 / width;
  return `${result}vw`;
}
