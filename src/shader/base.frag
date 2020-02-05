varying vec3 vNormal;
const float PI = 3.1415926;
const vec3  LIGHT = normalize(vec3(1.0, 1.0, 0.5));
void main(){
    float l = dot(vNormal, LIGHT) * 0.25 + 0.75;
    gl_FragColor = vec4(vec3(l), 1.0);
}
