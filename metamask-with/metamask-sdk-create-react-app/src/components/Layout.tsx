import React, { PropsWithChildren } from 'react'
import './Layout.css'

type Props = {
  title: string
  caption: string | React.ReactNode
}

export const ExplainerLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
  title,
  caption,
}) => {
  return (
    <div className="wrapper">
      <div className="text-wrapper">
        <div className="heading-wrapper">
          <h1>
            <span className="heading">{title}</span>
          </h1>
          <p className="caption">{caption}</p>
        </div>
        <div className="content-wrapper">{children}</div>
      </div>
    </div>
  )
}
