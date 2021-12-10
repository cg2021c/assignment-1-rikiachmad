var canvas;
var gl;
// flattened points and colors to be sent to Vertex Shader
var points = [];
var colors = [];
var points2 = [];
var colors2 = [];
var pointsC = [];
var colorsC = [];
var normals = [];
var normals2 = [];
// rotation stuff
var theta = [ 140, 0, 0 ];
var theta2 = [ -5, 0, 0 ];
var theta3 = [ 30, 5, 0 ];

var thetaLoc;   // rotation uniform
var cyl_vertices, cyl_colors;
var cyl_vertices2, cyl_colors2;
var NumSides = 50;

function main(){
    // Access the canvas through DOM: Document Object Model
    canvas = document.getElementById('myCanvas');   // The paper
    gl = canvas.getContext('webgl');                // The brush and the paints

    // Gelas Kiri
    var x, z;
    var angle = 0;
    var inc = Math.PI * 2.0 / NumSides;

    cyl_vertices = new Array(NumSides * 2);
    cyl_colors   = new Array(NumSides * 2);

   // alt_colors = [[1.0, 0.5, 0.5, 1.0], [0.5, 1.0, 0.5, 1.0], [0.5, 0.5, 1.0, 1.0]];
    alt_colors = [[1.0, 1, 1, 1], [1.0, 1, 1, 1], [1.0, 1, 1, 1]];
    for(var i_side = 0; i_side < NumSides; i_side++) {
        x = 0.5 * Math.cos(angle);
        z = 0.5 * Math.sin(angle);

        cyl_vertices[i_side] = vec3(x, 0.8, z);
        cyl_colors[i_side] = alt_colors[i_side%3];

        cyl_vertices[i_side+NumSides] = vec3(x, -0.8, z);
        cyl_colors[i_side+NumSides] = alt_colors[i_side%3];

        angle += inc;
    }

    for(var i_side = 0; i_side < NumSides-1; i_side++) {
        quad(i_side+1, i_side, NumSides+i_side, NumSides+i_side+1, points, colors,cyl_vertices, normals);
    }
    quad(0, NumSides-1, 2*NumSides-1, NumSides, points, colors,cyl_vertices, normals);

    // Gelas Kanan
    var x2, z2;
    var angle2 = 0;

    cyl_vertices2 = new Array(NumSides * 2);
    cyl_colors2   = new Array(NumSides * 2);

    alt_colors2 = [[1.0, 1, 1, 1], [1.0, 1, 1, 1], [1.0, 1, 1, 1]];
    for(var i_side = 0; i_side < NumSides; i_side++) {
        x2 = 0.5 * Math.cos(angle2);
        z2 = 0.5 * Math.sin(angle2);

        cyl_vertices2[i_side] = vec3(x2, 0.8, z2);
        cyl_colors2[i_side] = alt_colors[i_side%3];

        cyl_vertices2[i_side+NumSides] = vec3(x2, -0.8, z2);
        cyl_colors2[i_side+NumSides] = alt_colors[i_side%3];

        angle2 += inc;
    }

    for(var i_side = 0; i_side < NumSides-1; i_side++) {
        quad(i_side+1, i_side, NumSides+i_side, NumSides+i_side+1, points2, colors2, cyl_vertices2, normals2);
    }
    quad(0, NumSides-1, 2*NumSides-1, NumSides, points2, colors2, cyl_vertices2, normals2);

    var len = 6 * NumSides;
    // Cube
    colorCube();

    var vertices = [...points, ...points2, ...pointsC];
    var totcolors = [...colors, ...colors2, ...colorsC];
    var totnormals = [...normals, ...normals2];
    var cubeLen = pointsC.length;

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(totnormals), gl.STATIC_DRAW);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(totcolors), gl.STATIC_DRAW );

    var vertexShaderSource = `
    attribute  vec4 vPosition;
    attribute  vec4 vColor;
    attribute  vec3 vNormal;
    varying vec3 vPositionDiffuse;

    varying vec4 fColor;
    varying vec3 fNormal;

    uniform vec3 theta;
    uniform mat4 u_matrix;
    uniform mat4 uView;
    void main() {
        // Compute the sines and cosines of theta for each of
        //   the three axes in one computation.
        vec3 angles = radians( theta );
        vec3 c = cos( angles );
        vec3 s = sin( angles );
    
        // Remeber: thse matrices are column-major
        mat4 rx = mat4( 1.0,  0.0,  0.0, 0.0,
                        0.0,  c.x,  s.x, 0.0,
                        0.0, -s.x,  c.x, 0.0,
                        0.0,  0.0,  0.0, 1.0 );
    
        mat4 ry = mat4( c.y, 0.0, -s.y, 0.0,
                        0.0, 1.0,  0.0, 0.0,
                        s.y, 0.0,  c.y, 0.0,
                        0.0, 0.0,  0.0, 1.0 );
    
    
        mat4 rz = mat4( c.z, -s.z, 0.0, 0.0,
                        s.z,  c.z, 0.0, 0.0,
                        0.0,  0.0, 1.0, 0.0,
                        0.0,  0.0, 0.0, 1.0 );
        float scale = 0.5;
        mat4 dilationMatrix = mat4(
            scale, 0., 0., 0.,
            0., scale, 0., 0.,
            0., 0., scale, 0.,
            0., 0., 0., 1.
        );

        fColor = vColor;
        fNormal = vNormal;
        gl_Position = dilationMatrix * rz * ry * rx * u_matrix * vPosition;
        vPositionDiffuse = (u_matrix * vPosition).xyz;
     } 
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vPositionDiffuse;
        varying vec4 fColor;
        varying vec3 fNormal;
        uniform vec3 uAmbientConstant;   // Represents the light color
        uniform float uAmbientIntensity;
        uniform vec3 uDiffuseConstant;  // Represents the light color
        uniform vec3 uLightPosition;
        uniform mat3 uNormalModel;
        uniform vec3 uSpecularConstant; // Represents the light color
        uniform float uShininessConstant;
        uniform vec3 uViewerPosition;
        void main() {
            // Calculate the ambient effect
            vec3 ambient = uAmbientConstant * uAmbientIntensity;

            // Calculate the diffuse effect
            vec3 normalizedNormal = normalize(fNormal);
            vec3 vLight = uLightPosition - vPositionDiffuse;
            vec3 normalizedLight = normalize(vLight);
            vec3 diffuse = vec3(0., 0., 0.);

            float cosTheta = max(dot(normalizedNormal, normalizedLight), 0.);

            // Prepare the specular components
            vec3 vReflector = 2.0 * cosTheta * fNormal - (vLight);
            vec3 vViewer = uViewerPosition - vPositionDiffuse;

            vec3 normalizedViewer = normalize(vViewer);
            vec3 normalizedReflector = normalize(vReflector);
            float cosPhi = max(dot(normalizedViewer, normalizedReflector), 0.);

            vec3 specular = vec3(0., 0., 0.);

            // Calculate the phong reflection effect
            if (cosTheta > 0.) {
                diffuse = uDiffuseConstant * cosTheta;
            }
            if (cosPhi > 0.) {
                specular = uSpecularConstant * pow(cosPhi, uShininessConstant);
            }

            vec3 phong = ambient + diffuse + specular;

            // Apply the shading
            vec3 resColor = vec3(fColor);
            gl_FragColor = vec4(resColor * phong, 1.);
        }
    `;
    
    // Create .c in GPU
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    // Compile .c into .o
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Prepare a .exe shell (shader program)
    var shaderProgram = gl.createProgram();

    // Put the two .o files into the shell
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    // Link the two .o files, so together they can be a runnable program/context.
    gl.linkProgram(shaderProgram);

    // Start using the context (analogy: start using the paints and the brushes)
    // gl.useProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var vColor = gl.getAttribLocation( shaderProgram, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( shaderProgram, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var vNormal = gl.getAttribLocation( shaderProgram, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    thetaLoc = gl.getUniformLocation(shaderProgram, "theta"); 
    
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
  //  gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    const uAmbientConstant = gl.getUniformLocation(shaderProgram, "uAmbientConstant");
    const uAmbientIntensity = gl.getUniformLocation(shaderProgram, "uAmbientIntensity");

    // DIFFUSE
    var uDiffuseConstant = gl.getUniformLocation(shaderProgram, "uDiffuseConstant");
    var uLightPosition = gl.getUniformLocation(shaderProgram, "uLightPosition");
    //var uNormalModel = gl.getUniformLocation(shaderProgram, "uNormalModel");

    var cameraX = 0.0;
    var cameraY = 0.0
    var cameraZ = 0.0;

    // SPECULAR
    var uSpecularConstant = gl.getUniformLocation(shaderProgram, "uSpecularConstant");
    var uViewerPosition = gl.getUniformLocation(shaderProgram, "uViewerPosition");
    var uShininessConstant = gl.getUniformLocation(shaderProgram, "uShininessConstant");
    
    function render()
    {
        gl.enable(gl.DEPTH_TEST);
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

       
        const u_matrix = gl.getUniformLocation(shaderProgram, "u_matrix");
           // Lighting and Shading

        
        const leftObject = [1., 0., 0., 0.,
                0., 1., 0., 0.,
                0., 0., 1., 0.,
                -1.2, 0, 0, 1.];

        const rightObject = [1., 0., 0., 0.,
            0., 1., 0., 0.,
            0., 0., 1., 0.,
            1.2, 0, 0, 1.];

        const cubeObject = [1., 0., 0., 0.,
            0., 1., 0., 0.,
            0., 0., 1., 0.,
            0, 0, 0, 1.];

        gl.uniform3fv(uDiffuseConstant, [1.0, 1.0, 1.0]);   // white light
        gl.uniform3fv(uLightPosition, [6.0, -2.0, 0.0]); // light position
        gl.uniform3fv(thetaLoc, theta);
        gl.uniform3fv(uAmbientConstant, [1.0, 1.0, 1.0]); // white light
        gl.uniform1f(uAmbientIntensity, 0.293); // 29% of light
        gl.uniform3fv(uSpecularConstant, [1.0, 1.0, 1.0]);  // white light
        gl.uniform3fv(uViewerPosition, [cameraX, cameraY, cameraZ]);
        gl.uniform1f(uShininessConstant, 7.0); // Plastic object
        gl.uniformMatrix4fv(u_matrix, false, leftObject);
        gl.drawArrays( gl.TRIANGLES, 0, len );
        
        gl.uniform3fv(uDiffuseConstant, [1.0, 1.0, 1.0]);   // white light
        gl.uniform3fv(uLightPosition, [-6.0, 2.0, 0.0]); // light position
        gl.uniform3fv(thetaLoc, theta2);
        gl.uniform3fv(uAmbientConstant, [1.0, 1.0, 1.0]); // white light
        gl.uniform1f(uAmbientIntensity, 0.293); // 29% of light
        gl.uniform3fv(uSpecularConstant, [1.0, 1.0, 1.0]);  // white light
        gl.uniform3fv(uViewerPosition, [cameraX, cameraY, cameraZ]);
        gl.uniform1f(uShininessConstant, 150.0); // Metal object
        gl.uniformMatrix4fv(u_matrix, false, rightObject);
        gl.drawArrays( gl.TRIANGLES, len, len );
        
        gl.uniform3fv(thetaLoc, theta3);
        gl.uniform3fv(uAmbientConstant, [1.0, 1.0, 1.0]); // white light
        gl.uniform1f(uAmbientIntensity, 1); // 100% of light
        gl.uniformMatrix4fv(u_matrix, false, cubeObject);
        gl.drawArrays( gl.TRIANGLES, 2 * len, cubeLen );
        requestAnimationFrame( render );
    }
    render();
}

function quad(a, b, c, d, points, colors, cyl_vertices, normals) 
{
    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];
     //var democolors = [ [0,0,0,1], [1,0,0,1], [1,1,0,1], [0,1,0,1], [0,0,1,1], [1,0,1,1] ];
     var democolors = [ [1, 1,1, 1], [1, 1,1, 1], [1, 1,1, 1], [1, 1,1, 1], [1, 1,1, 1], [1, 1,1, 1] ];

   var normalX;
   var normalY;
   var normalZ;
   // p3 = c , p1 = a, p2 = b --> A = p3 - p2
   // A = c - a
   var Ax = cyl_vertices[indices[2]][0] - cyl_vertices[indices[0]][0];
   var Ay = cyl_vertices[indices[2]][1] - cyl_vertices[indices[0]][1];
   var Az = cyl_vertices[indices[2]][2] - cyl_vertices[indices[0]][2];

   // B = b - a
   var Bx = cyl_vertices[indices[1]][0] - cyl_vertices[indices[0]][0];
   var By = cyl_vertices[indices[1]][1] - cyl_vertices[indices[0]][1];
   var Bz = cyl_vertices[indices[1]][2] - cyl_vertices[indices[0]][2];

   normalX = Ay * Bz - Az * By;
   normalY = Az * Bx - Ax * Bz;
   normalZ = Ax * By - Ay * Bx;

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( cyl_vertices[indices[i]] );
        //colors.push( cyl_colors[indices[i]] );
        colors.push( democolors[i] );
        normals.push(vec3(normalX, normalY, normalZ));
    }
}

function colorCube()
{
    square( 1, 0, 3, 2 );
    square( 2, 3, 7, 6 );
    square( 3, 0, 4, 7 );
    square( 6, 5, 1, 2 );
    square( 4, 5, 6, 7 );
    square( 5, 4, 0, 1 );
}

function square(a, b, c, d) 
{
    var verticesC = [
        vec3( -0.25, -0.25,  0.25 ),
        vec3( -0.25,  0.25,  0.25 ),
        vec3(  0.25,  0.25,  0.25 ),
        vec3(  0.25, -0.25,  0.25 ),
        vec3( -0.25, -0.25, -0.25 ),
        vec3( -0.25,  0.25, -0.25 ),
        vec3(  0.25,  0.25, -0.25 ),
        vec3(  0.25, -0.25, -0.25 )
    ];

    var vertexColors = [
        [ 1, 1, 1, 1.0 ],  // white
		[ 1, 1, 1, 1.0 ],  // white
        [ 1, 1, 1, 1.0 ],  // white
        [ 1, 1, 1, 1.0 ],  // white
        [ 1, 1, 1, 1.0 ],  // white
		[ 1, 1, 1, 1.0 ],  // white
        [ 1, 1, 1, 1.0 ],  // white
        [ 1, 1, 1, 1.0 ],   // white
    ];

    // Partion the square into two triangles in order for
    // WebGL to be able to render it.      
    // Vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        pointsC.push( verticesC[indices[i]] );
        colorsC.push( vertexColors[indices[i]] );
    
        //for solid colored faces use 
        //colorsC.push(vertexColors[a]);    
    }
}