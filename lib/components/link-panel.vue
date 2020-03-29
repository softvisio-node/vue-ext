<template>
    <ext-container @ready="ready"/>
</template>

<script>
export default {
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
};
</script>
