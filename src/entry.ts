import { WaitForGlobal } from '@benbraide/inlinejs';

import { NativeElementCompact } from './components/native';
import { ResourceElementCompact } from './components/resource';
import { ResourceTargetElementCompact } from './components/resource-target';

export function InlineJSElement(){
    const registerElements = () => {
        try {
            NativeElementCompact();
            ResourceElementCompact();
            ResourceTargetElementCompact();
            console.log('Elements registered successfully');
        } catch (error) {
            console.log('Error registering elements:', error);
        }
    };

    // Try WaitForGlobal first
    WaitForGlobal().then(() => {
        console.log('WaitForGlobal resolved, registering elements');
        registerElements();
    }).catch(() => {
        // Fallback: try to register elements immediately if WaitForGlobal is not available
        console.log('WaitForGlobal failed, trying immediate registration');
        setTimeout(registerElements, 0);
    });
}
