class Hoverer {
  constructor(camera) {

    this.camera = camera;
    this.objects = [];
    
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = this.camera.far || Infinity; 
    this.raycaster.near = this.camera.near || Infinity; 

    this._intersected = null;
    this._mouse = new THREE.Vector2(2, 2);
    this._onMouseOver = [];
    this._onMouseOut = [];

    // bind
    this.updateIntersects = this.updateIntersects.bind(this);
    this.updateMouse = this.updateMouse.bind(this);

  }

  /* METHODS */

  addObject(obj) {
    this.objects.push(obj);
  }

  /* UPDATES */

  updateMouse(clientX, clientY, domElement) {
    let Rect = domElement.getBoundingClientRect();
    let x = clientX - Rect.left;
    let y = clientY - Rect.top;

    this._mouse.x = ( x / domElement.clientWidth ) * 2 - 1;
    this._mouse.y = - ( y / domElement.clientHeight ) * 2 + 1;
  }

  updateIntersects() {
    this.raycaster.setFromCamera( this._mouse, this.camera );
    let intersects = this.raycaster.intersectObjects( this.objects, true );
    
    if (intersects.length > 0) {
      if ( this._intersected != intersects[ 0 ].object ) {
        if ( this._intersected  ) this.doMouseOut();
        this._intersected = intersects[0].object;
        this.doMouseOver();
      }
    } else {
      if ( this._intersected  ) {
        this.doMouseOut();
      }
      this._intersected  = null;
    }
  }

  /* EVENTS */

  onMouseOut(func) {
    this._onMouseOut.push(func)
  }

  onMouseOver(func) {
    this._onMouseOver.push(func)
  }

  doMouseOut(func) {
    for (let func of this._onMouseOut) {
      func(this._intersected );
    }
  }

  doMouseOver(func) {
    for (let func of this._onMouseOver) {
      func(this._intersected );
    }
  }

}

module.exports = Hoverer;
