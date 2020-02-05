
import Emitter from './emitter.js';

export default class Recorder extends Emitter {
    static EVENTS(){
        return ['available', 'error'];
    }
    constructor(canvas){
        super();

        this.canvas = canvas;
        this.recorder = null;
        this.status = 'inactive';

        // self binding
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.resume = this.resume.bind(this);
        this.pause = this.pause.bind(this);
    }
    init(){
        const stream = this.canvas.captureStream();
        const mime = MediaRecorder.isTypeSupported('video/mp4') === true ? 'video/mp4' : 'video/webm';
        const option = {
            mimeType: mime,
        };
        this.recorder = new MediaRecorder(stream, option);
        // 録画が完了したときに発火し、BlobEvent を引数にリスナーを呼び出す
        this.recorder.addEventListener('dataavailable', (evt) => {
            const blob = evt.data;
            const type = blob.type;
            const videoBlob = new Blob([blob], {type: type});
            const blobUrl = window.URL.createObjectURL(videoBlob);
            this.emit('available', {blob: videoBlob, url: blobUrl, mime: mime});
        }, false);
        this.recorder.addEventListener('error', (evt) => {
            this.emit('error', {error: evt.error});
        }, false);
        this.status = 'initialized';
    }
    start(){
        if(this.recorder == null){
            throw new Error('recorder is not initialization');
        }
        if(this.status === 'recording' || this.status === 'paused'){return;}
        this.status = 'recording';
        this.recorder.start();
    }
    stop(){
        if(this.recorder == null){return;}
        if(this.status !== 'recording'){return;}
        this.status = 'stoped';
        this.recorder.stop();
    }
    resume(){
        if(this.recorder == null){return;}
        if(this.status !== 'paused'){return;}
        this.status = 'recording';
        this.recorder.resume();
    }
    pause(){
        if(this.recorder == null){return;}
        if(this.status !== 'recording'){return;}
        this.status = 'paused';
        this.recorder.pause();
    }
}
