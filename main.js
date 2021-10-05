function main() {
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("myCanvas");
  /** @type {WebGLRenderingContext} */
  var gl = canvas.getContext("webgl");

  //Gelas Kiri
  var cup1 = [];
  var color = 211 / 255;
  var color2 = 170 / 255;
  var c1_y1 = 0.3;
  var c1_y2 = 0.3;
  var c1_x1 = 0.5;
  var c1_x2 = 0.5;
  for (var i = 0; i <= 180; i += 1) {
    var j = ((i + 270) * Math.PI) / 180;
    var k = ((i + 271) * Math.PI) / 180;
    var v1 = [
      Math.sin(j) * 0.175 - c1_x1,
      Math.cos(j) * 0.05 + c1_y1,
      color2,
      color2,
      color2,
    ];

    var v2 = [-c1_x1, c1_y1, color2, color2, color2];

    var v3 = [
      Math.sin(k) * 0.175 - c1_x1,
      Math.cos(k) * 0.05 + c1_y1,
      color2,
      color2,
      color2,
    ];

    cup1 = cup1.concat(v1);
    cup1 = cup1.concat(v2);
    cup1 = cup1.concat(v3);
  }

  for (var i = 90; i <= 270; i += 1) {
    var j = (i * Math.PI) / 180;
    var k = ((i + 1) * Math.PI) / 180;
    var v1 = [
      Math.sin(j) * 0.175 - c1_x2,
      Math.cos(j) * 0.1 - c1_y2,
      color,
      color,
      color,
    ];

    var v2 = [-c1_x2, -c1_y2, color, color, color];

    var v3 = [
      Math.sin(k) * 0.175 - c1_x2,
      Math.cos(k) * 0.1 - c1_y2,
      color,
      color,
      color,
    ];

    cup1 = cup1.concat(v1);
    cup1 = cup1.concat(v2);
    cup1 = cup1.concat(v3);
  }

  var A = cup1.slice(180 * 5 * 3, 180 * 5 * 3 + 5);
  var B = cup1.slice(181 * 5 * 3, 181 * 5 * 3 + 5);
  var C = cup1.slice(5, 10);
  var D = cup1.slice(361 * 5 * 3, 361 * 5 * 3 + 5);
  var E = cup1.slice(0 * 5 * 3, 0 * 5 * 3 + 5);

  cup1 = cup1.concat(A);
  cup1 = cup1.concat(B);
  cup1 = cup1.concat(C);
  cup1 = cup1.concat(B);
  cup1 = cup1.concat(C);
  cup1 = cup1.concat(D);
  cup1 = cup1.concat(C);
  cup1 = cup1.concat(D);
  cup1 = cup1.concat(E);

  var cup2 = [];
  var c2_x1 = 0.5;
  var mul=0.280;

  // Gelas Kanan
  // Gelas atas luar
  for(var i = 0; i<=180; i+=1)
  {
      var j = (i + 270) / 180;
      var k = (i+ 271) / 180;
      var vertex_1 = [
        Math.sin(Math.PI * j) * mul + c2_x1 , Math.cos(Math.PI *j) * 0.10 + 0.5, 
          0.88, 0.87, 0.87,
      ];
  
      var vertex_2 = [
          0.5, c2_x1, 
          0.88, 0.87, 0.87,
      ];
  
      var vertex_3 = [
          Math.sin(Math.PI *k) * mul + c2_x1 , Math.cos(Math.PI *k) * 0.10 + 0.5, 
          0.88, 0.87, 0.87,
      ];
  
      cup2 = cup2.concat(vertex_1, vertex_2, vertex_3);
  }
  
  
  // Gelas bawah luar
  var cup2_x2=0.5;
  var cup2_y2=-0.09;
  var cup2_mult=0.190;
  var cup2_cs=0.15;
  var colorr=0.7;
  for(var i = 90; i<=270; i+=1)
  {
      var j = i   / 180;
      var k = (i+1)   / 180;
      var vertex_1 = [
          Math.sin(Math.PI *j) * cup2_mult + cup2_x2 , Math.cos(Math.PI *j) * cup2_cs- cup2_y2, 
          colorr, colorr, colorr,
      ];
  
      var vertex_2 = [
        cup2_x2, -cup2_y2, 
        colorr, colorr, colorr,
      ];
  
      var vertex_3 = [
          Math.sin(Math.PI *k) * cup2_mult + cup2_x2 , Math.cos(Math.PI *k) * cup2_cs - cup2_y2, 
          colorr, colorr, colorr,
      ];
  
      cup2 = cup2.concat(vertex_1, vertex_2, vertex_3);
  }
  
  var A = cup2.slice(180*5*3, 180*5*3+5);
  var B = cup2.slice(181*5*3, 181*5*3+5);
  var C = cup2.slice(5, 10);
  var D = cup2.slice(361*5*3, 361*5*3+5);
  var E = cup2.slice(0*5*3, 0*5*3+5);
  
  cup2 = cup2.concat(A, B, C);
  cup2 = cup2.concat(B, C, D);
  cup2 = cup2.concat(C, D, E);
  
  var c2_xd1=0.5;
  var c2_xd2=0.5;
 
  for(var i = 0; i<=180; i+=1)
  {
      var j = (i + 270) / 180;
      var k = (i+ 271) / 180;
      var vertex_1 = [
          Math.sin(Math.PI *j) * 0.280 + c2_xd1 , Math.cos(Math.PI *j) * 0.10 +c2_xd2, 
          colorr, colorr, colorr,
      ];
  
      var vertex_2 = [
        c2_xd1, c2_xd2, 
        colorr, colorr, colorr,
      ];
  
      var vertex_3 = [
          Math.sin(Math.PI *k) * 0.280 + c2_xd1 , Math.cos(Math.PI *k) * 0.10 + c2_xd2, 
          colorr, colorr, colorr,
      ];
  
      cup2 = cup2.concat(vertex_1, vertex_2, vertex_3);
  }
  var mult1=0.280;
  var mult2=0.350;
  var coloran=0.78;
  // Gelas atas dalam
  for(var i = 90; i<=450; i+=1)
  {
      var j = (i + 180) / 180;
      var k = (i+ 181) / 180;
      var vertex_1 = [
          Math.sin(Math.PI *j) * mult1 + 0.5 , Math.cos(Math.PI *j) * mult2 + 0.5, 
          coloran, coloran, coloran,
      ];
  
      var vertex_2 = [
          0.5, 0.5, 
          coloran, coloran, coloran,
      ];
  
      var vertex_3 = [
        Math.sin(Math.PI *k) * mult1 + 0.5 , Math.cos(Math.PI *k) * mult2 + 0.5, coloran, coloran, coloran,
      ];
  
      cup2 = cup2.concat(vertex_1, vertex_2, vertex_3);
  }

  var mult11=0.180;
  var mult22=0.20;
  var cup2_color=0.85;
  var cup2Y=0.43;
  for(var i = 90; i<=450; i+=1)
  {
      var j = (i + 180) / 180;
      var k = (i+ 181) / 180;
      var vertex_1 = [
          Math.sin(Math.PI *j) * mult11 + 0.5 , Math.cos(Math.PI *j) * mult22 + cup2Y, 
          cup2_color, cup2_color, cup2_color,
      ];
  
      var vertex_2 = [
          0.5, 0.5, 
          cup2_color, cup2_color, cup2_color,
      ];
  
      var vertex_3 = [
        Math.sin(Math.PI *k) * mult11 + 0.5 , Math.cos(Math.PI *k) * mult22 + cup2Y, cup2_color, cup2_color, cup2_color,
      ];
  
      cup2 = cup2.concat(vertex_1, vertex_2, vertex_3);
  }
  
  var vertices = [...cup1, ...cup2];
  var cup1_len = cup1.length / 5;
  var cup2_len = cup2.length / 5;
  

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var vertexShaderCode = `
  attribute vec2 aPosition;
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform mat4 u_matrix;

  void main(){
      gl_Position = u_matrix * vec4(aPosition, 0, 1);
      vColor = aColor;
  }`;

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderCode);
  gl.compileShader(vertexShader);

  var compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
  if (!compiled) {
    console.error(gl.getShaderInfoLog(vertexShader));
  }

  var fragmentShaderCode = `
  precision mediump float;
  varying vec3 vColor;

  void main(){
      gl_FragColor = vec4(vColor, 1.0);
  }
  `;

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderCode);
  gl.compileShader(fragmentShader);

  compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
  if (!compiled) {
    console.error(gl.getShaderInfoLog(fragmentShader));
  }

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  var linked = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
  if (!linked) {
    console.error(gl.getProgramInfoLog(shaderProgram));
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  var aPosition = gl.getAttribLocation(shaderProgram, `aPosition`);
  gl.vertexAttribPointer(
    aPosition,
    2,
    gl.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.enableVertexAttribArray(aPosition);

  var aColor = gl.getAttribLocation(shaderProgram, `aColor`);
  gl.vertexAttribPointer(
    aColor,
    3,
    gl.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(aColor);

  let change = 0;
  let speed = 0.0093;
  let turn = 0.15;
  let back = 0.82;
  function drawScene() {
    if (change >= turn || change <= -back) speed = -speed;
    change += speed;
    gl.useProgram(shaderProgram);
    const leftObject = [
      1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
      1.0,
    ];

    const rightObject = [
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      change,
      0.0,
      1.0,
    ];

    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const u_matrix = gl.getUniformLocation(shaderProgram, "u_matrix");
    gl.uniformMatrix4fv(u_matrix, false, leftObject);

    gl.drawArrays(gl.TRIANGLES, 0, cup1_len);

    gl.uniformMatrix4fv(u_matrix, false, rightObject);
    gl.drawArrays(gl.TRIANGLES, cup1_len, cup2_len);
    requestAnimationFrame(drawScene);
  }

  drawScene();
}
