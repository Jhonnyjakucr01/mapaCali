import React, { useState } from "react";
import { Card, Row, Col, Button, Spin, message } from "antd";
import { FileExcelOutlined, SearchOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { obtenerDatos } from "../../../../services/mapita/mapitaAPI";

const categorias = [
  { nombre: "Hospitales", tipo: "hospital", color: "#FF4D4F" },
  { nombre: "Colegios", tipo: "school", color: "#1890FF" },
  { nombre: "Hoteles", tipo: "hotel", color: "#722ED1" },
  { nombre: "Bancos", tipo: "bank", color: "#13C2C2" },
  { nombre: "Cajeros", tipo: "atm", color: "#FAAD14" },
  { nombre: "Plazas", tipo: "plaza", color: "#52C41A" },
];

const CategoriaCard: React.FC<{ titulo: string; tipo: string; color: string }> = ({ titulo, tipo, color }) => {
  const [datos, setDatos] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await obtenerDatos(tipo);
      if (data.results && data.results.length > 0) {
        const datosFormateados = data.results.map((item: any) => ({
          name: item.name,
          lat: item.geometry.location.lat,
          lng: item.geometry.location.lng,
        }));
        setDatos(datosFormateados);
        message.success(`Se encontraron ${data.results.length} resultados en ${titulo}`);
      } else {
        message.warning(`No se encontraron datos en ${titulo}`);
      }
    } catch (err) {
      message.error(`Error al obtener los datos de ${titulo}`);
    } finally {
      setLoading(false);
    }
  };

  const generarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, titulo);
    XLSX.writeFile(wb, `${titulo}.xlsx`);
    message.success(`Archivo Excel generado para ${titulo}`);
  };

  return (
    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
      <Card title={titulo} bordered={false} style={{ borderTop: `4px solid ${color}` }}>
        {loading ? (
          <Spin tip="Cargando..." />
        ) : (
          <>
            <Button type="primary" icon={<SearchOutlined />} onClick={fetchData} block>
              Obtener Datos
            </Button>
            <Button
              type="default"
              icon={<FileExcelOutlined />}
              onClick={generarExcel}
              disabled={datos.length === 0}
              style={{ marginTop: 10 }}
              block
            >
              Generar Excel
            </Button>
          </>
        )}
      </Card>
    </Col>
  );
};

const ApiGoogle: React.FC = () => {
  return (
    <div style={{ padding: 20, background: "#F0F2F5", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Consulta de Datos - API Google</h2>
      <Row gutter={[16, 16]} justify="center">
        {categorias.map((categoria) => (
          <CategoriaCard key={categoria.nombre} titulo={categoria.nombre} tipo={categoria.tipo} color={categoria.color} />
        ))}
      </Row>
    </div>
  );
};

export default ApiGoogle;
