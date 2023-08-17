import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { Rem, hex, mixin, rgba } from '@/styles/designSystem';

const ModalDialog = styled.dialog({
  display: 'flex',
  alignItems: 'center',
  padding: `${Rem(100)} 0`,
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

const ModalBackdrop = styled.div({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: `rgba(${rgba.dark70})`,
  backdropFilter: 'saturate(180%) blur(20px)',
})

const ModalContent = styled.div({
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  gap: Rem(50),
  margin: '0 auto',
  padding: Rem(50),
  width: `calc(100vw - ${Rem(200)})`,
  maxHeight: `calc(100vh - ${Rem(200)})`,
  pointerEvents: 'auto',
  backgroundColor: hex.light,
  borderRadius: Rem(20),
  outline: 0,
})

const ModalHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '& .title': {
    display: 'flex',
    gap: Rem(10),
    alignItems: 'center',
  },
  '& h2': {
    fontSize: Rem(36),
    fontWeight: '900',
    lineHeight: 1,
    color: hex.dark,
  },
})

const ModalClose = styled.button({
  width: Rem(50),
  height: Rem(50),
  background: 'none',
  '&::before': {
    content: "'×'",
    fontSize: Rem(36),
    fontWeight: '900',
    lineHeight: 1,
    color: hex.dark,
  },
  '& span': {
    ...mixin.screenReaderOnly,
  },
})

const ModalBody = styled.div({
  flex: 1,
  overflowY: 'auto',
})

export default function Modal({ isOpen, title, onClose, children }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : null;
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;
  const handleMouseDown = (event) => {
    event.stopPropagation();
  }

  return createPortal(
    <ModalDialog open onMouseDown={handleMouseDown}>
      <ModalBackdrop onClick={onClose} />
      <ModalContent>
        <ModalHeader>
          <h2>{title}</h2>
          <ModalClose onClick={onClose}><span>모달 닫기</span></ModalClose>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </ModalDialog>,
    document.getElementById('__next')
  );
};
