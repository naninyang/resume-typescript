import styled from '@emotion/styled';
import { Rem, hex, mixin, rgba } from './designSystem';

export const ManagementPage = styled.div({
  display: 'flex',
  flexDirection: 'column',
  background: 'fixed linear-gradient(225deg, #CD313A 0%, #000 37.55%, #000 57.70%, #0047A0 100%)',
  minHeight: '100vh',
})

export const Nav = styled.nav({
  flexFlow: '1',
  display: 'flex',
  justifyContent: 'center',
  backdropFilter: 'saturate(1.8) blur(20px)',
  backgroundColor: 'rgba(22, 22, 23, 0.8)',
  height: Rem(52),
  '& ol': {
    display: 'flex',
    justifyContent: 'space-between',
  },
  '& > ol': {
    maxWidth: Rem(1200),
    width: '100%',
    '& > li': {
      position: 'relative',
      '&:nth-of-type(5)': {
        '& > ol': {
          left: 'auto',
          right: 0,
        },
      },
      '& p': {
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${Rem(25)}`,
        height: '100%',
        fontSize: Rem(16),
        color: hex.yellow,
      },
      '& > ol': {
        position: 'absolute',
        top: `calc(100% + ${Rem(15)})`,
        left: 0,
        display: 'none',
        height: Rem(52),
        borderRadius: Rem(52),
        backdropFilter: 'saturate(1.8) blur(20px)',
        backgroundColor: `rgba(${rgba.yellow70})`,
        '& a': {
          whiteSpace: 'nowrap',
          color: `rgba(${rgba.dark70})`,
        },
      },
    },
  },
  '& a, & button': {
    padding: `0 ${Rem(25)}`,
    height: '100%',
    fontSize: Rem(16),
    color: `rgba(${rgba.light70})`,
  },
  '& a': {
    display: 'flex',
    alignItems: 'center',
  },
  '& button': {
    backgroundColor: 'transparent',
  },
})

export const Container = styled.main({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexGrow: 1,
})

export const Content = styled.div({
  padding: `${Rem(125)} ${Rem(25)}`,
  '&.essay': {
    width: Rem(770),
  },
})

export const ManagementContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: Rem(50),
  '& h1': {
    fontSize: Rem(32),
    fontWeight: '900',
    color: hex.light,
  },
  '& fieldset': {
    display: 'flex',
    flexDirection: 'column',
    gap: Rem(50),
  },
})

export const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  '& > div': {
    display: 'flex',
    gap: Rem(10),
    '& > div': {
      ...mixin.col,
    },
  },
})

export const FieldGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: Rem(5),
  position: 'relative',
  '&:not(.content-editable)': {
    height: Rem(97),
  },
  '& > input, & > select': {
    height: Rem(60),
  },
  '&.content-editable > textarea': {
    minHeight: Rem(270),
    '&:focus, &:not(:empty)': {
      backgroundPosition: `calc(100% - ${Rem(10)}) calc(100% - ${Rem(6)})`,
      padding: `${Rem(6)} ${Rem(15)}`,
      fontSize: Rem(16),
      '& ~ label': {
        padding: `${Rem(8)} ${Rem(15)}`,
        transform: `scale(.5) translateY(-.${Rem(10)})`,
        fontSize: Rem(12),
        color: `rgba(${rgba.dark70})`,
        opacity: 0,
      },
    },
    '& ~ label': {
      color: hex.dark,
    },
  },
  '& > select': {
    background: `url('data:image/svg+xml,%3Csvg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M7.42969 9.5L5.92969 11L12 17.0703L18.0703 11L16.5703 9.5L12 14.0703L7.42969 9.5Z" fill="black"/%3E%3C/svg%3E%0A') no-repeat calc(100% - ${Rem(10)}) 50%/${Rem(24)} ${Rem(24)}`,
    '&:focus, &:not(:required:invalid)': {
      backgroundPosition: `calc(100% - ${Rem(10)}) calc(100% - ${Rem(6)})`,
      padding: `${Rem(28)} ${Rem(15)} ${Rem(6)}`,
      '& ~ label': {
        padding: `${Rem(8)} ${Rem(15)}`,
        transform: `scale(.5) translateY(-.${Rem(10)})`,
        fontSize: Rem(12),
        color: `rgba(${rgba.dark70})`,
      },
    },
    '& ~ label': {
      color: 'transparent',
    },
  },
  '& > textarea': {
    height: Rem(270),
  },
  '& > input, & > textarea, & > select, > .textarea': {
    backgroundColor: hex.light,
    padding: `${Rem(17)} ${Rem(15)}`,
    borderRadius: Rem(5),
    border: `1px rgba(${rgba.light20}) solid`,
    width: '100%',
    fontSize: Rem(24),
    fontWeight: '700',
    lineHeight: 1,
    color: hex.dark,
    transition: 'all .15s ease-in-out,box-shadow .15s ease-in-out',
    appearance: 'none',
  },
  '& > input, & > textarea': {
    '&::placeholder': {
      color: 'transparent',
    },
    '&:focus, &:not(:placeholder-shown)': {
      padding: `${Rem(28)} ${Rem(15)} ${Rem(8)}`,
      '& ~ label': {
        padding: `${Rem(8)} ${Rem(15)}`,
        transform: `scale(.5) translateY(-.${Rem(10)})`,
        fontSize: Rem(12),
        color: `rgba(${rgba.dark70})`,
      },
    },
  },
  '& > label': {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: `${Rem(18)} ${Rem(15)}`,
    pointerEvents: 'none',
    transformOrigin: '0 0',
    transition: 'all .1s ease-in-out,transform .1s ease-in-out',
    color: hex.dark,
    fontSize: Rem(24),
    fontWeight: '700',
    lineHeight: 1,
  },
  '& p': {
    display: 'flex',
    gap: Rem(2),
    alignItems: 'center',
    fontSize: Rem(12),
    fontWeight: '900',
    lineHeight: 1,
    color: hex.yellow,
    '& label': {
      color: hex.mint,
    },
  },
})

export const DefinitionGroup = styled.dl({
  '&:not(.profile-definition)': {
    display: 'flex',
    flexDirection: 'column',
    width: `calc(100vw - ${Rem(50)})`,
    '& > div': {
      display: 'flex',
      gap: Rem(15),
    },
  },
})

export const ItemGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: Rem(10),
  ...mixin.col,
  position: 'relative',
  height: Rem(97),
  '&.career-description': {
    height: 'auto',
    '& dd': {
      paddingBottom: Rem(37),
      height: 'auto',
      lineHeight: 1.33333333,
      '& p': {
        bottom: Rem(10),
      },
    },
  },
  '& dt': {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: `${Rem(8)} ${Rem(15)}`,
    pointerEvents: 'none',
    color: `rgba(${rgba.light70})`,
    fontSize: Rem(12),
    fontWeight: '700',
    lineHeight: 1,
  },
  '& dd': {
    display: 'block',
    padding: `${Rem(28)} ${Rem(15)} ${Rem(8)}`,
    borderRadius: Rem(5),
    width: '100%',
    height: Rem(60),
    fontWeight: '700',
    lineHeight: 1,
    appearance: 'none',
    position: 'relative',
    '& span': {
      fontSize: Rem(24),
      color: hex.light,
    },
    '& p': {
      position: 'absolute',
      bottom: Rem(-15),
      left: Rem(15),
      fontSize: Rem(12),
      fontWeight: '900',
      color: hex.yellow,
    },
  },
})

export const ButtonGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: Rem(15),
  '& > button, & > a': {
    padding: `0 ${Rem(35)}`,
    borderRadius: Rem(5),
    border: 0,
    width: '100%',
    height: Rem(70),
    backgroundColor: hex.mint,
    position: 'relative',
    fontSize: Rem(24),
    fontWeight: '700',
    color: hex.dark,
    lineHeight: 1,
  },
  '& > a': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: Rem(370),
    lineHeight: Rem(70),
  }
})

export const ArrayContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: Rem(50),
  '& h1': {
    fontSize: Rem(32),
    fontWeight: '900',
    color: hex.light,
    '& strong': {
      fontSize: Rem(16),
      color: hex.yellow,
      '&::before': {
        content: "'* '",
        paddingLeft: Rem(10),
      },
    },
  },
  '& p.no-data': {
    color: hex.light,
    fontSize: Rem(24),
    fontWeight: '700',
    textAlign: 'center',
  },
  '& fieldset': {
    display: 'flex',
    flexDirection: 'column',
    gap: Rem(50),
  },
  '& .form-group': {
    '&:not(.single-group)': {
      display: 'flex',
      flexDirection: 'column',
      gap: Rem(25),
    },
  },
  '& .data-group': {
    display: 'flex',
    flexDirection: 'column',
    gap: Rem(50),
    '& .list': {
      display: 'flex',
      flexDirection: 'column',
      gap: Rem(15),
      paddingBottom: Rem(15),
      border: `${Rem(1)} solid ${hex.light}`,
      borderRight: 0,
      borderLeft: 0,
      '& .item': {
        position: 'relative',
        paddingTop: Rem(25),
        borderTop: `${Rem(1)} solid ${hex.light}`,
        '& form fieldset > div:last-of-type': {
          '& > button': {
            backgroundColor: hex.yellow,
          },
          '& div button': {
            color: hex.yellow,
          },
        },
        '& .project-list': {
          display: 'flex',
          flexDirection: 'column',
          gap: Rem(15),
          backdropFilter: 'saturate(1.8) blur(20px)',
          backgroundColor: `rgba(${rgba.dark70})`,
          borderRadius: Rem(5),
          marginBottom: Rem(15),
          padding: `0 ${Rem(25)}`,
        },
        '& .project-item': {
          position: 'relative',
          paddingTop: Rem(25),
          borderTop: `${Rem(1)} solid rgba(${rgba.light50})`,
          '& form fieldset > div:last-of-type': {
            '& > button': {
              backgroundColor: 'transparent',
              color: hex.yellow,
              border: `${Rem(2)} solid ${hex.yellow}`,
            },
          },
          '&:first-of-type': {
            borderTop: 0,
          },
          '&:last-of-type': {
            paddingBottom: Rem(25),
          },
          '& .view': {
            '& dl': {
              width: 'auto',
            },
          },
          '& .item-management': {
            top: Rem(25),
            right: Rem(0),
            '& button': {
              width: Rem(45),
              height: Rem(30),
              '&.edit': {
                backgroundColor: hex.light,
                color: hex.dark,
                fontSize: Rem(14),
              },
              '&.del': {
                backgroundColor: hex.light,
                color: hex.danger,
                fontSize: Rem(14),
              },
            },
          },
        },
        '&:first-of-type': {
          borderTop: 0,
        },
        '& .item-management': {
          display: 'flex',
          flexDirection: 'column',
          gap: Rem(15),
          position: 'absolute',
          top: Rem(25),
          right: 0,
          '& button': {
            borderRadius: Rem(2),
            width: Rem(50),
            height: Rem(30),
            fontSize: Rem(16),
            fontWeight: '700',
            lineHeight: 1,
            '&.edit': {
              backgroundColor: hex.mint,
              color: hex.dark,
            },
            '&.del': {
              backgroundColor: hex.danger,
              color: hex.light,
            },
          },
        },
        '& > .view ~ div:not(.project-list)': {
          '& button': {
            backgroundColor: 'transparent',
            border: `${Rem(2)} solid ${hex.mint}`,
            color: hex.light,
          },
        },
      },
    },
  },
})

export const Fragment = styled.div({
  display: 'grid',
  width: 'max-content',
  gap: Rem(15),
  '&.array-education': {
    gridTemplateColumns: 'auto auto auto auto',
    '& > div': {
      width: Rem(230),
      '&:nth-of-type(3)': {
        gridColumn: 'span 2',
      },
    },
  },
  '&.array-certificate': {
    gridTemplateColumns: 'auto auto auto',
    '& > div': {
      width: Rem(230),
      '&:nth-of-type(2)': {
        gridColumn: 'span 2',
      },
    },
  },
  '&.array-skill': {
    gridTemplateColumns: 'auto auto auto auto',
    '& > div': {
      width: Rem(230),
    },
  },
  '&.array-career': {
    display: 'block',
    '& .array-career': {
      display: 'grid',
      gridTemplateColumns: 'auto auto auto auto',
      gap: Rem(15),
      '& > div': {
        width: Rem(230),
        '&:nth-of-type(3)': {
          gridColumn: 'span 2',
        },
      },
    },
    '& .project-add': {
      display: 'flex',
      justifyContent: 'flex-end',
      '& button': {
        backgroundColor: hex.yellow,
        padding: `0 ${Rem(15)}`,
        borderRadius: Rem(5),
        border: `1px rgba(${rgba.dark20}) solid`,
        width: 'auto',
        height: Rem(50),
        fontSize: Rem(16),
        fontWeight: '700',
        lineHeight: 1,
        color: hex.dark,
      },
    },
  },
  '&.array-projects': {
    gridTemplateColumns: 'auto auto auto auto',
    '& > div': {
      width: Rem(230),
      '&:last-of-type': {
        gridColumn: 'span 3',
        width: '100%',
      },
    },
  },
  '& .projects-list': {
    display: 'flex',
    flexDirection: 'column',
    gap: Rem(50),
  },
  '& button': {
    backgroundColor: hex.danger,
    padding: `0 ${Rem(15)}`,
    borderRadius: Rem(5),
    border: `1px rgba(${rgba.light20}) solid`,
    width: 'auto',
    height: Rem(60),
    fontSize: Rem(24),
    lineHeight: 1,
    color: hex.light,
  },
})

export const Util = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

export const SessionUtil = styled.div({
  display: 'flex',
  '& a': {
    padding: `${Rem(5)} ${Rem(10)}`,
    fontSize: Rem(14),
    fontWeight: '700',
    lineHeight: '1.42857143',
    color: hex.yellow,
    '&:hover, &:focus': {
      textDecoration: 'underline',
    },
  },
})

export const FindUtil = styled.div({
  display: 'flex',
  '& button': {
    background: 'none',
  },
  '& a, & button': {
    padding: `${Rem(5)} ${Rem(10)}`,
    fontSize: Rem(14),
    lineHeight: '1.42857143',
    color: hex.mint,
    '&:hover, &:focus': {
      textDecoration: 'underline',
    },
  },
})
