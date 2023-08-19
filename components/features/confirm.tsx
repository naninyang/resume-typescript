import { useEffect, MouseEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { Rem, hex, rgba } from '@/styles/designSystem';

const ConfirmDialog = styled.dialog({
  display: 'flex',
  alignItems: 'center',
  position: 'fixed',
  zIndex: 1055,
  top: 0,
  left: 0,
  width: '100vw',
  height: '101vh',
  outline: 0,
  border: 0,
  backgroundColor: 'transparent',
})

const ConfirmBackdrop = styled.div({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: `rgba(${rgba.dark70})`,
})

const ConfirmContent = styled.div({
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  gap: Rem(75),
  margin: '0 auto',
  padding: `${Rem(75)} ${Rem(25)} ${Rem(25)}`,
  width: Rem(510),
  pointerEvents: 'auto',
  backgroundColor: hex.light,
  borderRadius: Rem(10),
  outline: 0,
})

const ConfirmBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: Rem(25),
  alignItems: 'center',
  '& h2': {
    fontSize: Rem(24),
    lineHeight: '1.58333333',
  },
  '& .message': {
    display: 'flex',
    flexDirection: 'column',
    gap: Rem(10),
  },
  '& p': {
    fontSize: Rem(16),
    lineHeight: '1.375',
  },
})

const ConfirmFooter = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  '& button': {
    width: Rem(110),
    height: Rem(30),
    fontSize: Rem(14),
    borderRadius: Rem(2),
    '&.button-close': {
      boxShadow: `0px 0px 5px rgba(0, 0, 0, 0.20)`,
      backgroundColor: hex.light,
      '&:last-of-type': {
        backgroundColor: hex.mint,
        fontWeight: '700',
        color: hex.dark,
      },
    },
  },
})

interface ConfirmProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  message: ReactNode;
}

export default function Confirm({ isOpen, title, onClose, message }: ConfirmProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMouseDown = (event: MouseEvent) => {
    event.stopPropagation();
  }

  const modalRoot = document.getElementById('__next');
  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <ConfirmDialog
      aria-labelledby='dialog-heading'
      onMouseDown={handleMouseDown}
    >
      <ConfirmBackdrop onClick={onClose} />
      <ConfirmContent>
        <ConfirmBody>
          <h2 id='dialog-heading'>{title}</h2>
          <div className='message'>
            {message}
          </div>
        </ConfirmBody>
        <ConfirmFooter>
          <button
            type='button'
            className='button-close'
            onClick={onClose}
          >
            확인
          </button>
        </ConfirmFooter>
      </ConfirmContent>
    </ConfirmDialog>,
    modalRoot
  );
};
