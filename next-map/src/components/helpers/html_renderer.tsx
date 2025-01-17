import React, { FC } from 'react'

interface HtmlRendererProps {
  htmlContent: string
}

export const HtmlRenderer: FC<HtmlRendererProps> = ({ htmlContent }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
}

export default HtmlRenderer
