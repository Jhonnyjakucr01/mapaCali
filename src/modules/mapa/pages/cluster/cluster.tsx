import React, { useState } from "react";
import {
  Upload,
  Button,
  Spin,
  message,
  Card,
  Typography,
  Image,
  Modal,
  Table,
  Space,
} from "antd";
import { UploadOutlined, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import { clusterCali } from "../../../../services/mapita/mapitaAPI";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title, Paragraph } = Typography;

const ClusteringCali: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (info: any) => {
    const selectedFile = info.fileList[0]?.originFileObj;
    if (selectedFile) {
      setFile(selectedFile);
      message.success(`Archivo ${selectedFile.name} seleccionado correctamente.`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      message.warning("Por favor, seleccione un archivo Excel.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", file);

    setLoading(true);
    try {
      const response = await clusterCali(formData);
      console.log("hola", response);
      setResults(response);
      message.success("Archivo procesado con éxito.");
    } catch (error) {
      console.error("Error:", error);
      message.error("Hubo un problema al procesar el archivo.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!results?.clusters) return;
    const worksheet = XLSX.utils.json_to_sheet(results.clusters);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clusters");
    XLSX.writeFile(workbook, "clustering_comunas.xlsx");
  };

  const handleExportPDF = () => {
    if (!results?.clusters) return;
    const doc = new jsPDF();
    doc.text("Resultados de Clustering", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Comuna", "Cluster"]],
      body: results.clusters.map((item: any) => [item.comuna, item.Cluster]),
    });
    doc.save("clustering_comunas.pdf");
  };

  const renderImageCard = (title: string, data: string, alt: string) => (
    <Card
      hoverable
      className="transition-all duration-300 shadow-md hover:shadow-xl"
      title={title}
    >
      <Image
        src={`data:image/png;base64,${data}`}
        alt={alt}
        preview={false}
        className="rounded-md cursor-pointer"
        onClick={() => setPreviewImage(`data:image/png;base64,${data}`)}
      />
    </Card>
  );

  const columns = [
    {
      title: "Comuna",
      dataIndex: "comuna",
      key: "comuna",
    },
    {
      title: "Cluster Asignado",
      dataIndex: "Cluster",
      key: "Cluster",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <Title level={2} className="text-center mb-6">
        Clustering de Comunas de Santiago de Cali
      </Title>

      {/* Subida de archivo */}
      <Card className="mb-6" title="Subir Archivo Excel">
        <Upload beforeUpload={() => false} onChange={handleFileChange} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Seleccionar Archivo</Button>
        </Upload>
        <Button
          type="primary"
          className="mt-3"
          onClick={handleUpload}
          loading={loading}
          disabled={!file}
        >
          Procesar Archivo
        </Button>
      </Card>

      {loading && (
        <div className="flex justify-center my-10">
          <Spin size="large" />
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* Resumen */}
          <Card title="Resumen del Análisis" className="shadow-md">
            <Paragraph><strong>Clusters Óptimos:</strong> {results.optimal_clusters}</Paragraph>
            <Paragraph><strong>Silhouette Score:</strong> {results.silhouette_score.toFixed(3)}</Paragraph>
            <Paragraph><strong>Mejor Comuna:</strong> {results.best_comuna}</Paragraph>
            <Paragraph><strong>Peor Comuna:</strong> {results.worst_comuna}</Paragraph>
          </Card>

          {/* Gráficas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.cluster_plot && renderImageCard("Clusters Identificados", results.cluster_plot, "Clusters")}
            {results.elbow_plot && renderImageCard("Método del Codo", results.elbow_plot, "Elbow")}
            {results.silhouette_plot && renderImageCard("Gráfico de Silueta", results.silhouette_plot, "Silhouette")}
          </div>

          {/* Tabla */}
          {results.clusters && (
            <Card title="Asignación de Clusters por Comuna" extra={
              <Space>
                <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>Exportar Excel</Button>
                <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>Exportar PDF</Button>
              </Space>
            }>
              <Table
                dataSource={results.clusters.map((item: any, index: number) => ({ ...item, key: index }))}
                columns={columns}
                pagination={false}
              />
            </Card>
          )}

          {/* Descripción */}
          <Card title="Explicación Detallada del Análisis" className="shadow-md">
            <Typography>
              <Paragraph>
                Este análisis agrupa las 22 comunas de Cali basándose en características positivas (infraestructura, servicios)
                y negativas (criminalidad, fotomultas).
              </Paragraph>
              <ol style={{ paddingLeft: "1.5rem" }}>
                <li><strong>Escalamiento:</strong> con <code>StandardScaler</code>.</li>
                <li><strong>Elbow:</strong> para determinar el número ideal de clusters.</li>
                <li><strong>KMeans:</strong> para agrupar comunas similares.</li>
                <li><strong>Evaluación:</strong> con Silhouette Score.</li>
                <li><strong>Visualización:</strong> de resultados mediante gráficos.</li>
              </ol>
            </Typography>
          </Card>
        </div>
      )}

      {/* Modal imagen ampliada */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        centered
      >
        <Image src={previewImage!} alt="Zoom" />
      </Modal>
    </div>
  );
};

export default ClusteringCali;
