import { WaitForGlobal } from '@benbraide/inlinejs';
import { NativeElementCompact } from './components/native';
import { ResourceElementCompact } from './components/resource';
import { ResourceTargetElementCompact } from './components/resource-target';
export function InlineJSElement() {
    WaitForGlobal().then(() => {
        NativeElementCompact();
        ResourceElementCompact();
        ResourceTargetElementCompact();
    });
}
