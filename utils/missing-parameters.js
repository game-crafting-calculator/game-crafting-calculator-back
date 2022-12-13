//fonction de verification
//Met les attributs non valide dans un tableau et le renvoi

exports.getMissingParameter = (object) => {
  let missingParameters = []
  
  for (const key in object) {
    if (!object[key]) {
      missingParameters.push(key)
    }
  }

  return missingParameters.length > 0 ? missingParameters : false
}