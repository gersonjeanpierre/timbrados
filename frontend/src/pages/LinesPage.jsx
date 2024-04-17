import { useEffect, useState } from "react";
import { getLines } from "../api/lines.api";
import { format } from 'date-fns';
import { DatePicker1Presentation } from "../components/DatePicker";
import Papa from 'papaparse';

const LinesPage = () => {
  const [lines, setLines] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEstadoColumn, setShowEstadoColumn] = useState(true); // Nuevo estado
  const [showEstadoColumn2, setShowEstadoColumn2] = useState(true); // Nuevo estado

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleToggleEstadoColumn = () => {
    setShowEstadoColumn((prevShowEstadoColumn) => !prevShowEstadoColumn);
  };
  const handleToggleEstadoColumn2 = () => {
    setShowEstadoColumn2((prevShowEstadoColumn2) => !prevShowEstadoColumn2);
  };

  // Función para exportar a CSV
  const exportToCSV = () => {
    const csvData = Papa.unparse({
      fields: ["CODIGO_CTO", "CODIGO", "UIP", "CODIGO_CLIENTE", "LINEID", "VNO", "CINTILLO", "ACOMETIDA", "VNOCODE", "ESTADO"],
      data: lines
        .filter(({ COMENTARIO, LINE_ID_FINAL }) => COMENTARIO !== 'DE BAJA' && LINE_ID_FINAL !== '')
        .map(({ CTO, BORNE, LINE_ID_FINAL, VNO_CODE_FINAL }) => ({
          CODIGO_CTO: CTO,
          CODIGO: BORNE,
          UIP: '',
          CODIGO_CLIENTE: '',
          LINEID: LINE_ID_FINAL,
          VNO: 'TDP',
          CINTILLO: VNO_CODE_FINAL,
          ACOMETIDA: '',
          VNOCODE: VNO_CODE_FINAL,
          ESTADO: 'OCUPADO',
        })),
    });

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, 'lines.csv');
    } else {
      link.href = URL.createObjectURL(blob);
      link.target = '_blank';
      link.setAttribute('download', `${selectedDate}-lines.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Función para exportar a CSV
  const exportToCSVLibre = () => {
    const csvData = Papa.unparse({
      fields: ["CODIGO_CTO", "CODIGO", "UIP", "CODIGO_CLIENTE", "LINEID", "VNO", "CINTILLO", "ACOMETIDA", "VNOCODE", "ESTADO"],
      data: lines
        .filter(({ ESTADO }) => ESTADO != '')
        .map(({ CTO, BORNE, }) => ({
          CODIGO_CTO: CTO,
          CODIGO: BORNE,
          UIP: '',
          CODIGO_CLIENTE: '',
          LINEID: '',
          VNO: '',
          CINTILLO: '',
          ACOMETIDA: '',
          VNOCODE: '',
          ESTADO: 'LIBRE',
        })),
    });

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, `${selectedDate}-free-lines.csv`);
    } else {
      link.href = URL.createObjectURL(blob);
      link.target = '_blank';
      link.setAttribute('download', 'lines.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <DatePicker1Presentation setSelectedDate={handleDateChange} />
      <p>Aqui mostrar la fecha: {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'N/A'}</p>

      {/* Botón para mostrar/ocultar la columna ESTADO */}
      <button onClick={handleToggleEstadoColumn} className="bg-purple-200 hover:bg-purple-400 border-none rounded-full px-2 text-violet-700 mr-5">
        {showEstadoColumn ? "Ocultar" : "Mostrar"} ESTADO-R
      </button>
      <button onClick={handleToggleEstadoColumn2} className="bg-purple-200 hover:bg-purple-400 border-none rounded-full px-2 text-violet-700 mr-5">
        {showEstadoColumn2 ? "Ocultar" : "Mostrar"} COMENTARIO
      </button>

      {/* Botón para exportar a CSV */}
      <button onClick={exportToCSV} className="bg-purple-200 hover:bg-purple-400 border-none rounded-full px-2 text-violet-700 mr-5">Exportar a CSV</button>
      <button onClick={exportToCSVLibre} className="bg-purple-200 hover:bg-purple-400 border-none rounded-full px-2 text-violet-700 mr-5">Libres CSV</button>


      <div className="flex justify-center mt-4">
        <div className="rounded-lg border border-gray-200">
          <div className="overflow-x-auto rounded-t-lg">
            <table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">CODIGO_CTO</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">CODIGO</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">UIP</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">CODIGO_CLIENTE</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">LINEID</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">VNO</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">CINTILLO</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ACOMETIDA</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">VNOCODE</th>
                  {showEstadoColumn && <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ESTADO-R</th>}
                  {showEstadoColumn2 && <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">COMENTARIO</th>}
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ESTADO</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map(({ ID, CTO, BORNE, ESTADO, LINE_ID_FINAL, VNO_CODE_FINAL, COMENTARIO }, index) => (
                  // Agrega esta condición para mostrar solo las líneas con estado 'OCUPADO'
                  COMENTARIO != 'DE BAJA' && LINE_ID_FINAL != '' && (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{CTO}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{BORNE}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700"></td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700"></td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{LINE_ID_FINAL}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">TDP</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{VNO_CODE_FINAL}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700"></td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{VNO_CODE_FINAL}</td>
                      {showEstadoColumn && <td className="whitespace-nowrap px-4 py-2 text-gray-700">{ESTADO}</td>}
                      {showEstadoColumn2 && <td className="whitespace-nowrap px-4 py-2 text-gray-700">{COMENTARIO}</td>}
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">OCUPADO</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinesPage;