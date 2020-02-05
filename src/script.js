
import 'whatwg-fetch';
import Promise from 'promise-polyfill';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import Tweakpane from 'tweakpane';

import baseVs from './shader/base.vert';
import baseFs from './shader/base.frag';
import Recorder from './recorder.js';

class ThreeApp {
    constructor(){
        console.log('⚡ : construct three app');

        this.initialize();
        this.eventSetting();
        this.startTime = Date.now();

        this.resize = this.resize.bind(this);
        this.render = this.render.bind(this);
    }
    initialize(){
        this.wrapper = document.getElementById('wrap');
        // gen scene
        this.scene = new THREE.Scene();
        // gen camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1.0, 20.0);
        this.camera.position.z = 10.0;
        this.camera.target = new THREE.Vector3(0, 0, 0);
        this.scene.add(this.camera);
        // gen material
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                scale:  {type: "f", value: 0},
                time:   {type: "f", value: 0},
                weight: {type: "f", value: 0},
                wave:   {type: "f", value: 0}
            },
            vertexShader: baseVs,
            fragmentShader: baseFs,
            transparent: true,
        });
        // gen mesh
        this.mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2.0, 5), this.shaderMaterial);
        this.scene.add(this.mesh);
        // renderer
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0.0);
        this.wrapper.appendChild(this.renderer.domElement);
        // canvas and recorder
        this.canvas = this.renderer.domElement;
        this.recorder = new Recorder(this.canvas);
        // controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // finish
        this.resize();
    }
    eventSetting(){
        window.addEventListener('resize', this.resize, false);

        this.scale = 0.5;
        this.speed = 0.5;
        this.weight = 1.0;
        this.wave = 2.0;
        const PARAMS = {
            scale: this.scale,
            speed: this.speed,
            weight: this.weight,
            wave: this.wave,
        };
        const pane = new Tweakpane();
        pane.addInput(PARAMS, 'scale', {
            min: 0.1,
            max: 1.0,
            step: 0.01,
        }).on('change', (v) => {this.scale = v;});
        pane.addInput(PARAMS, 'speed', {
            min: 0.1,
            max: 1.0,
            step: 0.01,
        }).on('change', (v) => {this.speed = v;});
        pane.addInput(PARAMS, 'weight', {
            min: 0.1,
            max: 3.0,
            step: 0.01,
        }).on('change', (v) => {this.weight = v;});
        pane.addInput(PARAMS, 'wave', {
            min: 0.1,
            max: 3.0,
            step: 0.01,
        }).on('change', (v) => {this.wave = v;});

        this.recorder.init();
        this.recorder.on('available', (data) => {
            console.log(data);
            const movie = document.createElement('video');
            movie.src = data.url;
            movie.controls = true;
            this.wrapper.appendChild(movie);
            const anchor = document.createElement('a');
            anchor.download = 'autogeneration.webm';
            anchor.href = data.url;
            anchor.textContent = 'download';
            this.wrapper.appendChild(anchor);
        });
        this.recorder.on('error', (err) => {
            console.log(err);
        });
        pane.addButton({
            title: 'start recording'
        }).on('click', () => {
            this.recorder.start();
        });
        pane.addButton({
            title: 'stop recording'
        }).on('click', () => {
            this.recorder.stop();
        });
    }
    resize(){
        const b = this.renderer.domElement.parentNode.getBoundingClientRect();
        this.renderer.setSize(b.width, b.height);
        this.camera.aspect = b.width / b.height;
        this.camera.updateProjectionMatrix();
    }
    render(){
        this.controls.update();
        let nowTime = (Date.now() - this.startTime) * 0.001;
        this.shaderMaterial.uniforms['scale'].value = this.scale;
        this.shaderMaterial.uniforms['time'].value = nowTime * this.speed;
        this.shaderMaterial.uniforms['weight'].value = this.weight;
        this.shaderMaterial.uniforms['wave'].value = this.wave;
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render);
    }
}

window.ThreeApp = ThreeApp;

