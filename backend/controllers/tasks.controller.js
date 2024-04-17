import { pool } from "../db.js"
import Papa from 'papaparse'
import fs from 'fs';


export const getLines = async (req, res) => {

  try {

    const [result] = await pool.query(
      `SELECT ID, CTO,BORNE,ESTADO,LINE_ID_FINAL,VNO_CODE_FINAL FROM datosMasivos WHERE FECHA = '2023-12-22'`)
    console.log(result)
    res.json(result)

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getLine = async (req, res) => {

  try {
    const [result] = await pool.query(
      "SELECT ID, CTO,BORNE,ESTADO,LINE_ID_FINAL,VNO_CODE_FINAL,COMENTARIO FROM datosMasivos WHERE FECHA = ?",
      [req.params.fecha]
    )
    if (result.length === 0) {
      return res.status(404).json({ message: "Dia de Timbrado no encontrado" })
    }
    res.json(result)

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

}
export const createLine = (req, res) => {
  res.send('Creando Line')
}

// export const updateLine = async (req, res) => {

//   try {
//     const result = await pool.query(
//       "UPDATE datosMasivos SET COMENTARIO = ? WHERE ID = ?",
//       [req.body, req.params.id]
//     );
//     res.json(result)
//   } catch (error) {
//     return res.status(500).json({ message: error.message })
//   }

// }

export const updateLine = async (req, res) => {
  const { LINE_ID_FINAL, VNO_CODE_FINAL, COMENTARIO } = req.body;

  try {
    const result = await pool.query(
      "UPDATE datosMasivos SET LINE_ID_FINAL = ?, VNO_CODE_FINAL = ?, COMENTARIO = ? WHERE ID = ?",
      [LINE_ID_FINAL, VNO_CODE_FINAL, COMENTARIO, req.params.id]
    );
    res.json(result);
  } catch (error) {
    console.error("Error en la actualización:", error);
    return res.status(500).json({ message: "Error en la actualización" });
  }
};


export const deleteLine = (req, res) => {
  res.send('Eliminando Line')
}

export const uploadCsv = async (req, res) => {
  try {
    // Verificar si el archivo CSV fue enviado desde el cliente
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'Archivo CSV no encontrado en la solicitud' });
    }

    // Archivo CSV enviado desde el cliente
    const file = req.files.file;

    // Leer el contenido del archivo CSV
    const csvData = fs.readFileSync(file.tempFilePath, 'utf-8');

    // Parsear el CSV con PapaParse
    Papa.parse(csvData, {
      header: false,
      complete: (result) => {
        try {
          // Procesar cada fila del CSV
          const csvRows = result.data.map((row) => {
            // Convertir valores vacíos en 0 para columnas específicas
            const columnsToConvert = [8, 9, 11, 12, 13];
            columnsToConvert.forEach((index) => {
              if (row[index] === '') {
                row[index] = 0;
              }
            });
            return row;
          });

          // Enviar los datos del CSV como respuesta
          res.status(200).json({ data: csvRows });
        } catch (error) {
          console.error('Error al procesar filas del CSV:', error);
          res.status(500).json({ error: 'Error interno del servidor al procesar filas del CSV' });
        }
      }
    });
  } catch (error) {
    console.error('Error al leer el archivo CSV:', error);
    res.status(500).json({ error: 'Error interno del servidor al leer el archivo CSV' });
  }
};

