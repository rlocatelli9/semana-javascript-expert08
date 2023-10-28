import Clock from './deps/clock.js';
import View from './view.js';
const view = new View()
const clock = new Clock()
let took = ''

const worker = new Worker('./src/workers/worker.js',{
  type: 'module'
})

worker.onerror = (error) => {
  console.error(error)
}

worker.onmessage = ({data}) => {
  if(data.status !== 'done') return
  clock.stop()
  view.updateElapsedTime(`Process took ${took.replace('ago', '')}`)
}

view.configureOnFileChange(file => {
  const canvas = view.getCanvas()

  worker.postMessage({
    file,
    canvas
  }, [
    canvas
  ])

  clock.start((time) => {
      took = time;
      view.updateElapsedTime(`Process started ${time}`)
  })
})

async function fakeFetch() {
  const filePath = '/videos/frag_bunny.mp4'
  /** traz o tamanho do arquivo */
  // const response = await fetch(filePath, {
  //   method: "HEAD"
  // })
  //response.headers.get('content-length')
  const response = await fetch(filePath)

  const file = new File([await response.blob()], filePath, {
    type: 'video/mp4',
    lastModified: Date.now()
  })

  const event = new Event('change')
  Reflect.defineProperty(
    event, 'target', {value: {files: [file]}}
  )
  document.getElementById('fileUpload').dispatchEvent(event)

}

fakeFetch()



