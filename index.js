import { extension_prompt_types, extension_prompt_roles } from '../../../../script.js';
export { MODULE_NAME };

const MODULE_NAME = 'random-d100';

jQuery(async () => {
    const context = SillyTavern.getContext();

    const {
        eventSource,
        event_types,
        chatMetadata,
        saveMetadata,
    } = context;
    const injectMessage = async () => {
        if (!context.chat[context.chat.length - 1].is_user){
            console.debug("not rolling - not a user message");
            return;
        }
        const rolls = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
        const INJECTED_MESSAGE = `Random d100 rolls you may use: ${rolls.join(', ')}. Use in left-to-right order on events that need RNG, ignore unused rolls.`;
        console.log(`[SYSTEM: ${INJECTED_MESSAGE}]`);
        context.setExtensionPrompt(
            MODULE_NAME, INJECTED_MESSAGE, extension_prompt_types.IN_CHAT, 0, false, extension_prompt_roles.SYSTEM, null
        ); // key, value, position, depth, use_in_worldingo_scan, role, filter_func
        await saveMetadata();
    }
    eventSource.on(event_types.MESSAGE_SENT, injectMessage);
    eventSource.on(event_types.CHAT_LOADED, injectMessage);
});

