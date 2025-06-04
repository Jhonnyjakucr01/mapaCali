/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { MarkerData } from "../../../../services/types";
import { crearMarcadorMapa } from "../../../../services/mapita/mapitaAPI";

const CreateMarkerModal: React.FC<{
  isVisible: boolean;
  onCreate: (marker: MarkerData) => void;
  onClose: () => void;
}> = ({ isVisible, onCreate, onClose }) => {
  const [form] = Form.useForm();
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);

  // Método para crear el marcador en el mapa
  const crearMarcador= async (marker: MarkerData) => {
    marker.lat.toString();
    marker.lng.toString();

    console.log("Datos enviados a crearMarcadorMapa:", marker);
    const marqui = await crearMarcadorMapa(marker);
    console.log(marqui);
  };

  // Maneja el envío del formulario
  const handleFormSubmit = (values: any) => {
    const newMarker: MarkerData = {
      nombre: values.nombre,
      tipo: values.tipo,
      lat: lat!,
      lng: lng!,
    };

    // Llama al método de crear marcador
    crearMarcador(newMarker);

    // Llama a la función onCreate para que otros componentes se actualicen
    onCreate(newMarker);

    // Cierra el modal y resetea el formulario
    onClose();
    form.resetFields();
    setLat(undefined); // Limpia la latitud
    setLng(undefined); // Limpia la longitud
  };

  return (
    <Modal
      title="Crear Nuevo Marcador"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleFormSubmit}>
        <Form.Item
          name="nombre"
          label="Nombre del marcador"
          rules={[{ required: true, message: "Por favor ingresa un nombre" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="tipo"
          label="Tipo"
          rules={[{ required: true, message: "Por favor selecciona un tipo" }]}
        >
          <Select>
            <Select.Option value="hospitales">Hospitales</Select.Option>
            <Select.Option value="colegios">Colegios</Select.Option>
            <Select.Option value="clinicas">Clínicas</Select.Option>
            <Select.Option value="bancos">Bancos</Select.Option>
            <Select.Option value="universidades">Universidades</Select.Option>
            <Select.Option value="centros comerciales">
              Centros comerciales
            </Select.Option>
            <Select.Option value="robos">Robos</Select.Option>
            <Select.Option value="foto multas">Foto multas</Select.Option>
            <Select.Option value="hueco">Huecos</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Coordenadas"
          help="Haz clic en el mapa o ingresa las coordenadas manualmente"
        >
          <div
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              textAlign: "center",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <Form.Item
                label="Latitud"
                style={{ width: "190px" }}
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese la latitud",
                  },
                ]}
              >
                <Input
                  placeholder="3.449378"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  type="number"
                  step="0.000001" // Precisión decimal
                />
              </Form.Item>

              <Form.Item
                label="Longitud"
                style={{ width: "190px" }}
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese la longitud",
                  },
                ]}
              >
                <Input
                  placeholder="-76.5452443"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  type="number"
                  step="0.000001" // Precisión decimal
                />
              </Form.Item>
            </div>
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Crear Marcador
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMarkerModal;
