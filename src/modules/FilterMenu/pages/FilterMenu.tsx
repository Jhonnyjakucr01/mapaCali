/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Menu, Switch, Card, Space } from "antd";
import { MenuProps } from "antd/es/menu";
import { ComunaProperties } from "../../../services/types";
import { EnvironmentOutlined, BorderOutlined, CarOutlined, CloudOutlined } from "@ant-design/icons"; // Iconos de Ant Design

interface FilterMenuProps {
  onFilterChange: (selectedKeys: string[]) => void;
  onToggleBoundaries: (checked: boolean) => void;
  onToggleColors: (checked: boolean) => void; 
  showBoundaries: boolean;
  showColors: boolean;
  showCicloRuta: boolean;
  showRios: boolean;
  onOpenModal: (comuna: ComunaProperties) => void; 
  onToggleCicloRutas: (checked: boolean) => void;
  onToggleRios : (checked: boolean) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  onFilterChange,
  onToggleBoundaries,
  onToggleColors,
  showBoundaries,
  showColors,
  showCicloRuta,
  showRios,
  onToggleCicloRutas,
  onToggleRios,
}) => {

  const handleMenuSelect: MenuProps["onSelect"] = (e) => {
    const filtered = e.selectedKeys.filter((key) => !key.includes("heatmap"));
    onFilterChange(filtered as string[]);
  };

  const handleBoundariesChange = (checked: boolean) => {
    onToggleBoundaries(checked);
  };

  const handleColorsChange = (checked: boolean) => {
    onToggleColors(checked);
  };

  const handleCicloRuta = (checked: boolean) => {
    onToggleCicloRutas(checked);
  };

  const handleRios = (checked: boolean) => {
    onToggleRios(checked);
  }

  return (
    <div
      style={{
        margin: "10px",
        position: "absolute",
        top: "10px",
        left: "50px",
        zIndex: 1000,
        width: "280px", 
      }}
    >
      <Card 
        title="Capas del mapa" 
        bordered 
        style={{ borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}
      >
        <Space 
          direction="vertical" 
          size="middle" 
          style={{ width: "100%" }}
        >
          {/* Switch para Marcadores populares x comuna */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <EnvironmentOutlined style={{ color: "#1890ff", fontSize: "20px", marginRight: "10px" }} />
              <span>Marcadores populares</span>
            </span>
            <Switch 
              checked={showBoundaries} 
              onChange={handleBoundariesChange} 
            />
          </div>

          {/* Switch para Límites de comunas */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <BorderOutlined style={{ color: "#52c41a", fontSize: "20px", marginRight: "10px" }} />
              <span>Límites de comunas</span>
            </span>
            <Switch 
              checked={showColors} 
              onChange={handleColorsChange} 
            />
          </div>

          {/* Switch para Ciclo ruta */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <CarOutlined style={{ color: "#f5222d", fontSize: "20px", marginRight: "10px" }} />
              <span>Ciclo ruta</span>
            </span>
            <Switch 
              checked={showCicloRuta} 
              onChange={handleCicloRuta} 
            />
          </div>


          {/* Switch para Ciclo ruta */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <CloudOutlined  style={{ color: "1890ff", fontSize: "20px", marginRight: "10px" }} />
              <span>Rios</span>
            </span>
            <Switch 
              checked={showRios} 
              onChange={handleRios} 
            />
          </div>


        </Space>
      </Card>

      <Menu
        mode="inline"
        style={{ width: 256 }}
        theme="light"
        multiple
        onSelect={handleMenuSelect}
        onDeselect={handleMenuSelect}
      >
        <Menu.Item key="comunas">Comunas</Menu.Item>

        <Menu.SubMenu key="categories" title="Categorías">
          <Menu.SubMenu key="education" title="Educación">
            <Menu.Item key="colegios">Colegios</Menu.Item>
            <Menu.Item key="universidades">Universidades</Menu.Item>
            <Menu.Item key="biblioteca">Bibliotecas</Menu.Item>

          </Menu.SubMenu>

          <Menu.SubMenu key="services" title="Servicios">
            <Menu.Item key="hospitales">Hospitales</Menu.Item>
            <Menu.Item key="hoteles">Hoteles</Menu.Item>
            <Menu.Item key="bancos">Bancos</Menu.Item>
            <Menu.Item key="estaciones mio">Estaciones MIO</Menu.Item>
            <Menu.Item key="fotomultas">Fotomultas</Menu.Item>
            <Menu.Item key="estaciones electricas">Estaciones Eléctricas</Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu key="entertainment" title="Entretenimiento">
            <Menu.Item key="centros comerciales">Centros Comerciales</Menu.Item>
            <Menu.Item key="monumentos">Monumentos</Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu key="sports" title="Deporte">
            <Menu.Item key="unidades deportivas">Unidades Deportivas</Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu key="naturaleza" title="Naturaleza">
            <Menu.Item key="humedales">Humedales</Menu.Item>
            <Menu.Item key="parques">Parques</Menu.Item>

          </Menu.SubMenu>

        </Menu.SubMenu>

      </Menu>
    </div>
  );
};

export default FilterMenu;
