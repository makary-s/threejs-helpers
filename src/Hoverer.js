class Hoverer {
  constructor(domElement, camera) {

    this.camera = camera;
    this.objects = [];
    this.domElement = domElement;

    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = this.camera.far || Infinity; 
    this.raycaster.near = this.camera.near || Infinity; 

    this._intersected = null;
    this._mouse = new THREE.Vector2(2, 2);
    this._onMouseOver = [];
    this._onMouseOut = [];

    // bind
    this.update = this.update.bind(this);
    this.setMouse = this.setMouse.bind(this);

  }

  /* METHODS */

  add(obj) {
    if (obj instanceof Array) {
      for (var i = 0, len = obj.length; i < len; i++) {
        this.objects.push(obj[i]);
      }
    } else {
      this.objects.push(obj);
    }
  }

  clear() {
    this.objects = [];
  }

  /* UPDATES */

  setMouse(clientX, clientY) {
    let Rect = this.domElement.getBoundingClientRect();
    let x = clientX - Rect.left;
    let y = clientY - Rect.top;

    this._mouse.x = ( x / this.domElement.clientWidth ) * 2 - 1;
    this._mouse.y = - ( y / this.domElement.clientHeight ) * 2 + 1;
  }

  update() {
    this.raycaster.setFromCamera( this._mouse, this.camera );
    let intersects = this.raycaster.intersectObjects( this.objects, true );
    
    if (intersects.length > 0) {
      if ( this._intersected != intersects[ 0 ].object ) {
        if ( this._intersected  ) this._doMouseOut();
        this._intersected = intersects[0].object;
        this._doMouseOver();
      }
    } else {
      if ( this._intersected  ) {
        this._doMouseOut();
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

  _doMouseOut() {
    for (let func of this._onMouseOut) {
      func(this._intersected );
    }
  }

  _doMouseOver() {
    for (let func of this._onMouseOver) {
      func(this._intersected );
    }
  }

}

module.exports = Hoverer;
