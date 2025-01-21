import { FormGroup } from '@angular/forms';

export function getErrorMsg(
    formGroup: FormGroup,
    controlName: string,
    controlLabel: string,
    isPattern: boolean = false,
    patternMsg: string = 'Invalid ' + controlLabel
): string {
    const control = formGroup.get(controlName);

    if (!control) {
        throw new Error(`Control ${controlName} not found in the form group.`);
    }

    if (control.hasError('required')) {
        return `${controlLabel} is required`;
    }

    if (control.hasError('email')) {
        return `Not a valid ${controlLabel}`;
    }

    if (control.hasError('whitespace')) {
        return `${controlLabel} is required`;
    }

    if (isPattern && control.hasError('pattern')) {
        return patternMsg;
    }

    return patternMsg;
}