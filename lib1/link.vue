<template>
    <ext-panel @ready="ready"/>
</template>

<script>
import Vue from "vue";

export default Vue.component( "swc-link", {
    "props": ["text"],

    "methods": {
        ready ( e ) {
            var cmp = ( this.cmp = e.detail.cmp );

            var a = document.createElement( "a" );
            a.textContent = this.text;
            a.setAttribute( "href", "#" );
            a.addEventListener( "click", this.click.bind( this ) );

            cmp.setHtml( a );
        },

        click () {
            this.$emit( "tap" );
        },
    },
} );
</script>
