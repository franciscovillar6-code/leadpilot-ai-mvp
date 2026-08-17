# LeadPilot AI Dashboard

Quiero construir una aplicación web llamada “LeadPilot AI”.

El objetivo es resolver un problema real de un negocio de viajes: recibimos consultas de potenciales clientes y actualmente es necesario revisar cada consulta manualmente para determinar cuáles tienen mayor potencial comercial.

Quiero crear una primera versión funcional de una aplicación que permita visualizar y priorizar esos leads.

En esta primera versión NO quiero integrar todavía Google Forms, APIs externas, CRM ni servicios de IA externos. Quiero utilizar datos ficticios para construir y probar la interfaz.

La aplicación debe tener:

Un dashboard principal con:

Cantidad total de leads.

Cantidad de leads de alta prioridad.

Cantidad de leads de prioridad media.

Cantidad de leads de prioridad baja.

Una lista de leads ficticios. Cada lead debe mostrar:

Nombre.

Destino.

Cantidad de viajeros.

Fecha estimada del viaje.

Presupuesto.

Score de 0 a 100.

Nivel de prioridad.

Intención de compra.

Los leads deben estar ordenados automáticamente desde el mayor score al menor.

Cada lead debe poder abrirse para ver un análisis más detallado:

Información del cliente.

Motivo del score.

Información que falta.

Próxima acción recomendada.

Respuesta sugerida para el cliente.

Crear al menos 10 leads ficticios diferentes para poder probar el sistema.

Quiero una interfaz moderna, profesional y limpia, relacionada con una empresa de viajes. Debe ser fácil de entender y utilizar.

Importante: esto es un MVP. Priorizá que la aplicación sea funcional, clara y fácil de modificar posteriormente. No agregues funcionalidades innecesarias todavía.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f442122a-420e-443b-b1cd-cb21d907b2e0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
