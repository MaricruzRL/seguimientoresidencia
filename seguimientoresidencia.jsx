import React, { useState, useEffect } from 'react';

function SeguimientoResidencia() {
  const obtenerFilasGuardadas = () => {
    const filasGuardadas = localStorage.getItem('filas');
    return filasGuardadas ? JSON.parse(filasGuardadas) : [
      { actividad: '', tiempo: 'P' },
      { actividad: '', tiempo: 'R' }
    ];
  };

  const obtenerColumnasGuardadas = () => {
    const columnasGuardadas = localStorage.getItem('columnas');
    return columnasGuardadas ? JSON.parse(columnasGuardadas) : [];
  };

  const obtenerColoresGuardados = () => {
    const coloresGuardados = localStorage.getItem('colores');
    return coloresGuardados ? JSON.parse(coloresGuardados) : Array(filas.length * columnas.length).fill('white');
  };

  const [filas, setFilas] = useState(obtenerFilasGuardadas);
  const [columnas, setColumnas] = useState(obtenerColumnasGuardadas);
  const [cellColors, setCellColors] = useState(obtenerColoresGuardados);
  const [selectedCell, setSelectedCell] = useState({ rowIndex: null, colIndex: null });

  useEffect(() => {
    localStorage.setItem('filas', JSON.stringify(filas));
  }, [filas]);

  useEffect(() => {
    localStorage.setItem('columnas', JSON.stringify(columnas));
    localStorage.setItem('colores', JSON.stringify(cellColors));
  }, [columnas, cellColors]);

  const getCellPosition = (rowIndex, colIndex) => {
    return rowIndex * columnas.length + colIndex;
  };

  const agregarFila = () => {
    const nuevasFilas = [...filas, { actividad: '', tiempo: 'P' }];
    const nuevosColores = [...cellColors];

    setFilas(nuevasFilas);

    // Ajusta el color de las nuevas celdas
    for (let i = 0; i < columnas.length; i++) {
      nuevosColores.push('white'); // Actividad (P)
      nuevosColores.push('white'); // Tiempo (R)
    }

    setCellColors(nuevosColores);
  };

  const agregarColumna = () => {
    const nuevasColumnas = [...columnas, ` ${columnas.length + 1}`];
    const nuevosColores = cellColors.map(fila => [...fila, 'white']);

    setColumnas(nuevasColumnas);
    setCellColors(nuevosColores);
  };

  const eliminarColumna = (index) => {
    if (columnas.length > 1) {
      const nuevasColumnas = [...columnas];
      const nuevosColores = [];

      for (let i = 0; i < filas.length * 2; i++) {
        const filaOriginal = cellColors.slice(i * nuevasColumnas.length, (i + 1) * nuevasColumnas.length);
        const nuevaFila = [...filaOriginal.slice(0, index), ...filaOriginal.slice(index + 1)];
        nuevosColores.push(...nuevaFila);
      }

      nuevasColumnas.splice(index, 1);

      setColumnas(nuevasColumnas);
      setCellColors(nuevosColores);
    }
  };

  const eliminarFila = (index) => {
    const nuevasFilas = [...filas];
    const nuevosColores = [...cellColors];
    nuevasFilas.splice(index, 1);

    // Elimina los colores de las celdas de la fila
    nuevosColores.splice(index * columnas.length * 2, columnas.length * 2);

    setFilas(nuevasFilas);
    setCellColors(nuevosColores);
  };

  const handleCellClick = (rowIndex, colIndex) => {
    const nuevosColores = [...cellColors];
    const cellPosition = getCellPosition(rowIndex, colIndex);
    setSelectedCell({ rowIndex, colIndex });

    if (rowIndex % 2 === 0) {
      // Para las filas de actividad (P)
      nuevosColores[cellPosition] =
        nuevosColores[cellPosition] === 'white' ? 'blue' : 'white';
    } else {
      // Para las filas de tiempo (R)
      nuevosColores[cellPosition] =
        nuevosColores[cellPosition] === 'white' ? 'red' : 'white';
    }

    setCellColors(nuevosColores);
  };

  return (
    <div>
      <table border="1">
        <thead>
          <tr bgcolor="#1a3968">
            <th>
              <font color="white">ACTIVIDAD</font>
            </th>
            <th>
              <font color="#1a3968">tiempo</font>
            </th>
            {columnas.map((nombreColumna, index) => (
              <th
                key={index}
                onClick={() => handleCellClick(0, index)}
                onDoubleClick={() => handleCellClick(0, index)}
              >
                <font color="white">{nombreColumna}</font>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <tr bgcolor="white">
                <td rowSpan={2}>
                  <font color="black">
                    <input
                      type="text"
                      className="actividad"
                      value={fila.actividad}
                      onChange={(e) => {
                        const nuevasFilas = [...filas];
                        nuevasFilas[rowIndex].actividad = e.target.value;
                        setFilas(nuevasFilas);
                      }}
                    />
                  </font>
                </td>
                <td>
                  <font color="black">{fila.tiempo}</font>
                </td>
                {columnas.map((_, colIndex) => (
                  <td
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex * 2, colIndex)}
                    onDoubleClick={() => handleCellClick(rowIndex * 2, colIndex)}
                    style={{ backgroundColor: cellColors[getCellPosition(rowIndex * 2, colIndex)] }}
                  >
                    <font color="black"></font>
                  </td>
                ))}
              </tr>
              <tr bgcolor="white">
                <td>
                  <font color="black">R</font>
                </td>
                {columnas.map((_, colIndex) => (
                  <td
                    key={colIndex + 1}
                    onClick={() => handleCellClick(rowIndex * 2 + 1, colIndex)}
                    onDoubleClick={() => handleCellClick(rowIndex * 2 + 1, colIndex)}
                    style={{ backgroundColor: cellColors[getCellPosition(rowIndex * 2 + 1, colIndex)] }}
                  >
                    <font color="white"></font>
                  </td>
                ))}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
    
      </table>
      <button onClick={agregarFila}>Agregar Actividad</button>
      <button onClick={agregarColumna}>Agregar Semana</button>
      <button onClick={() => eliminarFila(filas.length - 1)}>Eliminar Última Actividad</button>
      <button onClick={() => eliminarColumna(columnas.length - 1)}>Eliminar Última Semana</button>
    </div>
  );
}

export default SeguimientoResidencia;

