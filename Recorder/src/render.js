//Buttons
const videoElement=document.querySelector('video');
const startBtn=document.getElementById('startBtn');
const stopBtn=document.getElementById('stopBtn');
const videoSelectBtn=document.getElementById('videoSelectBtn');

videoSelectBtn.onclick=getVideoSources

const { writeFile } = require('fs')
const { desktopCapturer, remote } = require('electron');
const { Menu,dialog } =remote; 

const recordedChunks=[];
let mediaRecorder; //MediaRecorder instance to capture footage

let clicked;
// get the available video sources
async function getVideoSources(){
    const inputSources=await desktopCapturer.getSources({
        types: ['window','screen']
    });
    clicked=true;
    const videoOptionsMenu=Menu.buildFromTemplate(
        inputSources.map(source=>{
            return{
            label:source.name,
            click: () => selectSource(source)
            };
        }) 
    );

    videoOptionsMenu.popup();
}

startBtn.onclick = e => {
    if (clicked){
        mediaRecorder.start();
        startBtn.classList.add('is-danger');
        startBtn.innerText = 'Recording';

        document.getElementById('stopBtn').disabled=false;
        document.getElementById('startBtn').disabled=true;
    }else{
        alert("Please Select video source firstly...")
    }
  };
  
stopBtn.onclick = e => {
      mediaRecorder.stop();
      startBtn.classList.remove('is-danger');
      startBtn.innerText = 'Start';
      document.getElementById('stopBtn').disabled=true;
    };

//change the videoSources window to record
async function selectSource(source){
    videoSelectBtn.innerHTML = source.name;

    const constraints = {
        audio: false,
        video:{
            mandatory:{
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id 
            }
        }
    }

    //create a stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    //preview the source in a video element
    videoElement.srcObject=stream;
    videoElement.play(); 

    //create the Media Recorder
    const options={ mimeType: 'video/webm; codecs=vp9'};
    mediaRecorder = new MediaRecorder(stream,options);

    //register event handlers
    mediaRecorder.ondataavailable=handleDataAvailable;
    mediaRecorder.onstop=handleStop; 
}

//captures all recorded chunks
function handleDataAvailable(e){
    console.log('video data available');
    recordedChunks.push(e.data);
}

// Saves the video file on stop
async function handleStop(e) {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm; codecs=vp9'
    });
  
    const buffer = Buffer.from(await blob.arrayBuffer());
  
    const { filePath } = await dialog.showSaveDialog({
      buttonLabel: 'Save video',
      defaultPath: `vid-${Date.now()}.webm`
    });
  
    if (filePath) {
      writeFile(filePath, buffer, () => console.log('video saved successfully!'));
    }
  
  }