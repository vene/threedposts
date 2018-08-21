function saveArrayBuffer( buffer, filename ) {
    var blob = new Blob( [ buffer ], { type: 'application/octet-stream' } );
    var link = document.getElementById( 'download' );
	link.href = URL.createObjectURL( blob );
	link.download = filename;
}

function makeScene() {
    var geometry = new THREE.Geometry(); 
        
    var nverts = n * m;
    for (var k = 0; k < nverts; ++k) {
        var newvert = new THREE.Vector3(data.x[k], data.y[k], data.z[k]);
        geometry.vertices.push(newvert);
    }
        
    var color = new THREE.Color('tomato');

    for (var j = 0; j < m - 1; j++) {
        for (var i = 0; i < n - 1; i++) { 
            var n0 = j * n + i;
            var n1 = n0 + 1;
            var n2 = (j+1) * n + i + 1;
            var n3 = n2 - 1;
            face1 = new THREE.Face3(n0, n1, n2, undefined, color);
            face2 = new THREE.Face3(n2, n3, n0, undefined, color);
            geometry.faces.push(face1);
            geometry.faces.push(face2);
        }
    }

    // Compute normals for shading
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
        
    var material = new THREE.MeshLambertMaterial( {
        side: THREE.DoubleSide,
        color: 0xffffff,
        vertexColors: THREE.FaceColors,
        emissive: 0x111111,
    });
        
    var scene = new THREE.Scene();
    scene.add( new THREE.Mesh( geometry, material ) );
    return scene;
}

var scene = makeScene();

var exporter = new THREE.GLTFExporter();
var options = {
	trs: false,
	onlyVisible: false,
	truncateDrawRange: false,
	binary: true,
	forceIndices: true,  // for Facebook
	forcePowerOfTwoTextures: false  // for Facebook
};

exporter.parse( scene, function ( glb ) {
    saveArrayBuffer( glb, 'scene.glb' );
}, options );
