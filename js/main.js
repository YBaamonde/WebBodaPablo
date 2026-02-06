// Script simple para simular el envío del formulario
        document.getElementById('weddingForm').addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que la página se recargue
            
            const name = document.getElementById('name').value;
            const status = document.getElementById('status').value;

            if(status === 'si') {
                alert(`¡Gracias ${name}! Estamos felices de que vengas. Hemos recibido tu confirmación.`);
            } else {
                alert(`Gracias ${name} por avisarnos. Te echaremos de menos.`);
            }
            
            // Aquí iría el código para enviar los datos a un servidor real (Google Sheets, Email, etc.)
            this.reset();
        });