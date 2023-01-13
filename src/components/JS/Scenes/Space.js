/*
	@Author: interpreterK (https://github.com/interpreterK)
*/

import * as cMath from '../cMath.js'
import * as Instances from '../Instances.js'
import WebGL_Scene from '../WebGL_Scene.js'

function Intro(Camera, Orbit, FadeWindow) {
    const CloseWindow = document.getElementById("Close-Prompt")
    const Intervals = []

    for (let i = 0; i <= 100; i++) {
        Intervals.push(setInterval(() => {
            //const Tween = cMath.easeOutQuad(i/13)
            Camera.position.z = cMath.lerp(0, -74, i)
            Camera.position.x = cMath.lerp(0, -68, i)
            Camera.position.y = cMath.lerp(0, -46, i)

            Camera.rotation.y = cMath.lerp(0, 2*Math.PI/4, i)

            if (Math.floor(Camera.position.z) <= 80) {
                Intervals.forEach((_, index) => {
                    clearInterval(Intervals[index])
                })
                Orbit.enabled = true
            }
        }, 20*i))
    }
    
    //cMath.FadeIn(FadeWindow)
    CloseWindow.onclick = function() {
        cMath.FadeOut(FadeWindow)
    }
}

export default function Render() {
    const TopWindow = document.getElementById("Top-Window")
    const WebGL_Div = document.getElementById('WebGL_Renderer')

    const WebGL    = WebGL_Scene(WebGL_Div)
    const Renderer = WebGL.Renderer
    const Camera   = WebGL.Camera
    const Orbit    = WebGL.Orbit
    const Scene    = WebGL.Scene

    // Shaders
    // const Bloom = Instances.Bloom(Renderer, Scene, Camera, {
    //     strength: .5,
    //     radius: .5,
    // })
    
    // The main big planet
    Instances._3D_Sphere(Scene, [15*2, 32*2, 16*2])

    const Moon = Instances._3D_Sphere(Scene, [15/2, 32, 16])
    const Moon2 = Instances._3D_Sphere(Scene, [15/5, 32, 16])
    const Moon_Object = Moon.Mesh
    const Moon2_Object = Moon2.Mesh

    // Stars and Particles
    const Particles = []
    
    for (let i = 0; i < 1000; i++) {
        const Size = cMath.RandRange(.1,2)
        const Star = Instances._3D_Box(Scene, [Size,Size,Size], 0xffffff).Mesh
        // Randomly set a position and rotation
        // Space atmosphere
        Star.position.x=cMath.RandRange(-1000,1000)
        Star.position.y=cMath.RandRange(-1000,1000)
        Star.position.z=cMath.RandRange(-1000,1000)
        Star.rotation.x=cMath.RandRange(-360,360)
        Star.rotation.y=cMath.RandRange(-360,360) 
        Star.rotation.z=cMath.RandRange(-360,360)
    }
    
    for (let i = 0; i < 500; i++) {
        const Particle = Instances._3D_Sphere(Scene, [15/50, 32, 16]).Mesh
        Particles.push({
            Object: Particle,
            y_rand: Particle.position.y-cMath.RandRange(-10,0),
            z_rand: Particle.position.z-cMath.RandRange(-30,0)
        })
    }
    
    Renderer.setAnimationLoop((deltaTime) => {
        const Angle1 = (deltaTime/(1e4*2)*Math.PI)%(2*Math.PI)
        const Angle2 = (deltaTime/4000*Math.PI)%(2*Math.PI)
        Moon_Object.position.x=Math.sin(Angle1)*40
        Moon_Object.position.y=Math.sin(Angle1)*35
        Moon_Object.position.z=Math.cos(Angle1)*40
        Moon2_Object.position.x=Moon_Object.position.x+Math.sin(Angle2)*15
        Moon2_Object.position.y=Moon_Object.position.y-Math.sin(Angle2)*10
        Moon2_Object.position.z=Moon_Object.position.z+Math.cos(Angle2)*15

        Particles.forEach((_, index) => {
            const Particle = Particles[index]
            Particle.Object.position.x=Math.sin(Angle1+index)*60
            Particle.Object.position.y=Particle.y_rand+Math.sin(Angle1+index)*50
            Particle.Object.position.z=Particle.z_rand+Math.cos(Angle1+index)*100
        })

        Renderer.render(Scene, Camera)
        // Bloom.Composer.render()
        console.log(Camera.position)
    })

    window.addEventListener("resize", () => {
        Camera.aspect = window.innerWidth/window.innerHeight
        Camera.updateProjectionMatrix()
        Renderer.setSize(window.innerWidth, window.innerHeight)
        // Bloom.Composer.setSize(window.innerWidth, window.innerHeight)
    }, false)

    Intro(Camera, Orbit, TopWindow)
}