import type { UncontrolledProps } from "react-medium-image-zoom";
import Zoom from "react-medium-image-zoom";
import "./styles.css"
export function ImageZoom({
  children,
  zoomMargin = 64,
  ...props
}: UncontrolledProps) {
  return (
    <Zoom zoomMargin={zoomMargin} 
    {...props}>
      {children}
    </Zoom>
  );
}
