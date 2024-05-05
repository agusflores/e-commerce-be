export const purchaseEmailTemplate = (ticket) => `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,300;0,400;0,500;0,600;1,200;1,400&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <section class="max-w-2xl px-6 py-8 mx-auto bg-white">
      <main class="mt-8">
        <h2 class="text-gray-700">Hola,</h2>

        <p class="mt-2 leading-loose text-gray-600">
          Tu compra se ha realizado con exito! Muchas gracias por confiar en nosotros. Esperamos que vuelvas a visitarnos pronto.
        </p>
        <br />
        <h3 class="text-gray-700">Los detalles de tu compra son los siguientes:</h3>
        <p class="mt-2 text-gray-600">Codigo: ${ticket.code}</p>
        <p class="mt-2 text-gray-600">Fecha: ${ticket.purchase_datetime}</p>
        <p class="mt-2 text-gray-600">Total: $${ticket.amount}</p>
        <p class="mt-8 text-gray-600">
          Gracias, <br />
         Equipo E-commerce Backend
        </p>
      </main>
    </section>
  </body>
</html>`
