import React, { useEffect, useState } from "react";
import {
  Upload,
  Button,
  Select,
  Table,
  Spin,
  message,
  Typography,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Line } from "react-chartjs-2";
import { proyeccionesCali } from "../../../../services/mapita/mapitaAPI";

// 📊 Configuración de ChartJS
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle } = Typography;
const { Option } = Select;

interface HomicidioData {
  comuna: string;
  homicidios_2017: number;
  homicidios_2018: number;
  homicidios_2019: number;
  homicidios_2020: number;
  homicidios_2022: number;
  homicidios_2023: number;
  homicidios_2024_predicho: number;
}

const UploadExcel: React.FC = () => {
  const [data, setData] = useState<HomicidioData[]>([]);
  const [selectedComuna, setSelectedComuna] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);

  useEffect(() => {
    setIsFileSelected(file !== null);
  }, [file]);

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
  
    console.log("📂 Archivo a enviar:", file); // Verifica si el archivo está definido
  
    setLoading(true);
  
    try {
      const response = await proyeccionesCali(file);
      setData(response);
      message.success("✅ Archivo procesado con éxito.");
    } catch (error) {
      console.error("❌ Error al procesar el archivo:", error);
      message.error("❌ Error al procesar el archivo. Verifica el formato.");
    } finally {
      setLoading(false);
    }
  };

  // 📈 Configuración del gráfico
  const getChartData = () => {
    if (!selectedComuna) return null;
    const comunaData = data.find((d) => d.comuna === selectedComuna);
    if (!comunaData) return null;

    return {
      labels: ["2017", "2018", "2019", "2020", "2022", "2023", "2024"],
      datasets: [
        {
          label: `Homicidios en ${selectedComuna}`,
          data: [
            comunaData.homicidios_2017,
            comunaData.homicidios_2018,
            comunaData.homicidios_2019,
            comunaData.homicidios_2020,
            comunaData.homicidios_2022,
            comunaData.homicidios_2023,
            comunaData.homicidios_2024_predicho,
          ],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    };
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
    {
      title: "2024 Predicho",
      dataIndex: "homicidios_2024_predicho",
      key: "h2024_predicho",
      render: (text: number) => <b>{text}</b>,
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <AntTitle level={2}>📂 Subir archivo Excel</AntTitle>
      
      {/* 📤 Subir archivo */}
      <Upload
        beforeUpload={() => false}
        onChange={handleFileChange}
        showUploadList={false}
        accept=".xlsx"
      >
        <Button icon={<UploadOutlined />} type="primary" style={{ marginBottom: 16 }}>
          Seleccionar Archivo
        </Button>
      </Upload>

      {/* 🔘 Botón para procesar archivo */}
      <Button
        onClick={handleProcesarArchivo}
        type="primary"
        style={{ marginTop: 8, marginBottom: 16 }}
        loading={loading}
        disabled={!isFileSelected}
      >
        Procesar Archivo
      </Button>

      {/* 📊 Mostrar resultados */}
      {data.length > 0 && (
        <Card title="📊 Resultados" style={{ marginTop: 20 }}>
          {/* 📋 Tabla de resultados */}
          <Table dataSource={data} columns={columns} rowKey="comuna" pagination={{ pageSize: 5 }} />

          {/* 📌 Seleccionar comuna para graficar */}
          <div style={{ marginTop: 20 }}>
            <label style={{ fontWeight: "bold", marginRight: 10 }}>Seleccionar comuna:</label>
            <Select
              style={{ width: 200 }}
              onChange={(value) => setSelectedComuna(value)}
              placeholder="Seleccione..."
            >
              {data.map((row) => (
                <Option key={row.comuna} value={row.comuna}>
                  {row.comuna}
                </Option>
              ))}
            </Select>
          </div>

          {/* 📉 Gráfico de evolución */}
          {selectedComuna && getChartData() && (
            <div style={{ marginTop: 20 }}>
              <AntTitle level={3}>📈 Evolución de Homicidios</AntTitle>
              <Line data={getChartData()!} />
            </div>
          )}
        </Card>
      )}

      {/* 🔄 Cargando */}
      {loading && <Spin size="large" style={{ textAlign: "center", marginTop: 20 }} />}
    </div>
  );
};

export default UploadExcel;
