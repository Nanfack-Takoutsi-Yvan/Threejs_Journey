export const getViewportDimensions = () => {
  return {
    width: window.visualViewport?.width,
    height: window.visualViewport?.height
  }
}