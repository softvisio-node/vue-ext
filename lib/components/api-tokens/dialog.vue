<template>
    <ext-dialog closeAction="hide" height="90%" layout="fit" scrollable="true" :title="i18nd(`vue-ext`, `API tokens`)" width="850">
        <Panel/>
    </ext-dialog>
</template>

<script>
import Panel from "./panel";

export default {
    "components": { Panel },
};
</script>
