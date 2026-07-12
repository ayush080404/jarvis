export const earthVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;

  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const earthFragmentShader = /* glsl */ `
  uniform sampler2D dayTexture;
  uniform sampler2D nightTexture;
  uniform sampler2D specularTexture;
  uniform sampler2D normalTexture;
  uniform vec3 sunDirection;

  varying vec2 vUv;
  varying vec3 vNormalW;

  void main() {
    vec3 dayColor = texture2D(dayTexture, vUv).rgb;
    vec3 nightColor = texture2D(nightTexture, vUv).rgb;
    float oceanMask = texture2D(specularTexture, vUv).r;
    float relief = texture2D(normalTexture, vUv).b;

    float sunAmount = dot(normalize(vNormalW), normalize(sunDirection));
    float dayMix = smoothstep(-0.12, 0.18, sunAmount);

    vec3 litDay = dayColor * mix(0.9, 1.08, relief);
    vec3 litNight = nightColor * 1.5;
    vec3 color = mix(litNight, litDay, dayMix);

    float specAngle = pow(max(sunAmount, 0.0), 20.0);
    color += vec3(0.65, 0.78, 1.0) * specAngle * oceanMask * dayMix * 0.55;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const atmosphereVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const atmosphereFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    float intensity = pow(0.65 - dot(vNormal, normalize(vViewPos)), 3.0);
    gl_FragColor = vec4(0.35, 0.65, 1.0, 1.0) * clamp(intensity, 0.0, 1.0);
  }
`;
