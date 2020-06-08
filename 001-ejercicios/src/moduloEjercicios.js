import basededatos from './basededatos';

/**
 * Obtiene la lista de materias aprobadas (nota >= 4) para el nombre de alumno dado.
 * En caso de no existir el alumno, devolver undefined.
 * En caso de que no encuentre ninguna materia para el alumno, devuelve un array vacio []
 * Ejemplo del formato del resultado suponiendo que el alumno cursa dos materias y tiene mas de 4.
 *  [
    {
      id: 1,
      nombre: 'Análisis matemático',
      profesores: [1, 2],
      universidad: 1,
    },
    {
      id: 2,
      nombre: 'Corte y confección de sabanas',
      profesores: [3],
      universidad: 2,
    }
  ]
 * @param {nombreAlumno} nombreAlumno
 */
export const materiasAprobadasByNombreAlumno = (nombreAlumno) => {
  // Ejemplo de como accedo a datos dentro de la base de datos

  let idAlumno = basededatos.alumnos.find(alumno => alumno.nombre === nombreAlumno).id;
  let materiasDescripcion = []

  for (let j = 0; j<basededatos.calificaciones.length; j++)
  {
    if (basededatos.calificaciones[j].alumno === idAlumno && basededatos.calificaciones[j].nota >=4)
        materiasDescripcion[materiasDescripcion.length] = basededatos.materias.find(materia => materia.id === basededatos.calificaciones[j].materia);
  }
  
  return [materiasDescripcion];
};

/**
 * Devuelve informacion ampliada sobre una universidad.
 * Si no existe la universidad con dicho nombre, devolvemos undefined.
 * Ademas de devolver el objeto universidad,
 * agregar la lista de materias dictadas por la universidad y
 * tambien agrega informacion de los profesores y alumnos que participan.
 * Ejemplo de formato del resultado (pueden no ser correctos los datos en el ejemplo):
 *{
      id: 1,
      nombre: 'Universidad del Comahue',
      direccion: {
        calle: 'Av. Siempre viva',
        numero: 2043,
        provincia: 'Neuquen',
      },
      materias: [
        {
          id: 1,
          nombre: 'Análisis matemático',
          profesores: [1, 2],
          universidad: 1,
        },
        {
          id: 4,
          nombre: 'Programación orientada a objetos',
          profesores: [1, 3],
          universidad: 1,
        },
      ],
      profesores:[
        { id: 1, nombre: 'Jorge Esteban Quito' },
        { id: 2, nombre: 'Marta Raca' },
        { id: 3, nombre: 'Silvia Torre Negra' },
      ],
      alumnos: [
         { id: 1, nombre: 'Rigoberto Manchu', edad: 22, provincia: 1 },
         { id: 2, nombre: 'Alina Robles', edad: 21, provincia: 2 },
      ]
    }
 * @param {string} nombreUniversidad
 */
export const expandirInfoUniversidadByNombre = (nombreUniversidad) => {
  // identifico la universidad
  let uni = basededatos.universidades.find((universidad)=>universidad.nombre===nombreUniversidad);
  
  // obtengo las materias asociadas
  uni.materias = materiasByUni(uni.id); // Creo una propiedad para alojar las materias de la uni

  // obtengo los profesores asociados a las materias de la uni
  uni.profesores = profesoresByMaterias(uni.materias); // Creo una propiedad para alojar los profesores de la uni

  // obtengo los alumnos asociados
  uni.alumnos = alumnosByMaterias(uni.materias); // Creo una propiedad para alojar los alumnos de la uni


  return {uni};
};

const materiasByUni = (universidadId) =>
{
  let materias = [];
  for (let i=0; i<basededatos.materias.length; i++)
  {
    if (basededatos.materias[i].universidad === universidadId)
      materias.push(basededatos.materias[i]);
  }
  return materias;
}


const profesoresByMaterias = (materias) =>
{
  let profesores = [];
  let profeTemp;

  // recorro las materias de la uni
  for (let i=0; i<materias.length; i++)
  {
    // recorro los profes de la materia
    for (let j=0; j<materias[i].profesores.length; j++)
    {
      // por cada profe verifico si no existe ya en el array que retornaré así evito los duplicados
      profeTemp = basededatos.profesores.find((profesor)=>profesor.id === materias[i].profesores[j]);
      if (profesores.indexOf(profeTemp) === -1)
      {
          profesores.push(profeTemp);
      }
    }
  }
  return profesores;
}


const alumnosByMaterias = (materias) =>
{
  let alumnos = [];
  let calificacionesTemp = [];
  let alumnoTemp;

  // recorro las materias de la uni
  for (let i=0; i<materias.length; i++)
  {
    calificacionesTemp = basededatos.calificaciones.filter((calificacion)=>calificacion.materia === materias[i].id)
    // console.log("Calificaciones de la materia " + materias[i].nombre + ": ");
    // console.log(calificacionesTemp)
    // recorro las calificaciones de la materia para sacar los alumnos
    for (let j=0; j<calificacionesTemp.length; j++)
    {
      // por cada calificacion verifico si el alumno no existe ya en el array que retornaré así evito los duplicados
      alumnoTemp = basededatos.alumnos.find((alumno)=>alumno.id === calificacionesTemp[j].alumno);
      if (alumnos.indexOf(alumnoTemp) === -1)
      {
          alumnos.push(alumnoTemp);
          // console.log("Alumno: "+ alumnoTemp.nombre + " se agrega dentro de la lista: " + alumnos);
      } 
    }
  }
  return alumnos;
}

// /**
//  * Devuelve el promedio de edad de los alumnos.
//  */
// export const promedioDeEdad = () => {
//   return [];
// };

// /**
//  * Devuelve la lista de alumnos con promedio mayor al numero pasado
//  * por parametro.
//  * @param {number} promedio
//  */
// export const alumnosConPromedioMayorA = (promedio) => {
//   return [];
// };

// /**
//  * Devuelve la lista de materias sin alumnos
//  */
// export const materiasSinAlumnosAnotados = () => {
//   return [];
// };

// /**
//  * Devuelve el promdedio de edad segun el id de la universidad.
//  * @param {number} universidadId
//  */
// export const promedioDeEdadByUniversidadId = (universidadId) => {
//   return [];
// };
