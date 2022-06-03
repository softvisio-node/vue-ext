<template>
    <ext-dialog :title="i18n(`API Access Tokens`)" width="850" height="90%" scrollable="true" closeAction="hide" layout="fit">
        <Panel/>
    </ext-dialog>
</template>

<script>
import Panel from "./panel";

export default {
    "components": { Panel },
};
</script>
