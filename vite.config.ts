import { defineConfig } from "vite"
import * as path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/main.ts"),
            name: "xi",
            fileName: format => `xi.${format}.js`,
        },
    },
})
