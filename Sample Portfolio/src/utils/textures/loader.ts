import { TextureLoader, LoadingManager, SRGBColorSpace } from "three";

const textureLoadingManager = new LoadingManager()
const textureLoader = new TextureLoader(textureLoadingManager)

export const loadTexture = (url: string) => {
    const texture = textureLoader.load(url)
    texture.colorSpace = SRGBColorSpace
    return texture
}

export const createLoaderUI = () => {
    const loaderContainer = document.createElement("div")
    loaderContainer.id = "loading"
    const progress = document.createElement("div")
    progress.className = "progress"
    loaderContainer.appendChild(progress)
    const progressbar = document.createElement("div")
    progressbar.className = "progressbar"
    progress.appendChild(progressbar)
    const setLoadingPercentage = (value: number) => progressbar.style.transform = `scaleX(${value})`
    const addLoaderToScene = () => document.body.appendChild(loaderContainer)
    const destroyLoader = () => document.body.removeChild(loaderContainer)
    return {
        setLoadingPercentage,
        addLoaderToScene,
        destroyLoader
    }
}

// Load Manager
const loaderUI = createLoaderUI()

textureLoadingManager.onStart = loaderUI.addLoaderToScene
textureLoadingManager.onProgress = (var1, itemsLoaded, total) => {
  const progress = itemsLoaded/total
  loaderUI.setLoadingPercentage(progress)
}
textureLoadingManager.onLoad = loaderUI.destroyLoader
