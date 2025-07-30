import { Agent } from './types';

export interface MessageFormatResult {
    success: boolean;
    formattedMessage?: any;
    error?: string;
}

export class MessageFormatter {
    /**
     * Format a message according to an agent's input schema
     * @param message - The raw message text
     * @param agent - The agent to format the message for
     * @returns Formatted message result
     */
    static formatMessageForAgent(message: string, agent: Agent): MessageFormatResult {
        try {
            if (!message || !message.trim()) {
                return {
                    success: false,
                    error: 'Message cannot be empty'
                };
            }

            if (!agent) {
                return {
                    success: false,
                    error: 'Agent information is required'
                };
            }

            // If agent has an input schema, use it to format the message
            if (agent.input_schema && typeof agent.input_schema === 'object') {
                const result = this.formatWithSchema(message, agent.input_schema);

                // If schema formatting fails, fall back to default format
                if (!result.success) {
                    return {
                        success: true,
                        formattedMessage: { text: message.trim() }
                    };
                }

                return result;
            }

            // Default format for agents without schema - use the current format
            return {
                success: true,
                formattedMessage: { text: message.trim() }
            };
        } catch (error) {
            console.error('Message formatting error:', error);
            // Always fall back to default format on error
            return {
                success: true,
                formattedMessage: { text: message.trim() }
            };
        }
    }

    /**
     * Format message according to a specific schema
     * @param message - The raw message text
     * @param schema - The input schema to follow
     * @returns Formatted message result
     */
    private static formatWithSchema(message: string, schema: any): MessageFormatResult {
        try {
            // Handle different schema types
            if (schema.type === 'object' && schema.properties) {
                // Check if schema requires a 'text' field
                if (schema.properties.text) {
                    const formatted: any = { text: message.trim() };

                    // Add any other required fields with default values
                    if (schema.required && Array.isArray(schema.required)) {
                        for (const requiredField of schema.required) {
                            if (requiredField !== 'text' && !formatted[requiredField]) {
                                // Provide sensible defaults for common fields
                                switch (requiredField) {
                                    case 'timestamp':
                                        formatted[requiredField] = new Date().toISOString();
                                        break;
                                    case 'user_id':
                                        formatted[requiredField] = 'user';
                                        break;
                                    case 'session_id':
                                        formatted[requiredField] = `session-${Date.now()}`;
                                        break;
                                    default:
                                        // For unknown required fields, use empty string
                                        formatted[requiredField] = '';
                                }
                            }
                        }
                    }

                    return {
                        success: true,
                        formattedMessage: formatted
                    };
                }

                // If schema doesn't have text property, try to infer the format
                const properties = Object.keys(schema.properties);
                if (properties.length === 1) {
                    // Single property schema - use that property
                    const propertyName = properties[0];
                    return {
                        success: true,
                        formattedMessage: { [propertyName]: message.trim() }
                    };
                }
            }

            // If we can't understand the schema, fall back to default format
            return {
                success: true,
                formattedMessage: { text: message.trim() }
            };
        } catch (error) {
            return {
                success: false,
                error: `Schema formatting error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    /**
     * Validate a formatted message against a schema
     * @param formattedMessage - The formatted message to validate
     * @param schema - The schema to validate against
     * @returns Validation result
     */
    static validateMessage(formattedMessage: any, schema?: any): { valid: boolean; error?: string } {
        try {
            if (!schema) {
                // Without schema, just check that we have some content
                return {
                    valid: formattedMessage && typeof formattedMessage === 'object'
                };
            }

            if (schema.type === 'object' && schema.properties) {
                // Check required fields
                if (schema.required && Array.isArray(schema.required)) {
                    for (const requiredField of schema.required) {
                        if (!formattedMessage[requiredField]) {
                            return {
                                valid: false,
                                error: `Missing required field: ${requiredField}`
                            };
                        }
                    }
                }

                // Basic type checking for known properties
                for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
                    if (formattedMessage[propertyName] !== undefined) {
                        const propertyType = (propertySchema as any).type;
                        const actualType = typeof formattedMessage[propertyName];

                        if (propertyType && propertyType !== actualType) {
                            return {
                                valid: false,
                                error: `Field ${propertyName} should be ${propertyType}, got ${actualType}`
                            };
                        }
                    }
                }
            }

            return { valid: true };
        } catch (error) {
            return {
                valid: false,
                error: error instanceof Error ? error.message : 'Validation error'
            };
        }
    }

    /**
     * Get a human-readable description of the expected message format
     * @param agent - The agent to describe the format for
     * @returns Format description
     */
    static getFormatDescription(agent: Agent): string {
        if (!agent.input_schema) {
            return 'Standard text message format';
        }

        try {
            if (agent.input_schema.type === 'object' && agent.input_schema.properties) {
                const properties = Object.keys(agent.input_schema.properties);
                const required = agent.input_schema.required || [];

                if (properties.includes('text')) {
                    const otherRequired = required.filter((field: string) => field !== 'text');
                    if (otherRequired.length === 0) {
                        return 'Text message format';
                    } else {
                        return `Text message with additional fields: ${otherRequired.join(', ')}`;
                    }
                }

                return `Object format with fields: ${properties.join(', ')}`;
            }

            return 'Custom message format';
        } catch {
            return 'Unknown message format';
        }
    }
}