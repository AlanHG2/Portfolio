import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export default function HeroShader() {
	return (
		<ShaderGradientCanvas
			style={{
				position: "absolute",
				inset: 0,
				zIndex: -1,
				pointerEvents: "none",
			}}
			pixelDensity={1.5}
			fov={45}
		>
			<ShaderGradient
				animate="on"
				axesHelper="off"
				brightness={0.9}
				cAzimuthAngle={180}
				cDistance={3.6}
				cPolarAngle={90}
				cameraZoom={1}
				color1="#000000"
				color2="#28282B"
				color3="#28282B"
				destination="onCanvas"
				embedMode="off"
				envPreset="city"
				format="gif"
				fov={45}
				frameRate={10}
				gizmoHelper="hide"
				grain="off"
				lightType="3d"
				pixelDensity={1}
				positionX={-1.4}
				positionY={0}
				positionZ={0}
				range="disabled"
				rangeEnd={40}
				rangeStart={0}
				reflection={0.1}
				rotationX={0}
				rotationY={10}
				rotationZ={50}
				shader="defaults"
				type="plane"
				uAmplitude={1}
				uDensity={1}
				uFrequency={5.5}
				uSpeed={0.1}
				uStrength={4}
				uTime={0}
				wireframe={false}
			/>
		</ShaderGradientCanvas>
	);
}
