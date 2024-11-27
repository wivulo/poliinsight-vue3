export const iframeReportDocuemnt = (content) => 
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
                ${content}
            </body>
        </html>
    `
