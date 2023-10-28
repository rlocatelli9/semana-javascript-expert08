export default class CanvasRenderer {
  #canvas
  #context
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#canvas = canvas
    this.#context = canvas.getContext("2d")
  }

  /**
   * 
   * @param {VideoFrame} frame 
   */
  drawFrame(frame) {
   const {displayHeight, displayWidth} = frame 

    this.#canvas.width = displayWidth
    this.#canvas.height = displayHeight
    this.#context.drawImage(
      frame,
      0,
      0,
      displayWidth,
      displayHeight,
    )
    frame.close()
  }

  getRenderer(){
    const renderer = this
    let pendingFrame = null
    return frame => {
      const renderAnimationFrame = ( ) => {
        renderer.drawFrame(pendingFrame)
        pendingFrame=null
      }

      if(!pendingFrame){
        requestAnimationFrame(renderAnimationFrame)
      } else {
        pendingFrame.close()
      }

      pendingFrame = frame
    }
  }
}