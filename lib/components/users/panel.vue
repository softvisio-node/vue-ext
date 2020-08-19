<template>
    <ext-panel layout="fit">
        <UsersToolbar/>

        <UsersGrid/>
    </ext-panel>
</template>

<script>
import UsersToolbar from "./toolbar";
import UsersGrid from "./grid";

export default {
    "components": { UsersToolbar, UsersGrid },
};
</script>
