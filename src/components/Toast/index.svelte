<script lang="ts">
    import { toasts } from "./state.svelte";
    import type { Toast } from "./state.svelte";
    import { fade } from "svelte/transition";
    import Icon from "../Icon.svelte";
    import {
        mdiCheckCircleOutline,
        mdiAlertCircleOutline,
        mdiInformationOutline,
        mdiAlertOutline,
    } from "@mdi/js";

    function getIconPath(type: Toast["type"]) {
        switch (type) {
            case "success":
                return mdiCheckCircleOutline;
            case "error":
                return mdiAlertCircleOutline;
            case "warning":
                return mdiAlertOutline;
            case "info":
                return mdiInformationOutline;
            default:
                return "";
        }
    }
</script>

<div class="toast-container">
    {#each toasts as toast}
        <div
            class="toast {toast.type} "
            in:fade={{ duration: 300 }}
            out:fade={{ duration: 300 }}
        >
            <div class="is-flex is-align-items-center">
                <Icon path={getIconPath(toast.type)} />
                {toast.message}
            </div>
        </div>
    {/each}
</div>

<style>
    .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    }
    .toast {
        margin: 10px;
        padding: 10px;
        border-radius: 5px;
    }
    .success {
        background-color: #28a745;
        color: white;
    }
    .error {
        background-color: #dc3545;
        color: white;
    }
    .warning {
        background-color: #ffc107;
        color: black;
    }
    .info {
        background-color: var(--markit-color-primary);
        color: white;
    }
</style>
