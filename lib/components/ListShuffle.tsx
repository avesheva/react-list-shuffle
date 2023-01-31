import React, { FC, ReactNode, useEffect, useRef } from 'react'

export interface IProps {
  id?: string,
  duration?: number,
  shuffleOnInit?: boolean,
  restoreOrder?: number | string | boolean,
  shuffle?: number | string | boolean,
  children: ReactNode
}

export type ListItemDataType = { index: number, top: number, bottom: number, height: number }

let mounted = false

const ListShuffle: FC<IProps> = ({
  children,
  id = 'listWrapper',
  duration = 1,
  shuffleOnInit = false,
  shuffle = Date.now(),
  restoreOrder = Date.now(),
}) => {
  const mutationObserver = useRef<MutationObserver>()
  const listWrapper = useRef<HTMLDivElement | null>(null)
  const initialOrder = useRef<ListItemDataType[]>([])
  const newOrder = useRef<ListItemDataType[]>([])
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

  const positionCalculate = (list: ListItemDataType[]): ListItemDataType[] => {
    const updatedCoordinates: ListItemDataType[] = []

    for (let i = 0; i < list.length; i++) {
      updatedCoordinates[i] = { ...list[i] }

      if (i === 0) {
        updatedCoordinates[i].top = initialOrder.current[i].top
        updatedCoordinates[i].bottom = updatedCoordinates[i].top + updatedCoordinates[i].height
        continue
      }

      updatedCoordinates[i].top = updatedCoordinates[i - 1].bottom
      updatedCoordinates[i].bottom = updatedCoordinates[i].top + updatedCoordinates[i].height
    }

    return updatedCoordinates
  }

  const moveItems = (list: ListItemDataType[], wrapper: HTMLElement) => {
    const updatedCoordinates = positionCalculate(list)

    for (let i = 0; i < updatedCoordinates.length; i++) {
      const item = updatedCoordinates[i]
      const currentElement = wrapper.children[item.index] as HTMLElement

      if (initialOrder.current[item.index]) {
        const top = item.top - initialOrder.current[item.index].top
        currentElement.style.transform = `translate(0, ${ top }px)`
      }
    }
  }

  const shuffleList = (toInitOrder = false) => {
    if (!listWrapper.current) return

    newOrder.current = toInitOrder ? [ ...initialOrder.current ] : shuffleArray(initialOrder.current)
    moveItems(newOrder.current, listWrapper.current)
  }

  const initialComputing = () => {
    if (!listWrapper.current) return

    initialOrder.current = []

    for (let i = 0; i < listWrapper.current.children.length; i++) {
      const element = listWrapper.current.children[i] as HTMLElement

      element.style.transitionProperty = 'transform'
      element.style.transitionDuration = `${ duration }s`
      element.setAttribute('index', `${ i }`)

      initialOrder.current.push(
        {
          index: i,
          top: element.offsetTop,
          bottom: element.offsetTop + element.offsetHeight,
          height: element.offsetHeight,
        },
      )
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
    if (!mounted) {
      listWrapper.current = document.getElementById(id) as HTMLDivElement

      initialComputing()

      /* List items adding/deleting handling */
      mutationObserver.current = new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          if (mutation.addedNodes.length > 0) {
            initialComputing()
          }

          mutation.removedNodes.forEach((node: Node) => {
            const removedItemIndex = (node as HTMLElement).getAttribute('index')
            let indexInOrder: number | null = null

            if (removedItemIndex !== '') {
              newOrder.current = newOrder.current.map((item, i) => {
                if (Number(removedItemIndex) === item.index) indexInOrder = i
                if (Number(removedItemIndex) < item.index) item.index--

                return item
              })
              indexInOrder !== null && newOrder.current.splice(indexInOrder, 1)

              if (listWrapper.current) {
                initialComputing()
                moveItems(newOrder.current, listWrapper.current)
              }
            }
          })
        })
      })

      if (listWrapper.current) {
        mutationObserver.current.observe(listWrapper.current, { subtree: false, childList: true })
      }

      mounted = true
    }

    return () => {
      if (mounted) {
        mounted = false
        newOrder.current = []
        mutationObserver.current?.disconnect()
      }
    }
  }, [])

  return (
    <div id={ id }>
      { children }
    </div>
  )
}

export default ListShuffle
