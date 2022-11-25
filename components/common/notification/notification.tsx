import { FC, useCallback, useEffect } from 'react'
import css from 'styled-jsx/css'
import { INotiStateItem, REMOVE } from './interface.d'
import { useNotiContext } from './noti-context'

const Notification: FC<INotiStateItem> = ({
  id,
  content = '',
  removable = true,
  timeout = 10,
  type = ''
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
    <div className="noti animated slide-in-down">
      <style jsx global>
        {globalStyle}
      </style>
      <div className={`notification ${type}`}>
        {removable && <button className="delete" onClick={remove} />}
        <p dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
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

const globalStyle = css.global`
  .noti {
    z-index: 1002;
    min-width: 200px;
    max-width: 400px;
    position: fixed;
    top: 64px;
    right: 32px;
    font-size: 13px;

    .notification {
      border-radius: 6px;
      padding: 12px 56px 12px 16px;
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

      .delete {
        min-width: 24px;
        min-height: 24px;
        top: 12px;
        right: 12px;
      }
    }

    @media screen and (max-width: 767px) {
      top: 12px;
      left: 12px;
      right: 12px;
      min-width: calc(100% - 24px);
    }
  }
`

export default Notifications
