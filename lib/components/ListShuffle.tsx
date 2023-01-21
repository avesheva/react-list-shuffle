import React, { FC, ReactNode, useEffect, useRef } from 'react'

export interface IProps {
  id?: string,
  duration?: number,
  shuffleOnInit?: boolean,
  restoreOrder?: number | string | boolean,
  shuffle?: number | string | boolean,
  children: ReactNode
}

export type ListItemDataType = { index: number, top: number }

let mounted = false

const ListShuffle: FC<IProps> = ({
  children,
  id = 'listWrapper',
  duration = 1,
  shuffleOnInit = false,
  shuffle = Date.now(),
  restoreOrder = Date.now(),
}) => {
  const listWrapper = useRef<HTMLDivElement | null>(null)
  const initialOrder = useRef<ListItemDataType[]>([])
  const lastShuffleValue = useRef<string | number | boolean>(shuffle)
  const lastRestoreOrderValue = useRef<string | number | boolean>(restoreOrder)

  const shuffleArray = (array: ListItemDataType[]) => {
    const arrClone = [...array]

    for (let i = arrClone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const t = arrClone[i]; arrClone[i] = arrClone[j]; arrClone[j] = t
    }

    return arrClone
  }

  const shuffleList = (toInitOrder = false) => {
    if (!listWrapper.current) return

    const newOrder = toInitOrder ? [ ...initialOrder.current ] : shuffleArray(initialOrder.current)

    for (let i = 0; i < listWrapper.current.children.length; i++) {
      const currentElement = listWrapper.current.children[i] as HTMLElement
      const newIndex = newOrder.findIndex((item  ) => item.index === i)
      const top = initialOrder.current[newIndex].top - initialOrder.current[i].top

      currentElement.style.transform = `translate(0, ${ top }px)`
    }
  }

  useEffect(() => {
    if (shuffleOnInit || shuffle !== lastShuffleValue.current) {
      shuffleList()
      lastShuffleValue.current = shuffle
    }
  }, [shuffle])

  useEffect(() => {
    if (restoreOrder !== lastRestoreOrderValue.current) {
      shuffleList(true)
      lastRestoreOrderValue.current = restoreOrder
    }
  }, [restoreOrder])


  useEffect(() => {
    listWrapper.current = document.getElementById(id) as HTMLDivElement

    if (!mounted && listWrapper) {
      for (let i = 0; i < listWrapper.current.children.length; i++) {
        const element = listWrapper.current.children[i] as HTMLElement

        element.style.transitionProperty = 'transform'
        element.style.transitionDuration = `${ duration }s`

        initialOrder.current.push({ index: i, top: element.getBoundingClientRect().top })
      }

      mounted = true
    }
  }, [])

  return (
    <div id={ id }>
      { children }
    </div>
  )
}

export default ListShuffle
