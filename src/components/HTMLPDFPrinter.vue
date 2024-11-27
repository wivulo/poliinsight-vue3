<script>
import { mapGetters } from 'vuex';

export default {
    name: "HTMLPDFPrinter",
    props: {
        contentId: {
            type: String,
            required: true,
        },
        cssRulesPath: {
            type: String,
            required: false,
            default: '/css/report.css',
        },
    },
    methods: {
        handleErrorMessage(message = 'Erro ao gerar PDF') {
            this.$toast.add({severity:'error', summary: 'Error', detail: message, life: 3000});
        },

        async execute() {
            try {
                const content = document.getElementById(this.contentId);

                if (!content) {
                    this.handleErrorMessage();
                    return;
                }
                
                let iframe = document.createElement('iframe')
                document.body.appendChild(iframe)

                iframe.contentDocument.open()
                iframe.contentDocument.write(`
                    <html>
                        <head>
                            <link rel="stylesheet" href="${cssRulesPath}" />

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
                            ${content.innerHTML}
                        </body>
                    </html>
                `);
                iframe.contentDocument.close()

                // iframe.onload = () => {
                setTimeout(() => {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                    iframe.remove();
                }, 900);
                // };
            
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
            }
        },
    }
}
</script>

<template>
</template>
