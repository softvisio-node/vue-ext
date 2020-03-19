import Vue from "vue";

// const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";

// function isESModule ( obj ) {
//     return obj.__esModule || ( hasSymbol && obj[Symbol.toStringTag] === "Module" );
// }

const mixin = {
    "methods": {
        extAddVueComponent ( cmp, target ) {
            // async component
            // if ( typeof cmp === "function" ) {
            //     cmp = await cmp();

            //     if ( isESModule( cmp ) ) {
            //         cmp = cmp.default;
            //     }
            // }

            const component = Vue.extend( cmp ),
                instance = new component(),
                wrapper = target.add( {
                    "xtype": "component",
                } );

            instance.$mount();

            wrapper.innerElement.dom.appendChild( instance.$el );
            // wrapper.setHtml( instance.$el );

            instance.$once( "hook:beforeDestroy", () => {
                wrapper.destroy();
            } );

            return instance;
        },
    },
};

export default mixin;
