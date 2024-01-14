import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {

  const model = [
  
    {
      label: 'Modificación de Datos',
      items: [
        { label: 'Productos', icon: 'pi pi-fw pi-database', to: '/pages/Ecommerce/productos' },

      ]
    },
    {
      label: 'Visualización de Registros',
      items: [
        { label: 'Ordenes', icon: 'pi pi-fw pi-truck', to: '/pages/Ecommerce/verPedidos' },
       // { label: 'Cancelaciones', icon: 'pi pi-fw pi-times-circle', to: '/pages/usuario/cancelaciones' },
      ]
    },
    {
      label: 'Médicos',
      items: [
        { label: 'Validaciones de Médicos', icon: 'pi pi-fw pi-verified', to: '/pages/usuario/PerfilAdmin/validarMedicos_' },
      ]
    },
    
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
