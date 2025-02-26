import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    HostBinding,
    HostListener,
    Input,
    Optional,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";

import { MenuGroupComponent } from "../menu-group/menu-group.component";
import { MenuItemBaseComponent } from "../menu-item/menu-item-base";

/**
 * @ignore
 */

/**
 * Menu item component with check/uncheck option,
 * use (change) event to get state of this item
 */
@Component({
    selector: "nui-menu-option",
    template: `
        <div class="nui-menu-item__option" #menuOption tabindex="-1">
            <nui-checkbox class="nui-menu-item__checkbox"
                          [name]="name"
                          [value]="value"
                          [checked]="checked"
                          [disabled]="disabled">

                <ng-content></ng-content>
            </nui-checkbox>
        </div>
    `,
    styleUrls: ["./menu-option.component.less"],
    providers: [
        {
            provide: MenuItemBaseComponent,
            useExisting: forwardRef(() => MenuOptionComponent),
        },
    ],
    encapsulation: ViewEncapsulation.None,
    host: { "role": "menuitemcheckbox" },
})
export class MenuOptionComponent extends MenuItemBaseComponent {
    /**
     * Sets inner input "name" attribute
     */
    @Input() public name: string;
    /**
     * Sets inner input "value" attribute
     */
    @Input() public value: string;
    /**
     * Is needed to predefine item state, sets nui-checkbox [checked] property
     */
    @Input() public checked: boolean;

    @ViewChild("menuOption") menuItem: ElementRef;

    @HostListener("click", ["$event"])
    public stopPropagationOfClick(event: MouseEvent) {
        event.stopPropagation();
        if (!this.disabled) {
            event.preventDefault();
            this.checked = !this.checked;
            this.actionDone.emit(this.checked);
        }
    }

    @HostBinding("class.checked")
    public get checkedClass() {
        return this.checked;
    }

    constructor(@Optional() readonly group: MenuGroupComponent, cd: ChangeDetectorRef) {
        super(group, cd);

        this.name = "";
        this.value = "";
        this.checked = false;

        // Is needed to predefine item state, sets nui-checkbox [disabled] property
        this.disabled = false;
    }

    public doAction(): void {
        this.checked = !this.checked;
        this.actionDone.emit(this.checked);
    }

}
