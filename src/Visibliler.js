class Visibiler {
  constructor(camera) {
    this.camera = camera;

    this.obstacles = [];
    this.checkObjects = [];  // {position, [ignoreObjects]}

    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = this.camera.far || Infinity; 
    this.raycaster.near = this.camera.near || Infinity; 
  }

  addObstacles(obj) {
    if (obj instanceof Array) {
      for (var i = 0, len = obj.length; i < len; i++) {
        this.obstacles.push(obj[i]);
      }
    } else {
      this.obstacles.push(obj);
    }
  }

  clearObstacles(obj) {
    this.obstacles = [];
  }

  addChecker(position, onVisible, onHidden, ignored = null) {
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
        onHidden: onHidden,
        ignored: ignored
      }
    }
    this.checkObjects.push(checkObj);
  }

  check(position, ignoreObjects = null) {
    /* 
    position (vector3d) 
    ignored (three objects array)
    */

    let rayDirection = position.clone().sub( this.camera.position).normalize();
    this.raycaster.set(this.camera.position, rayDirection)

    let intersects = this.raycaster.intersectObjects(this.obstacles);
    let pointDistance = this.raycaster.ray.origin.distanceTo(position);

    // find intersections
    for (let inter of intersects) { // intersects sorted by distance
      if (inter.distance <= pointDistance) {
        if (!ignored) return false;
        for (let obj of ignored) {
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
        checkObj.onHidden()
      };
    }

  }
}

module.exports = Visibiler;