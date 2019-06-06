class Highlighter {
  constructor(domElement, scene, camera) {
    this.pass = new THREE.OutlinePass( 
      new THREE.Vector2( domElement.clientWidth, domElement.clientHeight ),
      scene,
      camera 
    );
    this.updateStyle();
  }

  updateStyle(options) {
    var blending = options.blending || THREE.SubtractiveBlending
    var visibleEdgeColor = options.visibleEdgeColor
      || 0xFF - (new THREE.Color('#38ff38')).getHex();
    var hiddenEdgeColor = options.hiddenEdgeColor
      || 0xFF - (new THREE.Color('#daedda')).getHex();
    var pulsePeriod = options.pulsePeriod || 1.5; // 2
    var edgeStrength = options.edgeStrength || 8; // 3
    var edgeThickness = options.edgeThickness || 1; // 1
    var texturePath = options.texturePath || null;

    this.pass.overlayMaterial.blending = blending // OMG!!!!
    this.pass.visibleEdgeColor.set(visibleEdgeColor);
    this.pass.hiddenEdgeColor.set(hiddenEdgeColor);
    this.pass.pulsePeriod = pulsePeriod;  
    this.pass.edgeStrength = edgeStrength;  
    this.pass.edgeThickness = edgeThickness; 

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
    if (obj instanceof Array) {
      for (var i = 0, len = obj.length; i < len; i++) {
        this.pass.selectedObjects.push(obj[i]);
      }
    } else {
      this.pass.selectedObjects.push(obj);
    }
  }

  set(obj) {
    if (!(obj instanceof Array)) obj = [obj];
    this.pass.selectedObjects = obj;
  }

  clear(obj) {
    this.pass.selectedObjects = [];
  }

}

module.exports = Highlighter;