import React, { FC } from 'react'

export interface IYourLibComponentProps {

}

const YourLibNameComponent: FC<IYourLibComponentProps> = (props: IYourLibComponentProps) => {
  return (
    <div>
      <h4>Your lib components here : "./lib"</h4>
    </div>
  )
}

export default YourLibNameComponent
