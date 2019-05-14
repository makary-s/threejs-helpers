class Visibiler {
  constructor(camera) {
    this.camera = camera;

    this.obstacles = [];
    this.checkObjects = [];  // {position, [ignoreObjects]}

    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = this.camera.far || Infinity; 
    this.raycaster.near = this.camera.near || Infinity; 
  }

  addObstacles(array) {
    this.obstacles = this.obstacles.concat(array);
  }

  addObstacle(object) {
    this.obstacles.push(object);
  }

  addChecker(position, onVisible, onNotVisible, ignoreObjects = null) {
    /* 
      can pass obj
    */
    let checkObj;
    if (arguments.length = 1) {
      checkObj = arguments[0]
    } else {
      checkObj = {
        position: position,
        onVisible: onVisible,
        onNotVisible: onNotVisible,
        ignoreObjects: ignoreObjects
      }
    }
    this.checkObjects.push(checkObj);
  }

  check(position, ignoreObjects = null) {
    /* 
    position (vector3d) 
    ignoreObjects (three objects array)
    */

    let rayDirection = position.clone().sub( this.camera.position).normalize();
    this.raycaster.set(this.camera.position, rayDirection)

    let intersects = this.raycaster.intersectObjects(this.obstacles);
    let pointDistance = this.raycaster.ray.origin.distanceTo(position);

    // find intersections
    for (let inter of intersects) { // intersects sorted by distance
      if (inter.distance <= pointDistance) {
        if (!ignoreObjects) return false;
        for (let obj of ignoreObjects) {
          if (obj == inter.object) continue;
        }
        return false;
      }
      return true;
    }
    
  }

  /* UPDATE */

  update() {
    for (let checkObj of this.checkObjects) {
      let isVisible = this.check(checkObj.position, checkObj.ignoreObjects);
      if (isVisible) {
        checkObj.onVisible()
      } else {				
        checkObj.onNotVisible()
      };
    }

  }
}

module.exports = Visibiler;


    // var material = new THREE.LineBasicMaterial({ // #remove!
    //   color: 0x0000ff
    // });
    // var geometry = new THREE.Geometry();
    // geometry.vertices.push(
    //   position,
    //   this.raycaster.ray.origin
    // );
    // var line = new THREE.Line( geometry, material );
    // scene.add( line );
    
    
    // var material = new THREE.LineBasicMaterial({
    //   color: 0x00ffff
    // });
    // var geometry = new THREE.Geometry();
    // geometry.vertices.push(
    //   intersects[0].point,
    //   this.raycaster.ray.origin
    // );
    // var line = new THREE.Line( geometry, material );
    // scene.add( line );