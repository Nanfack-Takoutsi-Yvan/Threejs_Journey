import { TextureLoader, LoadingManager, SRGBColorSpace } from "three";

const loadingManager = new LoadingManager()
const textureLoader = new TextureLoader(loadingManager)

const LoaderUI = () => {
  const loader = document.createElement("div")
  const progress = document.createElement("div")
  const progressBar = document.createElement("div")
  loader.id = "loading"
  progress.className = "progress"
  progressBar.className = "progressbar"
  progress.appendChild(progressBar)
  loader.appendChild(progress)
  return {
      init: () => document.body.prepend(loader),
      destroy: () => document.body.removeChild(loader),
      charge: (value: number) => progressBar.style.transform = `scaleX(${value})`
  }
}

const loaderUI = LoaderUI()

loadingManager.onStart = loaderUI.init
loadingManager.onLoad = loaderUI.destroy
loadingManager.onProgress = (url, loaded, total) => loaderUI.charge(loaded/total)

const loadTexture = (url: string) => {
  const texture = textureLoader.load(url)
  texture.colorSpace = SRGBColorSpace
  return texture
}

export default loadTexture