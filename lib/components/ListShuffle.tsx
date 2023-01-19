import React, { FC, ReactNode, useEffect, useRef } from 'react'

export interface IProps {
  id?: string,
  duration?: number,
  shuffleOnInit?: boolean,
  shuffle: number | string | boolean,
  children: ReactNode
}

export type ListItemDataType = { index: number, top: number }

let mounted = false

const ListShuffle: FC<IProps> = ({
  children,
  id = 'listWrapper',
  duration = 1,
  shuffleOnInit = false,
  shuffle,
}) => {
  const listWrapper = useRef<HTMLDivElement | null>(null)
  const arr = useRef<ListItemDataType[]>([])

  const shuffleArray = (array: ListItemDataType[]) => {
    const arrClone = [...array]

    for (let i = arrClone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const t = arrClone[i]; arrClone[i] = arrClone[j]; arrClone[j] = t
    }

    return arrClone
  }

  const shuffleList = () => {
    if (!listWrapper.current) return

    const newOrder = shuffleArray(arr.current)

    for (let i = 0; i < listWrapper.current.children.length; i++) {
      const currentElement = listWrapper.current.children[i] as HTMLElement
      const newIndex = newOrder.findIndex((item  ) => item.index === i)
      const top = arr.current[newIndex].top - arr.current[i].top

      currentElement.style.transform = `translate(0, ${ top }px)`
    }
  }

  useEffect(() => {
    listWrapper.current = document.getElementById(id) as HTMLDivElement

    if (!mounted && listWrapper) {
      for (let i = 0; i < listWrapper.current.children.length; i++) {
        const element = listWrapper.current.children[i] as HTMLElement

        element.setAttribute('ps', `${ i }`)
        element.style.transitionProperty = 'transform'
        element.style.transitionDuration = `${ duration }s`

        arr.current.push({ index: i, top: element.getBoundingClientRect().top })
      }

      mounted = true
    }
  }, [])

  useEffect(() => {
    if (shuffleOnInit || shuffle !== 1) {
      shuffleList()
    }
  }, [shuffle])

  return (
    <div id={ id }>
      { children }
    </div>
  )
}

export default ListShuffle
