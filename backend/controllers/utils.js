export const updateQuery = `
      UPDATE datosMasivos
      SET
        CTO = ?,
        BORNE = ?,
        LINE_ID_INICIAL = ?,
        VNO_CODE_INICIAL = ?,
        OLT = ?,
        SLOT = ?,
        PORT = ?,
        ONU_INICIAL = ?,
        ONU_FINAL = ?,
        ESTADO = ?,
        POTENCIA_ANTES = ?,
        POTENCIA_DESPUES = ?,
        POTENCIA_CAMPO = ?,
        LINE_ID_FINAL = ?,
        VNO_CODE_FINAL = ?,
        COMENTARIO = ?,
        GRUPO = ?,
        FECHA = ?,
        HORA_INICIO = ?,
        HORA_CIERRE = ?,
        GESTOR = ?,
        VALIDACION = ?,
        VALIDACION_2 = ?,
        ESTADO_EN_OSP = ?,
        UBICAR_EN_CAMPO = ?,
        CTO_DONDE_SE_DEJA = ?
        BORNE_DSDEJA = ?
      WHERE ID = ?;
    `;