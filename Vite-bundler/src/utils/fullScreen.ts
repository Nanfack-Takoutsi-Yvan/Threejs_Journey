export const fullScreen = () => {
  const fullScreenElement = document.fullscreenElement || document.webkitfullscreenElement
  if(fullScreenElement) {
    if (document.exitFullscreen)
      document.exitFullscreen()
    else if (document.webkitexitFullscreen)
      document.webkitexitFullscreen()
  } else {
    if(canvas.requestFullscreen)
      canvas.requestFullscreen()
    else if (canvas.webkitrequestFullscreen)
      canvas.webkitrequestFullscreen()
  }
}