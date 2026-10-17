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
        /*if (!context.chat[context.chat.length - 1].is_user){
            console.log("not rolling - not a user message");
            return;
        }*/
        const rolls = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
        const INJECTED_MESSAGE = `<dice>\nRandom d100 rolls you may use: ${rolls.join(', ')}.\nIf you see this, use these rolls instead of the code tool. The user does not see this.\nUse each roll at most once, in strict left-to-right order, then discard unused results.\nSometimes, no events require randomness and the dice can be ignored. Never fake dice rolls.</dice>`;
        console.log(`[SYSTEM: ${INJECTED_MESSAGE}]`);
        context.setExtensionPrompt(
            MODULE_NAME, INJECTED_MESSAGE, extension_prompt_types.IN_CHAT, 0, false, extension_prompt_roles.SYSTEM, null
        ); // key, value, position, depth, use_in_worldingo_scan, role, filter_func
        await saveMetadata();
    }
    eventSource.on(event_types.CHAT_CHANGED, injectMessage);
    eventSource.on(event_types.MESSAGE_SENT, injectMessage);
    eventSource.on(event_types.MESSAGE_SWIPED, injectMessage);
});

