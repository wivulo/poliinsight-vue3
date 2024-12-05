export default {
    header(){
        
    },

    printer(elementId = ''){
    try {
        const Content = document.getElementById(elementId)
    
        if (!Content) {
            this.handleErrorMessage();
            return;
        }
        
        let iframe = document.createElement('iframe')
        document.body.appendChild(iframe)
    
        iframe.contentDocument.open()
        iframe.contentDocument.write(
            `
            <html>
                <head>
                    <link rel="stylesheet" href="/css/report.css" />

                    <style>
                        @media print {
                            table thead tr th {
                                -webkit-print-color-adjust: exact; /* Para navegadores baseados em WebKit */
                                print-color-adjust: exact;       /* Para navegadores compatíveis */
                                background-color: rgb(218, 85, 81) !important;  /* Garantir que o fundo do cabeçalho seja aplicado */
                                color: white !important;  /* Garantir que a cor do texto seja branca */
                            }
                        }
                    </style>
                </head>
                <body>
                    ${Content.innerHTML}
                </body>
            </html>
        `
        );
        iframe.contentDocument.close()
    
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            iframe.remove();
        }, 900);
    
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
    }
}
}