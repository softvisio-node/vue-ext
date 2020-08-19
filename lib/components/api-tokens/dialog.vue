<template>
    <ext-dialog title="API Access Tokens" width="850" height="90%" displayed="true" scrollable="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" layout="fit">
        <Panel/>
    </ext-dialog>
</template>

<script>
import Panel from "./panel";

export default {
    "components": { Panel },
};
</script>
