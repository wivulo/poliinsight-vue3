// define a mixin object
export const setDocumentTitleMixin = {
    created: function () {
        document.title = this.title
    }
}