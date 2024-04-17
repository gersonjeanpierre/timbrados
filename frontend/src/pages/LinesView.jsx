import { useEffect, useState } from "react";
import { getLines } from "../api/lines.api";
import { format } from 'date-fns';
import { DatePicker1Presentation } from "../components/DatePicker";
import Papa from 'papaparse';

const LinesView = () => {
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


  return (
    <>
      <DatePicker1Presentation setSelectedDate={handleDateChange} />
      <p>Aqui mostrar la fecha: {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'N/A'}</p>



      <div className="flex justify-center mt-4">
        <div className="rounded-lg border border-gray-200">
          <div className="overflow-x-auto rounded-t-lg">
            <table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">LINE_ID_FINAL</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">VNO_CODE_FINAL</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">COMENTARIO</th>
                </tr>
              </thead>
              <tbody>
                {lines.map(({ ID, CTO, BORNE, ESTADO, LINE_ID_FINAL, VNO_CODE_FINAL, COMENTARIO }, index) => (
                  // Agrega esta condición para mostrar solo las líneas con estado 'OCUPADO'
                  (
                    <tr key={index}>

                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{LINE_ID_FINAL}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{VNO_CODE_FINAL}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{COMENTARIO}</td>
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

export default LinesView;