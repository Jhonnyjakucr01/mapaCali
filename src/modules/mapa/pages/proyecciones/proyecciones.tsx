import React, { useState } from "react";
import { Upload, Button, Table, Spin, message, Typography, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Bar } from "react-chartjs-2";
import { proyeccionesCali } from "../../../../services/mapita/mapitaAPI";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { Title: AntTitle } = Typography;

const UploadExcel: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // 📂 Manejo del archivo
  const handleFileChange = (info: any) => {
    const selectedFile = info.fileList.length > 0 ? info.fileList[0].originFileObj : null;
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".xlsx")) {
        message.error("❌ Solo se permiten archivos .xlsx");
        return;
      }
      setFile(selectedFile);
      message.success(`✅ Archivo "${selectedFile.name}" seleccionado.`);
    } else {
      message.error("❌ Error al seleccionar el archivo.");
    }
  };

  // 🚀 Enviar el archivo al backend
  const handleProcesarArchivo = async () => {
    if (!file) {
      message.warning("⚠️ Selecciona un archivo antes de procesar.");
      return;
    }
    setLoading(true);
    try {
      const response = await proyeccionesCali(file);
      console.log("📊 Datos recibidos:", response);

      // 🔄 Transformar los datos antes de asignarlos al estado
      const formattedData = response.map((item: any) => ({
        comuna: item.comuna || "-",
        homicidios_2017: item["homicidios 2017"] ?? 0,
        homicidios_2018: item["homicidios 2018"] ?? 0,
        homicidios_2019: item["homicidios 2019"] ?? 0,
        homicidios_2020: item["homicidios 2020"] ?? 0,
        homicidios_2022: item["homicidios 2022"] ?? 0,
        homicidios_2023: item["homicidios 2023"] ?? 0,
        homicidios_2024: item["homicidios 2024"] ?? 0,
        homicidios_2024_predicho: item["homicidios 2024 predicho"] ?? 0,
      }));

      setData(formattedData);
      message.success("✅ Archivo procesado con éxito.");
    } catch (error) {
      console.error("❌ Error al procesar el archivo:", error);
      message.error("❌ Error al procesar el archivo. Verifica el formato.");
    } finally {
      setLoading(false);
    }
  };

  // 📋 Configuración de la tabla
  const columns = [
    { title: "Comuna", dataIndex: "comuna", key: "comuna" },
    { title: "2017", dataIndex: "homicidios_2017", key: "h2017" },
    { title: "2018", dataIndex: "homicidios_2018", key: "h2018" },
    { title: "2019", dataIndex: "homicidios_2019", key: "h2019" },
    { title: "2020", dataIndex: "homicidios_2020", key: "h2020" },
    { title: "2022", dataIndex: "homicidios_2022", key: "h2022" },
    { title: "2023", dataIndex: "homicidios_2023", key: "h2023" },
    { title: "2024", dataIndex: "homicidios_2024", key: "h2024" },
    {
      title: "2025 Prediccion",
      dataIndex: "homicidios_2024_predicho",
      key: "h2024_predicho",
      render: (text: number) => <b>{text || "-"}</b>,
    },
  ];

  const chartData = {
    labels: data.map((item) => `Comuna ${item.comuna}`),
    datasets: [
      { label: "2017", data: data.map((item) => item.homicidios_2017), backgroundColor: "#ff6384" },
      { label: "2018", data: data.map((item) => item.homicidios_2018), backgroundColor: "#36a2eb" },
      { label: "2019", data: data.map((item) => item.homicidios_2019), backgroundColor: "#ffcd56" },
      { label: "2020", data: data.map((item) => item.homicidios_2020), backgroundColor: "#4bc0c0" },
      { label: "2022", data: data.map((item) => item.homicidios_2022), backgroundColor: "#9966ff" },
      { label: "2023", data: data.map((item) => item.homicidios_2023), backgroundColor: "#c9cbcf" },
      { label: "2024", data: data.map((item) => item.homicidios_2024), backgroundColor: "#ff9f40" },
    ],
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <AntTitle level={2}>📂 Subir archivo Excel</AntTitle>
      <Upload beforeUpload={() => false} onChange={handleFileChange} showUploadList={false} accept=".xlsx">
        <Button icon={<UploadOutlined />} type="primary" style={{ marginBottom: 16 }}>
          Seleccionar Archivo
        </Button>
      </Upload>
      <Button onClick={handleProcesarArchivo} type="primary" style={{ marginTop: 8, marginBottom: 16 }} loading={loading}>
        Procesar Archivo
      </Button>

      {/* 📋 Tabla de homicidios */}
      <Card title="📊 Datos de Homicidios por Comuna" style={{ marginTop: 20 }}>
        <Table 
          dataSource={data.length > 0 ? data : []} 
          columns={columns} 
          rowKey="comuna" 
          pagination={{ pageSize: 5 }} 
        />
      </Card>

      {/* 📊 Gráfico de homicidios */}
      {data.length > 0 && (
        <Card title="📈 Homicidios por Comuna (Años 2017-2024)" style={{ marginTop: 20 }}>
          <Bar data={chartData} />
        </Card>
      )}

      {loading && <Spin size="large" style={{ textAlign: "center", marginTop: 20 }} />}
    </div>
  );
};

export default UploadExcel;
