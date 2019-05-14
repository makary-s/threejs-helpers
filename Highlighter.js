class Highlighter {
  constructor(domElement, scene, camera, texturePath = null) {
    this.pass = null;
    this.updatePass(domElement, scene, camera, texturePath);
  }

  updatePass(domElement, scene, camera, texturePath) {
    this.pass = new THREE.OutlinePass( 
      new THREE.Vector2( domElement.clientWidth, domElement.clientHeight ),
      scene,
      camera 
    );

    this.pass.overlayMaterial.blending = THREE.SubtractiveBlending // OMG!!!!
    this.pass.visibleEdgeColor.set( 0xFF - (new THREE.Color('#38ff38')).getHex() );
    this.pass.hiddenEdgeColor.set( 0xFF - (new THREE.Color('#daedda')).getHex() );
    this.pass.pulsePeriod = 1.5;  // 2
    this.pass.edgeStrength = 8;  // 3
    this.pass.edgeThickness = 1; // 1

    if (texturePath) {
      var loader = new THREE.TextureLoader();
      loader.load( texturePath, function ( texture ) {
        this.pass.patternTexture = texture;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
      }.bind(this));
    }
  }

  add(obj) {
    this.pass.selectedObjects.push(obj);
  }

  set(obj) {
    this.pass.selectedObjects = [obj];
  }

  clear(obj) {
    this.pass.selectedObjects = [];
  }

}

module.exports = Highlighter;