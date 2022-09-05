<script>
import Panel from "./_panel";
import PdfDialog from "./dialog";

export default {
    "extends": Panel,

    "methods": {
        maximize () {
            this.$mount( PdfDialog, { "props": { "src": this.currentSrc }, "cache": false } );
        },
    },
};
</script>
