const { exec } = require('child_process')
const { promisify } = require('util')
const fs = require('fs').promises
const path = require('path')
const stream = require('stream')

class PredictionPythonService {
  constructor(){
    this._execAsync = promisify(exec)
  }

  async makePosePrediction(id,image){
    // Save the image to a local folder
    let imageData = Buffer.from([])
    if (image instanceof stream.Readable) {
      const chunks = []
      for await (const chunk of image) {
        chunks.push(chunk)
      }
      imageData = Buffer.concat(chunks)
    } else {
      // If 'image' is not a stream, handle it accordingly (it might be a string or Buffer already)
      imageData = Buffer.from(image)
    }
    const imageFileName = `${Math.random()}.png`
    const imagePath = path.join(__dirname, '../local', imageFileName) // Adjust the folder structure as needed
   

    await fs.writeFile(imagePath, imageData)

    // Execute the Python script
    const pythonScriptPath = path.join(__dirname, '../model/index.py') // Adjust the path
    const command = `python "${pythonScriptPath}" "${imagePath}"`

    // eslint-disable-next-line no-unused-vars
    const { stdout, stderr } = await this._execAsync(command)

    // Process Python script output if needed
    const outputLines = stdout.trim().split('\n')

    // Extract predicted class label and confidence
    const predictedClassLabel = outputLines[2].slice(0,-1)
    const confidence = parseFloat(outputLines[3]) * 100

    
    // Delete the image
    await fs.unlink(imagePath)

    return {predictedClassLabel,confidence}
  }
}

module.exports=PredictionPythonService