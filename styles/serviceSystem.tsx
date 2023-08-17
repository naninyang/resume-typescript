import styled from '@emotion/styled'
import { Rem, hex, mixin, rgba } from './designSystem'

export const ServicePage = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: hex.background,
  minHeight: '100vh',
})

export const Container = styled.main({
  '&.css-0': {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: Rem(50),
    padding: `${Rem(50)} ${Rem(25)}`,
    width: Rem(992),
    color: hex.light,
    '& blockquote': {
      margin: 0,
      padding: Rem(15),
      backgroundColor: hex.dark,
      '& a': {
        color: hex.mint,
        textDecoration: 'underline',
      },
    },
    '& section': {
      display: 'flex',
      flexDirection: 'column',
      gap: Rem(25),
    },
    '& code': {
      display: 'inline-block',
      borderRadius: Rem(5),
      margin: `0 ${Rem(2)}`,
      padding: `${Rem(2)} ${Rem(5)}`,
      backgroundColor: hex.mint,
      color: hex.dark,
    },
    '& h1': {
      fontSize: Rem(64),
      fontWeight: '900',
      lineHeight: 1,
    },
    '& h2': {
      fontSize: Rem(36),
      fontWeight: '700',
      lineHeight: 1,
    },
    '& a': {
      color: hex.light,
    },
    '& dl:not(.array)': {
      display: 'flex',
      flexWrap: 'wrap',
      '& dt, & dd': {
        padding: `${Rem(5)} 0`,
      },
      '& dt': {
        ...mixin.colAuto,
        width: Rem(170),
        fontWeight: '700',
      },
      '& dd': {
        ...mixin.colAuto,
        width: `calc(100% - ${Rem(170)})`,
        '&.essays': {
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: `${Rem(20)} 0`,
            fontSize: Rem(20),
            fontWeight: '900',
            lineHeight: 1.3,
          },
          '& p': {
            margin: `${Rem(16)} 0`,
            fontSize: Rem(16),
            fontWeight: '400',
            lineHeight: 1.375,
          },
          '& :first-of-type': {
            marginTop: 0,
          },
          '& :last-of-type': {
            marginBottom: 0,
          },
        },
      },
    },
    '& section > dl': {
      padding: `${Rem(5)} 0`,
      borderTop: `${Rem(5)} solid ${hex.yellow}`,
      borderBottom: `${Rem(5)} solid ${hex.yellow}`,
      '& dd': {
        '&:not(.essays)': {
          '& strong': {
            display: 'inline-block',
            paddingLeft: Rem(25),
            fontWeight: '700',
            color: hex.warning,
          },
          '& p strong': {
            textIndent: Rem(-25),
          },
        },
      },
    },
  },
})

export const Fragment = styled.div({
  padding: `${Rem(10)} 0`,
  borderBottom: `${Rem(1)} solid rgba(${rgba.light20})`,
  display: 'flex',
  '&:last-of-type': {
    borderBottom: 0,
  },
  '&:not(.array)': {
    flexWrap: 'wrap',
    '& dt, & dd': {
      padding: `${Rem(5)} 0`,
    },
    '& dt': {
      ...mixin.colAuto,
      width: Rem(170),
      fontWeight: '700',
    },
    '& dd': {
      ...mixin.colAuto,
      width: `calc(100% - ${Rem(170)})`,
      '&:not(.essays)': {
        '& strong': {
          paddingLeft: Rem(25),
          fontWeight: '700',
          color: hex.warning,
        },
      },
    },
  },
  '&.array': {
    flexDirection: 'column',
    '& .array': {
      display: 'flex',
      flexWrap: 'wrap',
      '& dt, & dd': {
        padding: `${Rem(5)} 0`,
      },
      '& dt': {
        ...mixin.colAuto,
        width: Rem(170),
        fontWeight: '700',
      },
      '& dd': {
        ...mixin.colAuto,
        width: `calc(100% - ${Rem(170)})`,
        '&:not(.essays) strong': {
          paddingLeft: Rem(25),
          fontWeight: '700',
          color: hex.warning,
        },
      },
    },
  },
  '& .projects-list': {
    margin: `${Rem(5)} 0 ${Rem(5)} ${Rem(170)}`,
    padding: `${Rem(5)} ${Rem(25)}`,
    borderRadius: Rem(15),
    backgroundColor: hex.dark,
  },
})

export const IsNotSession = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexGrow: 1,
  '& p': {
    fontSize: Rem(16),
    fontWeight: '700',
    color: hex.yellow
  },
})
