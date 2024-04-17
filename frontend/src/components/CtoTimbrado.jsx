import { useEffect, useState } from "react";
import { getLines, uploadCsv } from "../api/lines.api";
import Papa from 'papaparse';
import { DatePicker1Presentation } from "./DatePicker";
import { format } from 'date-fns';
import axios from "axios";

const CtoTimbrado = () => {

  const [lines, setLines] = useState([]);
  const [nonMassiveData, setNonMassiveData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    async function loadLines() {
      try {
        const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '2023-12-01';
        const lines = await getLines(formattedDate);
        setLines(lines);
      } catch (error) {
        console.error('Error fetching lines:', error);
      }
    }

    loadLines();
  }, [selectedDate]);

  const handleNonMassiveFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const ctoValueMatch = file.name.match(/CTO_(.*?)\.csv$/);
      const ctoValue = ctoValueMatch ? ctoValueMatch[1] : '';

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          // Ordenar los datos por la columna 'Codigo'
          result.data.sort((a, b) => a['Código'].localeCompare(b['Código']));

          const updatedData = result.data.map(row => ({
            'CTO-OSP': ctoValue,
            'Codigo': row['Código'],
            'Estado_de_ocupacion': row['Estado de ocupación'],
            'Line_ID': row['Line ID'],
            'Coincide': row['Line ID'] === '' ? '' : lines.some(line => line.LINE_ID_FINAL === row['Line ID'])
              ? 'OK'
              : 'Flotante'
          }));

          setNonMassiveData(prevData => prevData.concat(updatedData));
        },
        error: (error) => {
          console.error('Error parsing non-massive CSV:', error);
        }
      });
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // M O D A L
  // Estado para manejar la visibilidad del modal y los valores del formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedLine, setEditedLine] = useState({
    // id: null,
    lineIdFinal: "",
    vnoCodeFinal: "",
    comentario: "",
  });

  // Función para abrir el modal y establecer los valores a editar
  const handleEditClick = (id, lineIdFinal, vnoCodeFinal, comentario) => {
    setEditedLine({ id, lineIdFinal, vnoCodeFinal, comentario });
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Función para manejar cambios en el formulario del modal
  const handleModalInputChange = (e) => {
    setEditedLine({
      ...editedLine,
      [e.target.name]: e.target.value,
    });
  };

  // // Función para enviar la actualización a la API
  // const handleUpdateClick = async () => {
  //   const { id, lineIdFinal = "", vnoCodeFinal = "", comentario = "" } = editedLine;

  //   try {
  //     const result = await axios.put(`http://localhost:3000/ctoborne/${id}`, {
  //       LINE_ID_FINAL: lineIdFinal,
  //       VNO_CODE_FINAL: vnoCodeFinal,
  //       COMENTARIO: comentario,
  //     });
  //     console.log("Respuesta de la actualización:", result.data);
  //     // Puedes recargar los datos después de la actualización
  //     // o realizar otras acciones según tus necesidades.
  //   } catch (error) {
  //     console.error("Error en la actualización:", error);
  //   }

  //   // Cerrar el modal después de la actualización
  //   setIsModalOpen(false);
  // };
  // Función para enviar la actualización a la API
  const handleUpdateClick = async () => {
    const { id, lineIdFinal = "", vnoCodeFinal = "", comentario = "" } = editedLine;

    try {
      await axios.put(`http://localhost:3000/ctoborne/${id}`, {
        LINE_ID_FINAL: lineIdFinal,
        VNO_CODE_FINAL: vnoCodeFinal,
        COMENTARIO: comentario,
      });

      // Recargar los datos después de la actualización
      const updatedLines = await getLines(format(selectedDate, 'yyyy-MM-dd'));
      setLines(updatedLines);

    } catch (error) {
      console.error("Error en la actualización:", error);
    }

    // Cerrar el modal después de la actualización
    setIsModalOpen(false);
  };





  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Selecciona un archivo CSV primero');
      return;
    }
    uploadCsv(selectedFile)
      .then((data) => {
        console.log(data);
        alert(data.message);
      })
      .catch((error) => {
        console.error('Error al cargar el CSV:', error);
        alert('Error al cargar el CSV. Por favor, revisa la consola para más detalles');
      });
  };


  return (
    <>
      <div>
        <input type="file" id="file-upload" name="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload}>Subir CSV</button>
      </div>
      <div className="sticky top-0 bg-indigo-50 border-none rounded-lg w-80 container mx-auto py-6 my-8 mt-0">
        <div className="flex flex-col justify-center items-center gap-4 ">
          {/* Botón para cargar el archivo no masivo */}
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input type="file" accept=".csv" onChange={handleNonMassiveFileChange}
              className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-200 file:text-violet-700
            hover:file:bg-violet-400
            "/>
          </label>
        </div>
      </div>
      <DatePicker1Presentation setSelectedDate={handleDateChange} />
      <p>Aqui mostrar la fecha: {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'N/A'}</p>
      <div className="flex justify-center">
        <section>
          <div className="rounded-lg border border-gray-200">
            <div className="overflow-x-auto rounded-t-lg">
              <table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="ltr:text-left rtl:text-right">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">CTO_OSP</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Codigo</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Estado</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">LineID_OSP</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Coincide</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Seleccionar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {nonMassiveData.map((item, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item['CTO-OSP']}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{item['Codigo']}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{item['Estado_de_ocupacion']}</td>
                      <td className={`whitespace-nowrap px-4 py-2 ${item['Coincide'] === 'OK' ? 'text-green-500' : item['Coincide'] === 'Flotante' ? 'text-red-500' : 'text-gray-700'}`}>{item['Line_ID']}</td>
                      <td className={`whitespace-nowrap px-4 py-2 ${item['Coincide'] === 'OK' ? 'text-green-500' : item['Coincide'] === 'Flotante' ? 'text-red-500' : 'text-gray-700'}`}>{item['Coincide']}</td>
                      <td className="whitespace-nowrap px-4 py-2">
                        <input type="checkbox" className="h-3 w-3 rounded" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section>
          <div className="rounded-lg border border-gray-200">
            <div className="overflow-x-auto rounded-t-lg">
              <table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="ltr:text-left rtl:text-right">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ID</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">CTO</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">BORNE</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ESTADO</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">LINE_ID_FINAL</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">VNO_CODE_FINAL</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">COMENTARIO</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lines.map(({ ID, CTO, BORNE, ESTADO, LINE_ID_FINAL, VNO_CODE_FINAL, COMENTARIO }, index) => {
                    const matchingRow = nonMassiveData.find(row => row['Line_ID'] === LINE_ID_FINAL);
                    const coincideClass = matchingRow ? 'text-green-500' : 'text-gray-700';

                    return (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{ID}</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{CTO}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{BORNE}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{ESTADO}</td>
                        <td className={`whitespace-nowrap px-4 py-2 ${coincideClass}`}>
                          {matchingRow ? <span className={coincideClass}>{LINE_ID_FINAL}</span> : LINE_ID_FINAL}
                        </td>
                        <td className={`whitespace-nowrap px-4 py-2 ${coincideClass}`}>{VNO_CODE_FINAL}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{COMENTARIO}</td>
                        <td className="px-4 py-2">
                          <button
                            className="bg-purple-200 hover:bg-purple-400 border-none rounded-full px-2 text-violet-700"
                            onClick={() => handleEditClick(ID, LINE_ID_FINAL, VNO_CODE_FINAL, COMENTARIO)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* Modal para la edición */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            {/* Contenido del modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* ... (otro contenido del modal) */}
              <div className="bg-gray-50 px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Editar línea</h3>
                <p className="mt-1 text-sm text-gray-500">Modifica los valores de la línea.</p>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Formulario de edición */}
                <div className="grid grid-cols-6 gap-6">
                  {/* ... (otros campos del formulario) */}
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="lineIdFinal" className="block text-sm font-medium text-gray-700">
                      LINE_ID_FINAL
                    </label>
                    <input
                      type="text"
                      name="lineIdFinal"
                      id="lineIdFinal"
                      value={editedLine.lineIdFinal}
                      onChange={handleModalInputChange}
                      className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="vnoCodeFinal" className="block text-sm font-medium text-gray-700">
                      VNO_CODE_FINAL
                    </label>
                    <input
                      type="text"
                      name="vnoCodeFinal"
                      id="vnoCodeFinal"
                      value={editedLine.vnoCodeFinal}
                      onChange={handleModalInputChange}
                      className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="comentario" className="block text-sm font-medium text-gray-700">
                      COMENTARIO
                    </label>
                    <input
                      type="text"
                      name="comentario"
                      id="comentario"
                      value={editedLine.comentario}
                      onChange={handleModalInputChange}
                      className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleUpdateClick}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Actualizar
                </button>
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CtoTimbrado