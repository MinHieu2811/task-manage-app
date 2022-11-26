import { FC, useCallback, useEffect } from 'react'
import { INotiStateItem, REMOVE } from './interface.d'
import { useNotiContext } from './noti-context'
import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close';

const StyledNotiWrapper = styled.div`
  z-index: 1002;
  min-width: 200px;
  max-width: 400px;
  position: fixed;
  top: 64px;
  right: 32px;
  font-size: 13px;
  transition: all 0.4s ease-in-out;

  &.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;

    &.infinite {
      animation-iteration-count: infinite;
    }
  }

  @media print and (prefers-reduced-motion: reduce) {
    &.animated {
      animation-duration: 1ms !important;
      transition-duration: 1ms !important;
      animation-iteration-count: 1 !important;
    }
  }

  @keyframes slide-in-down {
    from {
      transform: translate3d(100%, 0, 0);
      visibility: visible;
    }

    to {
      transform: translate3d(0, 0, 0);
    }
  }

  &.slide-in-down {
    animation-name: slide-in-down;
  }

  @media screen and (max-width: 767px) {
    top: 12px;
    left: 12px;
    right: 12px;
    min-width: calc(100% - 24px);
  }
`

const StyledNoti = styled.div`
  border-radius: 6px;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.is-info {
    background-color: #f1f9fe !important;
    border: 2px solid #2196f3 !important;
    box-shadow: 0px 6.4px 14.4px rgba(101, 115, 129, 0.13) !important;
    border-radius: 8px;
    color: #363636 !important;
  }
  &.is-danger {
    background-color: #eb5757;
  }
  &.is-orange {
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    color: #363636;
    padding: 12px 56px 12px 12px;
    background-color: #fff3e0;
    border: 1px solid #f57c00;
    border-radius: 8px;
  }
`

const StyledButton = styled.button`
  min-width: 24px;
  min-height: 24px;
  top: 12px;
  right: 12px;
  outline: none;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Notification: FC<INotiStateItem> = ({
  id,
  content = '',
  removable = true,
  timeout = 10000000,
  type = '',
  typeAni
}) => {
  const { notiDispatch } = useNotiContext()

  const remove = useCallback(() => {
    notiDispatch({ type: REMOVE, payload: { id } })
  }, [id, notiDispatch])

  useEffect(() => {
    if (timeout) {
      setTimeout(() => {
        remove()
      }, timeout * 1000)
    }
  }, [remove, timeout])

  return (
    <StyledNotiWrapper className={`noti animated slide-in-down ${typeAni ? typeAni : 'slide-in-down'}`}>
      <StyledNoti className={`notification ${type}`}>
        <p dangerouslySetInnerHTML={{ __html: content }} />
        {removable && <StyledButton className="delete" onClick={remove}>
          <CloseIcon />
        </StyledButton>}
      </StyledNoti>
    </StyledNotiWrapper>
  )
}

function Notifications({ notiList }: { notiList: INotiStateItem[] }) {
  return (
    <>
      {notiList.map((noti) => {
        return <Notification {...noti} key={noti.id} />
      })}
    </>
  )
}

export default Notifications
