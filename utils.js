function toScreenPosition(vector3, camera, renderer) {
  var vector = vector3.clone();

  var widthHalf = 0.5 * renderer.context.canvas.width;
  var heightHalf = 0.5 * renderer.context.canvas.height;

  vector.project(camera);
  vector.x = ( vector.x * widthHalf ) + widthHalf;
  vector.y = - ( vector.y * heightHalf ) + heightHalf;

  return { 
      x: vector.x,
      y: vector.y
  };
};


function getNormRelativePosition(obj, normPos, offset = 0) {
  obj.geometry.computeBoundingBox();  //QUEST?
  let bbMin = obj.geometry.boundingBox.min;
  let bbMax = obj.geometry.boundingBox.max;

  let x = lerp(normPos[0], bbMin.x - offset, bbMax.x + offset);
  let y = lerp(normPos[1], bbMin.y - offset, bbMax.y + offset);
  let z = lerp(normPos[2], bbMin.z - offset, bbMax.z + offset);

  return new THREE.Vector3(x, y, z);
};


module.exports = { toScreenPosition, getNormRelativePosition, lerp };


