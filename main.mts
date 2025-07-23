import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod';

const server = new McpServer({
    name: 'Ping Tool',
    version: '1.0.0'
});

async function medirPing() {
    const startTime = Date.now();
    try {
        await fetch('https://httpbin.org/get', {
            method: 'GET',
            cache: 'no-cache',
            mode: 'cors'
        });
        const endTime = Date.now();
        return endTime - startTime; 
    } catch (error) {
        throw new Error('No se pudo medir el ping');
    }
}

server.tool(
    'fetch-ping',
    'Tool to fetch your ping',
    {}, 
    async () => {
        try {
            const ping = await medirPing();
            return {
                content: [
                    {
                        type: 'text',
                        text: `Tu ping es ${ping} ms`
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error al medir el ping: ${error.message}`
                    }
                ]
            };
        }
    }
);

const transport = new StdioServerTransport();
await server.connect(transport);